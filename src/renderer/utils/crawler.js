import {URL} from 'url'
import {originFilter} from './filter'
import db from '../db/index'
import {openPage} from './browser'

export async function queryLinks (page) {
  const nodeList = await page.$$eval('a', nodes => {
    return nodes.map(item => item.href)
  })

  return nodeList
}

export async function getLinks (url) {
  console.log(url)
  const page = await openPage(url)

  const urlList = await queryLinks(page)
  const links = urlList
    .filter(item => originFilter(item, url))
    .filter(item => item.indexOf('logout') === -1)
  return Array.from(new Set(links))
}

export async function saveLinks (urls) {
  for (let i = 0; i < urls.length; i++) {
    try {
      let result = await db.insert('page', {
        url: urls[i]
      })
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }
}

export async function getLinksRecursively (url) {
  // 插入site表
  const u = new URL(url)
  let result = await db.insert('site', {
    url: url,
    origin: u.origin
  })
  console.log(result.insertId)

  const urls = await getLinks(this.url)
  await saveLinks(urls)
}

export async function queryAllLinks (page, url) {
  let m = new Map()
  m.set(url, {visited: true})
  const links = await getLinks(page)
  links.filter(item => m.get(url))
    .forEach(item => m.set(item, {visited: false}))
  while (true) {

  }
}
