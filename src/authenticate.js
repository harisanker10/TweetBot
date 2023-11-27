require('dotenv').config();
const fs = require('fs').promises;
const { sleep } = require('./utilityFunctions');


const authenticate = async (page) => {

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

        await sleep(5);

        await page.type('[name="password"]', process.env.PASSWORD);



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
        console.log('You are logged in');


        const cookies = await page.cookies();
        if (cookies) console.log('got cookies');
        await fs.writeFile(`./cookies/cookies.json`, JSON.stringify(cookies, null, 2));


    }
    catch (err) {
        console.log(err);
    }
}

module.exports = authenticate;