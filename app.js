// final version tying it all together: scraping, cron-job, mailing via Sendgrid

// v2 version tries to integrate the callbacks

require('dotenv').config();
const sgMail = require('@sendgrid/mail')
const cron = require('node-cron');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

let title = "";

(async function scrapeData(){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(
      'https://www.xe.com/currencycharts/?from=ETH&to=THB'

      , {
      timeout: 180000
    });
    let bodyHTML = await page.evaluate(() => document.body.innerHTML);

    let $ = cheerio.load(bodyHTML);

    let price_intro = $("p:contains('1 ETH')")

    price_intro.each((index, element) => {

      title = $(element).text()

      console.log(title)

    });

  } catch (err) {
    console.log(err);
  }

  await browser.close();

  // define message
  sgMail.setApiKey(process.env.API_KEY)


  const msg = {
  // to: ['joris_falter@hotmail.com', 'marjon88@hotmail.com'], // Change to your recipient
  to: 'joris_falter@hotmail.com', // Change to your recipient
  from: 'joris@jorisfalter.com', // Change to your verified sender
  subject: title,
  text: title
  
  }

  console.log(msg);

  // cron.schedule('* 2 10 * *', () => {
  cron.schedule('1 * * * * *', () => {
    // console.log('running every day at 2.10am UTC, 9.10am BKK')
    console.log('running every first second of the minute')
    sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
  
  })

})();





