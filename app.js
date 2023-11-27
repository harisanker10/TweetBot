const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();
const getFact = require('./src/getCatFact');

const fs = require('fs').promises

puppeteer.use(StealthPlugin());

const { sleep, addTime } = require('./src/utilityFunctions');
const authenticate = require('./src/authenticate');
const setCookie = require('./src/setCookie');


(
    async () => {



        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        const recorder = await page.screencast({ path: `./recordings/${addTime('recording')}.webm` });
        const savePath = './screenshots/test1';
        try {

            try {
                const cookiePath = './cookies/cookies.json'
                await setCookie(page, cookiePath);
            } catch (err) {
                console.log(`couldn't set cookies`, err);
                await authenticate(page);
            }
            await page.goto('https://twitter.com/compose/tweet', { waitUntil: 'networkidle2' });
            await sleep(2)

            const fact = await getFact();
            console.log(`Fact generated: ${fact}`);
            console.log('Tweeting..')

            await page.keyboard.type(fact);
            const tweetBtn = await page.$('div[data-testid="tweetButton"]');
            await tweetBtn.click();


            console.log("Tweeted successfully")

        } catch (err) {
            console.log(err);
        } finally {

            console.log('done')
            await recorder.stop();
            await browser.close();
            return;
        }



    }
)()

