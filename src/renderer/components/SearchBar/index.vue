<template>
  <div class="search">
    <div class="search-div">
      <Input v-model="url" placeholder="请输入要检测的URL">
        <Button slot="append" icon="ios-browsers-outline" @click="open"></Button>
      </Input>
    </div>
    <div class="search-operation">
      <Button type="primary" v-if="ready && !finding" @click="startSearch">开始爬取</Button>
      <Button type="error" v-if="ready && finding" @click="stopSearch">结束爬取</Button>
    </div>
    <div class="search-list">
      <Table :loading="loading" :columns="columns" :data="data" height="375"></Table>
    </div>
  </div>
</template>

<script>
// import puppeteer from 'puppeteer'
import CREDS from './creds'
// import { URL } from 'url'
import db from '../../db/index.js'
import { getLinksAndInjectPoints, saveLinks, saveInjectPoints } from '../../utils/crawler.js'
import { openPage, closePage, closeBrowser } from '../../utils/browser.js'

const USERNAME_SELECTOR = '#vwriter'
const PASSWORD_SELECTOR = '#vpassword'
const BUTTON_SELECTOR = '#topguideloginform > div:nth-child(4) > button'
const SHOW_LOGIN = '#js_login'
const SHOW_LOGIN2 = '#loginWin_content_wrapper > div.loginWin-tab > a.normal-login-tab'
// const INJECTION_POINT_SELECTOR = ['form', 'input', 'textarea']
// const INJECTION_POINT_SELECTOR = '#top_nav_test'

export default {
  data () {
    return {
      // url: 'http://blog.tianya.cn/',
      url: 'http://localhost:8080/WebGoat',
      loading: true,
      ready: false,
      finding: false,
      findTimeout: null,
      browser: {},
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'URL',
          key: 'url'
        },
        {
          title: 'Visited',
          width: 100,
          render (h, params) {
            return h('div', {
              props: {
              }
            },
            [
              params.row.inject_points ? 'true' : 'false'
            ]
            )
          }
        }
      ],
      data: [
        {
          url: 'John Brown',
          visited: true
        },
        {
          url: 'Jim Green',
          visited: true
        },
        {
          url: 'Joe Black',
          visited: true
        }
      ]
    }
  },
  methods: {
    async open () {
      this.ready = true

      const page = await openPage(this.url)
      // 先查询
      const [r] = await db.query('site', {origin: new URL(this.url).origin})
      if (r) {
        this.siteInsertId = r.id
        return
      } else {
        // 没有再插入
        const r = await db.insert('site', {
          start_url: this.url,
          origin: new URL(this.url).origin
        })
        this.siteInsertId = r.insertId
      }

      // 先查询
      const [rr] = await db.query('page', {url: this.url})
      if (!rr) {
        await db.insert('page', {
          site_id: this.siteInsertId,
          url: this.url
        })
      }

      closePage(page)
    },
    async startSearch () {
      // this.finding = true
      // 只要有查询结果，就一直执行。
      while (true) {
        let result = await this.findOne()
        if (!result) break
      }
    },
    stopSearch () {
      this.finding = false
    },
    // 获取1个未访问或的page url
    async findOne () {
      console.log('finding...')
      const [p] = await db.getNoneVisitedPages(false)
      // 没有查询结果的时候，返回
      if (!p) return false

      // 获取所有的 内链 和 可能注入点
      const {links, injectPoints, activePoints} = await getLinksAndInjectPoints(p.url)
      await saveLinks(links, p.url)

      await saveInjectPoints(p.url, injectPoints, activePoints)
      const result = await db.updatePageToVisited(p.url)
      console.log('links: ', links, result)
      return true
    },

    // 没用了，暂时保留
    async handleUrl () {
      const page = await this.browser.newPage()
      await page.setDefaultNavigationTimeout(100000)
      // Get the "viewport" of the page, as reported by the page.
      const dimensions = await page.evaluate(() => {
        return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
          deviceScaleFactor: window.devicePixelRatio
        }
      })

      console.log('Dimensions:', dimensions)

      // {width: 600, height: 700}
      page.setViewport(dimensions)
      await page.goto(this.url)

      console.log(await page.evaluate('1 + 2')) // prints "3"

      await page.waitForSelector(SHOW_LOGIN)
      // 登录流程
      await page.click(SHOW_LOGIN)
      await page.waitForSelector(SHOW_LOGIN2)
      await page.click(SHOW_LOGIN2)

      await page.click(USERNAME_SELECTOR)
      await page.keyboard.type(CREDS.username)
      await page.click(PASSWORD_SELECTOR)
      await page.keyboard.type(CREDS.password)
      await page.click(BUTTON_SELECTOR)

      // const x = 10
      // console.log(await page.evaluateOnNewDocument(`1 + ${x}`)) // prints "11"

      // 跳转到起始页面
      const a = await page.evaluateOnNewDocument((sel) => {
        console.log('sb', sel)
        // const udiv = Array.from(sel)
        return Promise.resolve(sel)
      }, '#top_nav_test')

      console.log(a)
    }
  },
  async created () {
    window.a = this
    window.db = db

    await db.connect()
    let pages = await db.getNoneVisitedPages(true)
    this.data = Array.from(pages)
    this.loading = false
  },
  async mounted () {

  },
  destroyed () {
    closeBrowser()
    // this.browser.close()
    // console.log('destroy', this.browser)
  }
}
</script>

<style>
.search {
  padding: 20px;
}
.search-div {
  width: 50%;
  margin: 40px auto 10px;
}
.search-operation {
  margin: 20px;
}
.search-list {
  margin: 20px;
}
</style>
