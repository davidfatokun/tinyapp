const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls", (req, res) => {
    const templateVars = {urls: urlDatabase, username: req.cookies["username"]};
    res.render("urls_index", templateVars);
})

app.post("/urls", (req, res) => {
    let charCodes = generateRandomString().toString();
    urlDatabase[charCodes] = req.body.longURL.toString();
    res.redirect("/urls/" + charCodes); // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
    const templateVars = {username: req.cookies["username"]};
    res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
    let templateVars = {};
    templateVars[req.params.id] = { id: req.params.id, longURL: urlDatabase[req.params.id], username: req.cookies["username"] };
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
    res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
});

app.post("/login", (req, res) => {
    res.cookie("username", req.body.username)
    res.redirect("/urls");
});

app.post("/logout", (req, res) => {
    res.clearCookie("username")
    res.redirect("/urls");
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

function generateRandomString() {
    let charCodes = '';
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 6; i++) {
        charCodes += characters[Math.floor(Math.random() * characters.length)];
    }
    return charCodes;
}
