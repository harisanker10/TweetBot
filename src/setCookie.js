const fs = require('fs').promises

const setCookie = async (page,path) => {

    const cookieString = await fs.readFile(path)
    const cookies = JSON.parse(cookieString)
    await page.setCookie(...cookies);

}

module.exports = setCookie;