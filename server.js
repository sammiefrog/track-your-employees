const express = require("express");
const cfonts = require("cfonts");

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 7000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"));

//routes
// require("./routes/apiroutes")(app);
// require("./routes/htmlroutes")(app);

//listening
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});

cfonts.say("Hello, I love A+'s", {
    font: "chrome",
    align: "center",
    colors: ["green", "magenta", "blue"],
    background: "transparent",
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: "0",
    gradient: true,
    independentGradient: false,
    transitionGradient: false,
    env: "node",
});