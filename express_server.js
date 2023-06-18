const {getUserByEmail, urlsForId, generateRandomString} = require("./helpers");
const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));

let urlDatabase = {
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

let users = {
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

let secretKeys = Object.keys(users);
app.use(cookieSession({
    name: 'session',
    keys: secretKeys,
}));

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls", (req, res) => {
    if (req.session["user_id"]) {
        let urlData = urlsForId(req.session["user_id"], urlDatabase)
        const templateVars = {urls: urlData, user: users[req.session["user_id"]]};
        res.render("urls_index", templateVars);
    } else {
        res.status(400).send('You Dont Have Access to the Data In This Link Without Being Logged In');
    }

})

app.post("/urls", (req, res) => {
    if (req.session["user_id"]) {
        let urlID = generateRandomString().toString();
        urlDatabase[urlID] = {longURL: req.body.longURL.toString(), userID: req.session["user_id"]};
        res.redirect("/urls/" + urlID);
    } else {
        res.status(400).send('Unable to Complete Request Because You Dont Have Privilege to Create New Links Without Being Logged In');
    }
});

app.get("/urls/new", (req, res) => {
    if (req.session["user_id"]) {
        const templateVars = {user: users[req.session["user_id"]]};
        res.render("urls_new", templateVars);
    } else {
        res.redirect("/login");
    }
});

app.get("/urls/:id", (req, res) => {
    if (req.session["user_id"]) {
        let userUrlKeys = Object.keys(urlsForId(req.session["user_id"], urlDatabase));
        let allKeys = Object.keys(urlDatabase);
        if (userUrlKeys.includes(req.params.id)) {
            const templateVars = {
                id: req.params.id,
                longURL: urlDatabase[req.params.id]["longURL"],
                user: users[req.session["user_id"]]
            };
            res.render("urls_show", templateVars);
        } else if (!allKeys.includes(req.params.id)) {
            res.status(400).send('A Link With This Short Url Does Not Exist');
        } else {
            res.status(400).send('You Dont Have Access to This Link Because You Dont Own It');
        }
    } else {
        res.status(400).send('You Dont Have Access to the Data In This Link Without Being Logged In');
    }
});

app.post("/urls/:id", (req, res) => {
    if (req.session["user_id"]) {
        let userUrlKeys = Object.keys(urlsForId(req.session["user_id"], urlDatabase));
        let allKeys = Object.keys(urlDatabase);
        if (userUrlKeys.includes(req.params.id)) {
            urlDatabase[req.params.id]["longURL"] = req.body.longURL.toString();
            res.redirect("/urls");
        } else if (!allKeys.includes(req.params.id)) {
            res.status(400).send('A Link With This Short Url Does Not Exist');
        } else {
            res.status(400).send('You Dont Have Access to This Link Because You Dont Own It');
        }
    } else {
        res.status(400).send('You Dont Have Access to the Data In This Link Without Being Logged In');
    }
});

app.post("/urls/:id/delete", (req, res) => {
    if (req.session["user_id"]) {
        let userUrlKeys = Object.keys(urlsForId(req.session["user_id"], urlDatabase));
        let allKeys = Object.keys(urlDatabase);
        if (userUrlKeys.includes(req.params.id)) {
            delete urlDatabase[req.params.id];
            res.redirect("/urls");
        } else if (!allKeys.includes(req.params.id)) {
            res.status(400).send('A Link With This Short Url Does Not Exist');
        } else {
            res.status(400).send('You Dont Have Access to This Link Because You Dont Own It');
        }
    } else {
        res.status(400).send('You Dont Have Access to the Data In This Link Without Being Logged In');
    }
});

app.get("/u/:id", (req, res) => {
    const longURL = urlDatabase[req.params.id]["longURL"];
    if (longURL === undefined) {
        res.status(400).send('No such short url in database');
    } else {
        res.redirect(longURL);
    }
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/register", (req, res) => {
    if (req.session["user_id"]) {
        res.redirect("/urls");
    } else {
        const templateVars = {user: users[req.session["user_id"]]};
        res.render("urls_register", templateVars);
    }
});

app.post("/register", (req, res) => {
    let user = getUserByEmail(req.body.email, users);
    if (req.body.email === "" || req.body.password === "") {
        res.status(400).send('Invalid email or password');
    } else if (user) {
        res.status(400).send('Email is already registered');
    } else {
        let id = generateRandomString();
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        users[id] = {"id": id, "email": req.body.email, "password": hashedPassword};
        req.session["user_id"] = users[id]["id"];
        res.redirect("/urls");
    }
});

app.get("/login", (req, res) => {
    if (req.session["user_id"]) {
        res.redirect("/urls");
    } else {
        const templateVars = {user: users[req.session["user_id"]]};
        res.render("urls_login", templateVars);
    }
});

app.post("/login", (req, res) => {
    let user = getUserByEmail(req.body.email, users);
    if (req.body.email === "" || req.body.password === "") {
        res.status(400).send('Invalid email or password');
    } else if (user && bcrypt.compareSync(req.body.password, user["password"])) {
        req.session["user_id"] = user["id"];
        res.redirect("/urls");
    } else {
        res.status(403).send('Email or password is incorrect');
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("session");
    res.clearCookie("session.sig");
    res.clearCookie("JSESSIONID");
    res.redirect("/login");
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
    const a = 1;
    res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
    res.send(`a = ${a}`);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});
