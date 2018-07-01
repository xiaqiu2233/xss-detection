import {URL} from 'url'
import {originFilter, fileFilter, httpFilter} from './filter'
import db from '../db/index'
import {openPage, closePage} from './browser'

/**
 * 查找所有的a标签
 * @param {object} page page对象
 */
export async function queryLinks (page) {
  const nodeList = await page.$$eval('a', nodes => {
    return nodes.map(item => item.href)
  })
  return nodeList
}

/**
 * 寻找当前页面上，所有的注入点，及其对应的交互点
 * @param {object} page page对象
 */
export async function queryInjectPoints (page) {
  // $$eval 等价于 querySelectorAll。 selectors可以用逗号分隔
  const inputList = await page.$$eval('input[type=text], input[type=hidden], input[type=url], textarea', nodes => {
    // $$eval 回调运行在浏览器端，而非node端，所以需要这么写
    function getQuerySelector (dom) {
      let selector = ''
      let p = dom
      while (p && p.parentElement !== null) {
        if (p.id) {
          selector = '#' + p.id + ' ' + selector
        } else if (p.className) {
          let tmp = Array.prototype.slice.call(p.classList).join('.')
          selector = '.' + tmp + ' ' + selector
        } else {
          selector = p.tagName.toLowerCase() + ' ' + selector
        }
        p = p.parentElement
      }
      return selector.trim()
    }

    return nodes.map(item => {
      // 寻找交互点，简单粗暴的方法
      const active = item.parentElement.querySelector('input[type=buton], input[type=submit], input[type=reset], button[type=button], button[type=submit], button[type=reset]')
      const a = getQuerySelector(active)
      const s = getQuerySelector(item)
      return {injectPoints: s, activePoints: a}
    })
  })

  const formList = await page.$$eval('form', nodes => {
    function getQuerySelector (dom) {
      let selector = ''
      let p = dom
      while (p && p.parentElement !== null) {
        if (p.id) {
          selector = '#' + p.id + ' ' + selector
        } else if (p.className) {
          let tmp = Array.prototype.slice.call(p.classList).join('.')
          selector = '.' + tmp + ' ' + selector
        } else {
          selector = p.tagName.toLowerCase() + ' ' + selector
        }
        p = p.parentElement
      }
      return selector.trim()
    }

    return nodes.map(item => {
      // 寻找交互点
      const active = item.querySelector('input[type=buton], input[type=submit], input[type=reset], button[type=button], button[type=submit], button[type=reset]')
      const a = getQuerySelector(active)
      const s = getQuerySelector(item)
      return {injectPoints: s, activePoints: a}
    })
  })

  return [...inputList, ...formList]
}

/**
 * 寻找当前页面url上，所有的内链 及 注入点和对应交互点
 * @param {string} url url
 */
export async function getLinksAndInjectPoints (url) {
  console.log(url)
  const page = await openPage(url)

  // 强制延时1秒
  await new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, 2000)
  })

  const urlList = await queryLinks(page)
  const injectPointsList = await queryInjectPoints(page)
  console.log(urlList, injectPointsList)
  const links = urlList
    .filter(item => httpFilter(item))
    .filter(item => originFilter(item, url))
    .filter(item => item.indexOf('logout') === -1)
    .filter(item => fileFilter(item))

  closePage(page)
  return {
    links: Array.from(new Set(links)),
    injectPoints: injectPointsList.map(item => item.injectPoints),
    activePoints: injectPointsList.map(item => item.activePoints)
  }
}
/**
 * 保存内链到page表
 * @param {array} urls 内链url数组，即当前页面url的所有内链
 * @param {string} relatedUrl 内链url数组，所在的页面url，即当前页面url
 */
export async function saveLinks (urls, relatedUrl) {
  const origin = new URL(relatedUrl).origin
  const [{id: siteId}] = await db.query('site', {origin: origin})

  for (let i = 0; i < urls.length; i++) {
    try {
      // 先查询
      const [r] = await db.query('page', {url: urls[i]})
      if (r) {
        continue
      }
      // 没有再插入
      let result = await db.insert('page', {
        site_id: siteId,
        url: urls[i],
        related_url: relatedUrl,
        origin: origin
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }
}

/**
 * 保存注入点到inject_points表
 * @param {string} url 页面url
 * @param {string} injectPoints 注入点selector
 * @param {string} activePoints 交互点selector
 */
export async function saveInjectPoints (url, injectPoints, activePoints) {
  const [{id: pageId}] = await db.query('page', {url: url})
  for (let i = 0; i < injectPoints.length; i++) {
    try {
      let result = await db.insert('inject_points', {
        page_id: pageId,
        page_url: url,
        inject_point: injectPoints[i],
        active_point: activePoints[i]
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }
}
