const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

let urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

let users = {
    "b2xVn2": {
        id: "b2xVn2",
        email: "user@example.com",
        password: "purple-monkey-dinosaur",
    },
    "9sm5xK": {
        id: "9sm5xK",
        email: "user2@example.com",
        password: "dishwasher-funk",
    },
};

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls", (req, res) => {
    const templateVars = {urls: urlDatabase, user: users[req.cookies["user_id"]]};
    res.render("urls_index", templateVars);
})

app.post("/urls", (req, res) => {
    if (req.cookies["user_id"]) {
        let charCodes = generateRandomString().toString();
        urlDatabase[charCodes] = req.body.longURL.toString();
        res.redirect("/urls/" + charCodes); // Respond with 'Ok' (we will replace this)
    } else {
        res.status(400).send('Unable to Complete Request Because You Dont Have Privilege to Create New Links Without Being Logged In');;
    }
});

app.get("/urls/new", (req, res) => {
    if (req.cookies["user_id"]) {
        const templateVars = {user: users[req.cookies["user_id"]]};
        res.render("urls_new", templateVars);
    } else {
        res.redirect("/login");
    }
});

app.get("/urls/:id", (req, res) => {
    const templateVars = {id: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies["user_id"]]};
    res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
    urlDatabase[req.params.id] = req.body.longURL.toString();
    res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
    const longURL = urlDatabase[req.params.id];
    if(longURL === undefined){
        res.status(400).send('No such short url in database');
    } else {
        res.redirect(longURL);
    }
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.get("/register", (req, res) => {
    if (req.cookies["user_id"]) {
        res.redirect("/urls");
    } else {
        const templateVars = {user: users[req.cookies["user_id"]]};
        res.render("urls_register", templateVars);
    }
});

app.post("/register", (req, res) => {
    let user = getUserByEmail(req.body.email);
    if (req.body.email === "" || req.body.password === "") {
        res.status(400).send('Invalid email or password');
    } else if (user) {
        res.status(400).send('Email is already registered');
    } else {
        let id = generateRandomString();
        users[id] = {"id": id, "email": req.body.email, "password": req.body.password};
        res.cookie("user_id", users[id]["id"]);
        res.redirect("/urls");
    }
});

app.get("/login", (req, res) => {
    if (req.cookies["user_id"]) {
        res.redirect("/urls");
    } else {
        const templateVars = {user: users[req.cookies["user_id"]]};
        res.render("urls_login", templateVars);
    }
});

app.post("/login", (req, res) => {
    let user = getUserByEmail(req.body.email);
    if (req.body.email === "" || req.body.password === "") {
        res.status(400).send('Invalid email or password');
    } else if (user && req.body.password === user["password"]) {
        res.cookie("user_id", user["id"]);
        res.redirect("/urls");
    } else {
        res.status(403).send('Email or password is incorrect');
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("user_id")
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

function getUserByEmail(email) {
    for (const id in users) {
        if (email === users[id]["email"]) {
            return users[id];
        }
    }
    return null;
}

function generateRandomString() {
    let charCodes = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 6; i++) {
        charCodes += characters[Math.floor(Math.random() * characters.length)];
    }
    return charCodes;
}
