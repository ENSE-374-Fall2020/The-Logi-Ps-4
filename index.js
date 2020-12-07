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
const e = require("express");

// load database objects
const dbObjects = require(__dirname + "/model/dbObjects.js");

const Exercise = dbObjects.Exercise;
const Set = dbObjects.Set;
const Workout = dbObjects.Workout;
const FinishedWorkout = dbObjects.FinishedWorkout;
const finishedWorkoutSchema = dbObjects.finishedWorkoutSchema;
const CurrentWorkout = dbObjects.CurrentWorkout;
const currentWorkoutSchema = dbObjects.currentWorkoutSchema;

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
    request.logout();
    response.redirect("/login");
});

app.post("/logout", function (request, response) {
    response.redirect("/logout");
});

app.get("/landing", function (request, response) {

    if (request.isAuthenticated()) {

        let usersCurrentWorkouts = [];
        let usersFinishedWorkouts = [];
        let countForEachFinishedWorkouts = [];
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
                        for (let finishedWorkout of user.finishedWorkouts) {
                            await Workout.findById(finishedWorkout.workout_id, function (err, workout) {
                                if (err) console.log("Error loading workout by user's finished workout ids");
                                else {
                                    usersFinishedWorkouts.push(workout);
                                    countForEachFinishedWorkouts.push(finishedWorkout.count);
                                }
                            });
                        }
                    }
                    finally {
                        response.render("landing", {
                            username: request.user.username,
                            usersCurrentWorkouts: usersCurrentWorkouts,
                            usersFinishedWorkouts: usersFinishedWorkouts,
                            countForEachFinishedWorkouts: countForEachFinishedWorkouts
                        });
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


app.post("/markAsComplete", function (request, response) {
    if (request.isAuthenticated()) {
        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error marking workout as complete");
            else {
                async function saveToCompletedWorkouts() {
                    if (user.finishedWorkouts.length != 0) {
                        for (finishedWorkout of user.finishedWorkouts) {
                            if (finishedWorkout.workout_id == request.body.workoutId) {
                                finishedWorkout.count++;
                                await user.save();
                                return;
                            }
                        }
                    }
                    const completedWorkout = new FinishedWorkout({
                        workout_id: request.body.workoutId,
                        count: 1
                    });
                    completedWorkout.save();
                    user.finishedWorkouts.push(completedWorkout);
                    user.save();
                }
                saveToCompletedWorkouts();
            }
        })

        response.redirect("/landing");
    }
    else {
        response.redirect("/login");
    }

})
app.post("/addWorkout", function (request, response) {
    if (request.isAuthenticated()) {
        var alreadyExists = 0;

        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error adding workout to user");
            else {
                async function checkIfExists() {
                    try {
                        for (let currentWorkout of user.currentWorkouts) {
                            if (currentWorkout.workout_id == request.body.workoutId) {
                                alreadyExists = 1;
                            }
                        }
                    }
                    finally {
                        request.session.alreadyExists = alreadyExists;
                    }
                }
                async function saveToCurrentWorkouts() {
                    const workout = new CurrentWorkout({
                        workout_id: request.body.workoutId
                    });
                    await workout.save();
                    user.currentWorkouts.push(workout);
                    await user.save();
                    response.redirect("/landing");
                }

                async function checkAlreadyExists() {
                    try {
                        checkIfExists();
                    }
                    finally {
                        if (alreadyExists == 0) {
                            saveToCurrentWorkouts();
                        }
                        else {
                            response.redirect("/workouts");
                        }
                    }
                }

                checkAlreadyExists();

            }

        });

    } else { // user not logged in
        response.redirect("/login");
    }
});

app.post("/removeWorkout", function (request, response) {


    if (request.isAuthenticated()) {
        var user = request.user;
        var workoutid = request.body.workoutId;
        var workoutIdToRemove;

        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error loading user's data");
            else {
                async function getCurrentWorkouts() {
                    try {
                        for (let currentWorkout of user.currentWorkouts) {
                            if (currentWorkout.workout_id == workoutid) {
                                workoutIdToRemove = currentWorkout._id;
                            }
                        }
                    }
                    finally {
                        user.currentWorkouts.pull({ _id: workoutIdToRemove });
                        await user.save();
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
            }
            response.render("exercises", { exercises: exerciseList, username: request.user.username });
        });
    } else { // user not logged in
        response.redirect("/login");
    }
});

app.get("/workouts", function (request, response) {
    if (request.isAuthenticated()) {

        var alreadyExists = request.session.alreadyExists;
        request.session.alreadyExists = 0;

        const workoutList = [];

        Workout.find({}, (err, Workouts) => {
            if (err) {
                console.log(err);
            } else {
                Workouts.forEach((Workout) => {
                    workoutList.push(Workout);
                });
            }
            response.render("workouts", { alreadyExists: alreadyExists, allWorkouts: workoutList, username: request.user.username });
        });
    } else { // user not logged in
        response.redirect("/login");
    }
});

app.get("/workoutBuilder", function (request, response) {
    if (request.isAuthenticated()) {
        const exerciseList = [];

        Exercise.find({}, (err, Exercises) => {
            if (err) {
                console.log(err);
            } else {
                Exercises.forEach((Exercise) => {
                    exerciseList.push(Exercise);
                });
            }
            response.render("workoutBuilder", { exerciseList: exerciseList, username: request.user.username });
        });
    } else { // user not logged in
        response.redirect("/login");
    }
});

app.post("/buildWorkout", function (request, response) {
    if (request.isAuthenticated()) {
        let newWorkout = request.body;
        let newWorkoutName = newWorkout.workoutName;

        let newSets = []; // populated in for loop
        let setPointer = 0;

        if (Array.isArray(newWorkout.exercise)) {
            for (var setCount = 0; setCount < newWorkout.exercise.length; setCount++) {
                setPointer = new Set({
                    exercise: newWorkout.exercise[setCount],
                    sets: newWorkout.sets[setCount],
                    repetitions: newWorkout.repetitions[setCount],
                    duration: newWorkout.duration[setCount]
                });
                newSets.push(setPointer);
            }
        } else {
            setPointer = new Set({
                exercise: newWorkout.exercise,
                sets: newWorkout.sets,
                repetitions: newWorkout.repetitions,
                duration: newWorkout.duration
            });

        }

        let newWorkoutObject = new Workout({
            creator: request.user.username,
            name: newWorkoutName,
            sets: newSets
        });
        newWorkoutObject.save();

        // add to users current workouts
        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error adding workout to user");
            else {
                const newCurrentWorkout = new CurrentWorkout({
                    workout_id: newWorkoutObject._id
                })
                newCurrentWorkout.save();
                user.currentWorkouts.push(newCurrentWorkout);
                user.save();
            }
        });

        // successfully built
        response.redirect("/landing");
    } else { // user not logged in
        response.redirect("/login");
    }
});






