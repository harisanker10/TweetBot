const sleep = (time) => {

    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, time*1000)
    })
}


const addTime = (string) => {

    const date = new Date();
    return `${string}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
}

const addDate = (string) =>{
    const date = new Date();
    return `${string}_${date.getDate}-${date.getMonth}-${date.getFullYear}`;
}


module.exports = {sleep,addTime,addDate};