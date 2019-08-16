function getUserSync(userId) {
    let user;
    let rnd = random(100, 1000);
    user = 'User ID: ' + rnd;

    async () => {
        await sleep(rnd);
    };

    return user;
}

function random(low, high) {
    return Math.random() * (high - low) + low
}

function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

module.exports = {
    getUserSync,
};
