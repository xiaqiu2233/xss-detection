import puppeteer from 'puppeteer'

let browser //, pages = []

export async function openPage (url) {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      // slowMo: 10,
      devtools: false
    })
  }

  const page = await browser.newPage()

  if (url) {
    await page.goto(url)
  }
  return page
}
