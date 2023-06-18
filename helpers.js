// RETURN the user with this email, or RETURN null if none is found
function getUserByEmail(email, users) {
    for (const id in users) {
        if (email === users[id]["email"]) {
            return users[id];
        }
    }
    return null;
}

// RETURN all the urls created by this userID
function urlsForId(userId, urlDatabase) {
    let urlData = {};
    for (const urlId in urlDatabase) {
        if (userId === urlDatabase[urlId]["userID"]) {
            urlData[urlId] = urlDatabase[urlId];
        }
    }
    return urlData;
}

// RETURN a randomly generated 6-digit alphanumeric id
function generateRandomString() {
    let charCodes = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 6; i++) {
        charCodes += characters[Math.floor(Math.random() * characters.length)];
    }
    return charCodes;
}

module.exports = {
    getUserByEmail,
    urlsForId,
    generateRandomString
}
