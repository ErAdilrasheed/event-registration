const puppeteer = require('puppeteer')

async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px',
    },
  })


  await browser.close()
  return pdfBuffer
}

module.exports = generatePdfFromHtml
