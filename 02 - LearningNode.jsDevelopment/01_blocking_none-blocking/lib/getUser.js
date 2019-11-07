function getUser(userId, callback) {
    let user;
    let rnd = random(100, 1000);
    user = 'User ID: ' + userId;

    console.log('Took ' + rnd + 'to fetch.');
    let err = null;
    setTimeout(() => callback(err, user), rnd);
}

function random(low, high) {
    return Math.random() * (high - low) + low
}

module.exports = {
    getUser,
};
