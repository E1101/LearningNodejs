function getUserSync(userId) {
    let user;
    let rnd = random(100, 1000);
    user = 'User ID: ' + userId;

    sleep(rnd);
    console.log('Took ' + rnd + 'to fetch.');

    return user;
}

function random(low, high) {
    return Math.random() * (high - low) + low
}

async function sleep(ms){
    await new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

module.exports = {
    getUserSync,
};
