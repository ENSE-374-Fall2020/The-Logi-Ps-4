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
    let exampleUsername = "Billy";
    // pass the set of workouts that belong to the current user
    // User.currentWorkouts[];
    // ORRRRRR
    // just pass the user
    let exampleWorkout = new Workout ({
        _id: 40,
        creator: "Billy",
        name: "This workout was statically created in index.js",
        sets: [
            {
                _id: 30,
                exercise: "Squat",
                amount: "100",
                duration: "0"
        }]
    });
    let exampleWorkoutList = [exampleWorkout];
    response.render("landing", { username: exampleUsername, usersCurrentWorkouts: exampleWorkoutList});
});

app.get("/exercises", function (request, response) {
    let exampleUsername = "Billy";
    let exampleExercise1 = new Exercise ({
        _id: 1,
        name: "Situp",
        type: "strength",
        muscles: ["Abs"],
        bodyParts: ["Stomach"],
        imagePath: "/img/LogiPs.png",
        tutorialURL: "/"
    });
    let exampleExercise2 = new Exercise ({
        _id: 2,
        name: "Squat",
        type: "strength",
        muscles: ["Quadriceps", "Hamstrings"],
        bodyParts: ["Legs", "Stomach"],
        imagePath: "/img/exercises/squat.jpg",
        tutorialURL: "/"
    });
    let allExercisesList = [exampleExercise1, exampleExercise2];
    response.render("exercises", { username: exampleUsername, allExercisesList: allExercisesList});
});

app.get("/workouts", function (request, response) {
    // pass the set of all workouts that are mutually exclusive
    // with all the workouts that belong to the current user
    response.render("workouts", {});
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