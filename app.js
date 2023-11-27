const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
require('dotenv').config();
const getFact = require('./src/getCatFact');

const fs = require('fs').promises

puppeteer.use(StealthPlugin());

const { sleep, addTime } = require('./src/utilityFunctions');
const authenticate = require('./src/authenticate');
const setCookie = require('./src/setCookie');



const main = async () => {



    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    const recorder = await page.screencast({ path: `./recordings/${addTime('recording')}.webm` });
    console.log('started')
    const savePath = './screenshots/test1';
    try {

        try {
            const cookiePath = './cookies/cookies.json'
            await setCookie(page, cookiePath);
            console.log('Cookies loaded successfully.')
        } catch (err) {
            console.log(`Couldn't set cookies`, err);
            await authenticate(page);
        }
        
        await page.goto('https://twitter.com/compose/tweet',{ waitUntil: 'domcontentloaded'});
        await sleep(5)

        const fact = await getFact();
        console.log(`Fact generated: ${fact}`);
        await sleep(10)
        console.log('Tweeting..')
        await page.evaluate(async () => {
            const div = document.querySelector('[role="textbox"]');
            if(div)
            await div.click();
            else console.log('didnt get input box')
        })

        await page.keyboard.type(fact);
        const tweetBtn = await page.$('div[data-testid="tweetButton"]');
        await tweetBtn.click();


        console.log("Tweeted successfully")

    } catch (err) {
        console.log('Error occured retrying...',err);
        main();
    } finally {

        console.log('done')
        page.wait
        await recorder.stop();
        await browser.close();
        return;
    }



}
main();

setInterval(()=>{
    main()
},1000*60*20)

