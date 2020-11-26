console.log("File index.js loaded successfully");

// load dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
require("dotenv").config();

// load passport-dependencies
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose");
const { redirect } = require("statuses");

// load database objects
const dbObjects = require(__dirname + "/model/dbObjects.js");
//require(__dirname + "/model/dbExerciseInit.js");

const Exercise = dbObjects.Exercise;
const Set = dbObjects.Set;
const Workout = dbObjects.Workout;
const FinishedWorkout = dbObjects.FinishedWorkout;
const finishedWorkoutSchema = dbObjects.finishedWorkoutSchema;
const currentWorkout = dbObjects.currentWorkout;
const currentWorkoutSchema = dbObjects.currentWorkoutSchema;
//const User = dbObjects.User;
//const userSchema = dbObjects.userSchema;
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
mongoose.connect("mongodb://localhost:27017/progressDB",
    {
        useNewUrlParser: true, // these avoid MongoDB deprecation warnings
        useUnifiedTopology: true
    });

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        currentWorkouts: [currentWorkoutSchema],
        finishedWorkouts: [finishedWorkoutSchema]
        // weight: Number,  // optional
        // height: Number,  // extra
        // age: Number      // data
    });

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

// create a strategy for storing users with Passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const port = 3000;
app.listen(port, function () {
    console.log("Server is running on port " + port);
});

app.get("/", function (request, response) {
    response.redirect("/login");
});

app.get("/login", function (request, response) {
    if (request.isAuthenticated()) { // already logged in
        response.redirect("/landing");
    } else { // user not logged in
        response.render("login");
    }
});

app.post("/login", function (request, response) {
    console.log("A user is logging in")
    // create a user
    const user = new User({
        username: request.body.username,
        password: request.body.password
    });
    // try to log them in
    request.login(user, function (err) {
        if (err) {
            // failure
            console.log(err);
            response.redirect("/login")
        } else {
            // success
            // authenticate using passport-local
            passport.authenticate("local")(request, response, function () {
                response.redirect("/landing");
            });
        }
    });
});

app.post("/register", function (request, response) {
    console.log("Registering a new user");
    // calls a passport-local-mongoose function for registering new users
    User.register({ username: request.body.username }, request.body.password, function (err, user) {
        if (err) {
            console.log(err);
            response.redirect("/login")
        } else {
            // authenticate using passport-local
            passport.authenticate("local")(request, response, function () {
                response.redirect("/landing")
            });
        }
    });
});

app.get("/logout", function (request, response) {
    console.log("A user logged out")
    request.logout();
    response.redirect("/login");
});

app.post("/logout", function (request, response) {
    response.redirect("/logout");
});

app.get("/landing", function (request, response) {

    if (request.isAuthenticated()) {

        let usersCurrentWorkouts = [];

        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error loading user's data");
            else {
                async function getWorkouts() {
                    try {
                        for (let currentWorkout of user.currentWorkouts) {
                            await Workout.findById(currentWorkout.workout_id, function (err, workout) {
                                if (err) console.log("Error loading workout by user's current workout ids");
                                else {
                                    usersCurrentWorkouts.push(workout);
                                }
                            });
                        }
                    }
                    finally {
                        response.render("landing", { username: request.user.username, usersCurrentWorkouts: usersCurrentWorkouts });
                    }

                }
                getWorkouts();
            }
        });

    }
    else { // user not logged in
        response.redirect("/login");
    }
});


app.post("/addWorkout", function (request, response) {
    if (request.isAuthenticated()) {
        console.log("request.user.username : " + request.user.username)

        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error adding workout to user");
            else {
                let workout = new currentWorkout({
                    workout_id: request.body.workoutId
                })
                user.currentWorkouts.push(workout);
                console.log("user: " + user);
            }
            user.save();
        });
        // THIS SHOULD CHANGE BUTTON TO MARK COMPLETE INSTEAD
        response.redirect("/landing");

    } else { // user not logged in
        response.redirect("/login");
    }
});

app.post("/removeWorkout", function (request, response) {


    if (request.isAuthenticated()) {
        var user = request.user;
        var workoutid = request.body.workoutId;
        var workoutIdToRemove;
        console.log(workoutid);

        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error loading user's data");
            else {
                console.log("loaded user " + user.username + " successfully")
                async function getCurrentWorkouts() {
                    try {
                        for (let currentWorkout of user.currentWorkouts) {
                                if (currentWorkout.workout_id == workoutid) {
                                    workoutIdToRemove = currentWorkout._id;
                                }
                                }
                        }
                    finally {
                        user.currentWorkouts.pull({_id: workoutIdToRemove});
                        user.save();
                            response.redirect("/landing");
                    }
                }
                getCurrentWorkouts();
            }
        });

    } else { // user not logged in
    response.redirect("/login");
}
});

app.get("/exercises", function (request, response) {
    if (request.isAuthenticated()) {
        const exerciseList = [];

        Exercise.find({}, (err, Exercises) => {
            if (err) {
                console.log(err);
            } else {
                Exercises.forEach((Exercise) => {
                    exerciseList.push(Exercise);
                })
                console.log(exerciseList);

            }
            response.render("exercises", { exercises: exerciseList });
        });
    } else { // user not logged in
        response.redirect("/login");
    }
});

app.get("/workouts", function (request, response) {
    if (request.isAuthenticated()) {
        const workoutList = [];

        Workout.find({}, (err, Workouts) => {
            if (err) {
                console.log(err);
            } else {
                Workouts.forEach((Workout) => {
                    workoutList.push(Workout);
                })
            }
            response.render("workouts", { allWorkouts: workoutList });
        });
    } else { // user not logged in
        response.redirect("/login");
    }
});

app.get("/workoutBuilder", function (request, response) {
    if (request.isAuthenticated()) {
        response.render("workoutBuilder");
    } else { // user not logged in
        response.redirect("/login");
    }
});


app.get("/forum", function (request, response) {
    if (request.isAuthenticated()) {
        const forumList = [];

        Post.find({}, (err, Posts) => {
            if (err) {
                console.log(err);
            } else {
                Posts.forEach((Post) => {
                    forumList.push(Post);
                })
            }
            console.log(forumList.length);
            response.render("forum", { posts: forumList });
        });
    } else { // user not logged in
        response.redirect("/login");
    }
});

app.post("/addToForum", function (request, response) {
    if (request.isAuthenticated()) {
        console.log(request.body.numberOfPosts);
        let exampleUsername = "Billy";
        response.render("newPost", { numberOfPosts: request.body.numberOfPosts, username: request.user.username });
    } else {
        response.redirect("/login");
    }
});


app.post("/postIt", function (request, response) {
    var postContent = request.body.postContent;
    var postTitle = request.body.postTitle;
    var creatorOfPost = request.user.username;
    var id = request.body.postId++;

    // if title or content are blank
    if (postContent == "" || postContent == undefined
        || postTitle == "" || postTitle == undefined) {
        response.redirect(307, "/addToForum");

    } else {
        let newPost = new Post({
            _id: id,
            creator: creatorOfPost,
            content: postContent,
            title: postTitle
        });
        newPost.save();
        response.redirect("/forum");
    }
});




