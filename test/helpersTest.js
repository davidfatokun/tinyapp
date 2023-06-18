const { assert } = require('chai');

const {getUserByEmail, urlsForId, generateRandomString} = require('../helpers');

let testUrlDatabase = {
    "X7buRT": {
        longURL: "https://www.lighthouselabs.ca",
        userID: "b2xVn2",
    },
    "GuXP9r": {
        longURL: "https://www.google.ca",
        userID: "9sm5xK",
    },
    "b6UTxQ": {
        longURL: "https://www.tsn.ca",
        userID: "9sm5xK",
    },
    "i3BoGr": {
        longURL: "https://www.walmart.ca",
        userID: "b2xVn2",
    },
};

let testUsers = {
    "b2xVn2": {
        id: "b2xVn2",
        email: "user@example.com",
        password: "$2a$10$kgyaDXX1IsqUW0LQKkobSuwsZhvnb6Xvavpxg29Ep3J9oGCoIBtcq", // "purple-monkey-dinosaur"
    },
    "9sm5xK": {
        id: "9sm5xK",
        email: "user2@example.com",
        password: "$2a$10$LXPRQJXfvWkxSokQ/CM.9OOZo.OUjKQcdCHXHPyhYzOaJOnN5aCD2", // "dishwasher-funk"
    },
};


describe('getUserByEmail', function() {
    it('should return a user with valid email', function() {
        const user = getUserByEmail("user@example.com", testUsers)
        const expectedUserID = "userRandomID";
        // Write your assert statement here
    });
});
