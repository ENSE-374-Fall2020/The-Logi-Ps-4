console.log("File index.js loaded successfully");

// load dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
require("dotenv").config();

// load passport-dependencies
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

// load database objects
const dbObjects = require(__dirname + "/model/dbObjects.js");
const Exercise = dbObjects.Exercise;
const Set = dbObjects.Set;
const Workout = dbObjects.Workout;
const FinishedWorkout = dbObjects.FinishedWorkout;
const CurrentWorkout = dbObjects.CurrentWorkout;
const User = dbObjects.User;
const userSchema = dbObjects.userSchema;
const Post = dbObjects.Post;

// create and set up express.js app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


// set up session
app.use(session({
    secret: process.env.SECRET, // stores our secret in our .env file
    resave: false,              // other config settings explained in the docs
    saveUninitialized: false
}));

// set up passport
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/progressdb",
    {
        useNewUrlParser: true, // these avoid MongoDB deprecation warnings
        useUnifiedTopology: true
    });

// configure passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

//**************************************************
// BUG: createStrategy() isn't recognized as
//      a function of User
//**************************************************
/*
// create a strategy for storing users with Passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
*/

const port = 3000;
app.listen(port, function() {
    console.log("Server is running on port " + port);
});

app.get("/", function (request, response) {
    response.redirect("/landing");
});

app.get("/landing", function (request, response) {
    response.render("landing");
});

app.get("/exercises", function (request, response) {
    response.render("exercises");
});

app.get("/workouts", function (request, response) {
    response.render("workouts");
});

app.get("/workoutBuilder", function (request, response) {
    response.render("workoutBuilder");
});

app.get("/forum", function (request, response) {
    
    let testPost = new Post ({
        _id: 5,
        user_id: 4,
        content: "This is some dynamically generated post text!!"
    });
    response.render("forum", { username: "Big Bob", items: [] });
});

app.get("/login", function (request, response) {
    response.render("login");
});

app.get("/logout", function (request, response) {
    // log user out
    response.redirect("/landing"); // TEMPORARY REDIRECTION
});

app.post("/logout", function (request, response) {
    response.redirect("/logout");
})