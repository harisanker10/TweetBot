const puppeteer = require('puppeteer');
const PuppeteerVideoRecorder = require('puppeteer-video-recorder');
require('dotenv').config();
const getFact = require('./getCatFact');



const timeoutFor = (time) => {

    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, time*1000)
    })
}


const addTime = (string) => {

    const date = new Date();
    return `${string}${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

(
    async () => {



        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        const recorder = await page.screencast({ path: `${addTime('recording')}.webm` });
        const savePath = './screenshots/test1';
        try {

            await page.goto('https://twitter.com/login', { waitUntil: 'networkidle0' });
            console.log('Navigated to twitter')


            const usernameInput = await page.$('input[name="text"]');
            if (!usernameInput) {
                console.log('usernameInput not found');
                return;
            }

            await usernameInput.type(process.env.USERNAME);
            await page.evaluate(() => {
                const nextBtn = document.evaluate("//span[text()='Next']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                nextBtn ? nextBtn.click() : console.log("Next button not found");
            });

            console.log('selecting password')

            await timeoutFor(5);

            try {
                console.log('trying to type password')
                await page.type('[name="password"]', process.env.PASSWORD);

            } catch (err) {
                console.log("can't type by default, ", err);
            }

            await page.evaluate(async () => {

                console.log('trying to get log in btn')

                const LogInBtn = document.evaluate("//span[text()='Log in']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (LogInBtn) {
                    await LogInBtn.click();
                    console.log("Log In Button Clicked")
                } else {
                    console.log('LogInBtn not found');
                }
            })
            await page.waitForNavigation();
            console.log('You are logged in')
            await page.waitForSelector('img', {
                visible: true,
            })


            // const tweetInputBox = await page.$('[data-testid="tweetTextarea_0"]');
            // await tweetInputBox.click()
            console.log('Navigating to tweet input');
            await page.goto('https://twitter.com/compose/tweet',{ waitUntil: 'domcontentloaded' });
            await timeoutFor(5)
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
            browser.close();
            return;
        }



    }
)()

