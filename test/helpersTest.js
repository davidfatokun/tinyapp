const {assert} = require('chai');

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


describe('getUserByEmail', function () {
    it('should return a user with same id, email and password', function () {
        const actualUser = getUserByEmail("user@example.com", testUsers)
        const expectedUser = {
            id: "b2xVn2",
            email: "user@example.com",
            password: "$2a$10$kgyaDXX1IsqUW0LQKkobSuwsZhvnb6Xvavpxg29Ep3J9oGCoIBtcq", // "purple-monkey-dinosaur"
        };
        assert.deepEqual(actualUser["id"], expectedUser["id"]);
        assert.deepEqual(actualUser["email"], expectedUser["email"]);
        assert.deepEqual(actualUser["password"], expectedUser["password"]);
    });
});

describe('urlsForId', function () {
    it('should return all urls created by this user', function () {
        const actualUrls = urlsForId("9sm5xK", testUrlDatabase)
        const expectedUrls = {
            "GuXP9r": {
                longURL: "https://www.google.ca",
                userID: "9sm5xK",
            },
            "b6UTxQ": {
                longURL: "https://www.tsn.ca",
                userID: "9sm5xK",
            }
        };
        let actualIds = Object.keys(actualUrls);
        let expectedIds = Object.keys(expectedUrls);
        for (let i = 0; i < expectedIds.length; i++) {
            assert(actualIds.includes(expectedIds[i]));
            let actualUrl = actualUrls[expectedIds[i]];
            let expectedUrl = expectedUrls[expectedIds[i]];
            assert.deepEqual(actualUrl["longURL"], expectedUrl["longURL"]);
            assert.deepEqual(actualUrl["userID"], expectedUrl["userID"]);
        }

    });
});

describe('generateRandomString', function () {
    it('should return a valid and random 6 character id string', function () {
        const randomString = generateRandomString().trim();
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        assert.deepEqual(randomString.length, 6);
        for (const randomStringElement of randomString) {
            assert(characters.includes(randomStringElement));
        }
    });
});
