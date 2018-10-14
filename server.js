/**
 * Express Server
 */

// Dependencies ----->

const express = require("express"),
    exHbs = require("express-handlebars"),
    bodyParser = require("body-parser"),
    path = require("path"),
    fs = require("fs");

// Components ----->

// Server port
const port = process.env.PORT || 3000,
    // Express app
    app = express();

// Setup ----->

// Set public directory
app.use(express.static("public"));

// Use parsers
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Create view engine
const hbs = exHbs.create({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
        getCurrentYear() {
            return new Date().getFullYear();
        },
        titleCase(text) {
            return text.split(" ").map(
                (word) => `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}`
            ).join(" ");
        }
    }
});
// Set view engine
app.engine(hbs.extname, hbs.engine);
app.set("view engine", "hbs");

// Middleware ----->

// Log requests
app.use((req, res, next) => {
    const now = new Date().toString(),
        log = `${req.method}: ("${req.url}") @ ${now}`;
    fs.appendFile(path.resolve(process.cwd(), "logs/requests.log"), `${log}\n`, (err) => {
        if (err) console.log(`Problem appending log: ${err}`);
    });
    next();
});

// Routes ----->

// Root
app.get("/", (req, res) => {
    res.render("index", {
        title: "home of the strange",
        paragraph: "Where the estranged may land."
    });
});

// Help
app.get("/about", (req, res) => {
    res.render("index", {
        title: "about stuff",
        paragraph: "Something about us and our stuff."
    });
});

// Listen ----->

app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});
