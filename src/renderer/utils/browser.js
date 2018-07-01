import puppeteer from 'puppeteer'

let browser //, pages = []

/**
 * puppeteer 用 headless chrome 打开 url 页面
 * @param {string} url url
 */
export async function openPage (url) {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      // slowMo: 10,
      devtools: false
    })
  }

  const page = await browser.newPage()
  window.p = page

  if (url) {
    await page.goto(url)
  }

  page.on('request', request => {
    console.log('request: ', request.url())
    // request.respond({
    //   status: 404,
    //   contentType: 'text/plain',
    //   body: 'Not Found!'
    // });
  })
  return page
}

/**
 * puppeteer 用 headless chrome 关闭 url 页面
 * @param {string} url url
 */
export async function closePage (page) {
  page.close()
}

/**
 * puppeteer 关闭浏览器
 * @param {string} url url
 */
export async function closeBrowser (page) {
  if (browser) {
    browser.close()
  }
}
