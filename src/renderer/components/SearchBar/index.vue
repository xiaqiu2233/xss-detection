<template>
  <div class="search-div">
    <Input v-model="url" placeholder="请输入要检测的URL">
      <Button slot="append" icon="search" @click="handleUrl"></Button>
    </Input>
  </div>
</template>

<script>
const puppeteer = require('puppeteer')
const CREDS = require('./creds')

const USERNAME_SELECTOR = '#vwriter'
const PASSWORD_SELECTOR = '#vpassword'
const BUTTON_SELECTOR = '#topguideloginform > div:nth-child(4) > button'
const SHOW_LOGIN = '#js_login'
const SHOW_LOGIN2 = '#loginWin_content_wrapper > div.loginWin-tab > a.normal-login-tab'
// const INJECTION_POINT_SELECTOR = ['form', 'input', 'textarea']
const INJECTION_POINT_SELECTOR = '#top_nav_test'

export default {
  data () {
    return {
      url: '',
      browser: {}
    }
  },
  methods: {
    async handleUrl () {
      const page = await this.browser.newPage()
      await page.setDefaultNavigationTimeout(100000)
      await page.goto(this.url)
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

      // 跳转到起始页面
      await page.evaluate((sel) => {
        console.log('sb')
        const udiv = Array.from(sel)
        return udiv
      }, INJECTION_POINT_SELECTOR)
    }
  },
  async created () {
    this.browser = await puppeteer.launch({headless: false})
  }
}
</script>

<style>
  .search-div{
    width: 50%;
    margin: 40px auto;
  }
</style>
