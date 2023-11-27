// https://catfact.ninja/fact?max_length=240

const axios = require('axios');

/*
@return String
*/
const getFact = async () => {
    const fact = await axios('https://catfact.ninja/fact?max_length=240', {
        headers: {
            'Accept': 'application/json'
        }
    });

    return fact.data.fact;
}

module.exports = getFact;

