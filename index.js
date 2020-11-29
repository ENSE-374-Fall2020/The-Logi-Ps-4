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
//require(__dirname + "/model/dbExerciseInit.js");


const Exercise = dbObjects.Exercise;
const Set = dbObjects.Set;
const Workout = dbObjects.Workout;
const FinishedWorkout = dbObjects.FinishedWorkout;
const finishedWorkoutSchema = dbObjects.finishedWorkoutSchema;
const CurrentWorkout = dbObjects.CurrentWorkout;
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
        console.log("request.user.username : " + request.user.username)
        console.log("body request workout id" + request.body.workoutId);
        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error marking workout as complete");
            else {
                async function saveToCompletedWorkouts() {
                    if (user.finishedWorkouts.length != 0) {
                        for (finishedWorkout of user.finishedWorkouts) {
                            if (finishedWorkout.workout_id == request.body.workoutId) {
                                console.log("matched workout id");
                                finishedWorkout.count++;
                                await user.save();
                                return;
                            }
                        }
                    }
                    console.log("creating finished workouts.....");
                    const completedWorkout = new FinishedWorkout({
                        workout_id: request.body.workoutId,
                        count: 1
                    });
                    completedWorkout.save();
                    user.finishedWorkouts.push(completedWorkout);
                    console.log("pushed workout " + completedWorkout + "\nto user " + user.username + "'s finishedWorkouts");
                    user.save();

                    console.log("completedWorkout" + completedWorkout);

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
        console.log("request.user.username : " + request.user.username)

        var alreadyExists = 0;

        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error adding workout to user");
            else {
                async function checkIfExists(){
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
                    console.log("adding to " + user.username + "'s currentWorkouts: " + workout);
                    await workout.save();
                    user.currentWorkouts.push(workout);
                    console.log("user: " + user);
                    await user.save();
                    response.redirect("/landing");
                }

                async function checkAlreadyExists(){
                    try{
                         checkIfExists();
                    }
                    finally{
                    if (alreadyExists == 0){
                        saveToCurrentWorkouts();
                    }
                    else{
                        response.redirect("/workouts");
                    }
                }
                }

                 checkAlreadyExists();   
                
            }

        });
        // THIS SHOULD CHANGE BUTTON TO MARK COMPLETE INSTEAD
        // response.redirect("/landing");

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
                // console.log(exerciseList);

            }
            response.render("exercises", {exercises: exerciseList, username: request.user.username});
        });
    } else { // user not logged in
        response.redirect("/login");
    }
});

app.get("/workouts", function (request, response) {
    if (request.isAuthenticated()) {

        var alreadyExists =  request.session.alreadyExists;
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
            response.render("workouts", {alreadyExists: alreadyExists, allWorkouts: workoutList, username: request.user.username});
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
                // console.log(exerciseList);
            }
            response.render("workoutBuilder", { exerciseList: exerciseList, username: request.user.username });
        });
    } else { // user not logged in
        response.redirect("/login");
    }
});

app.post("/buildWorkout", function (request, response) {
    if (request.isAuthenticated()) {
        // console.log("index.js /buildWorkout received: " + JSON.stringify(request.body));

        let newWorkout = request.body;
        let newWorkoutName = newWorkout.workoutName;
        // console.log("new Workout Name: " + newWorkoutName);
        let newSets = []; // populated in for loop
        let setPointer = 0;

        // BUG: If workout only has 1 exercise, information is not passed in array form

        // COMPLETE: if newWorkout.exercise !== array
        if (Array.isArray(newWorkout.exercise)) {
            for (var setCount = 0; setCount < newWorkout.exercise.length; setCount++) {
                setPointer = new Set({
                    // _id: new ObjectId,
                    exercise: newWorkout.exercise[setCount],
                    sets: newWorkout.sets[setCount],
                    repetitions: newWorkout.repetitions[setCount],
                    duration: newWorkout.duration[setCount]
                });
                // setPointer.save();
                newSets.push(setPointer);
                // console.log("iteration " + setCount + setPointer);
            }
        } else {
            // newWorkout = JSON.parse(newWorkout);
            setPointer = new Set({
                exercise: newWorkout.exercise,
                sets: newWorkout.sets,
                repetitions: newWorkout.repetitions,
                duration: newWorkout.duration
            });

        }
        // console.log("newSets after iterating: " + newSets);

        let newWorkoutObject = new Workout({
            // _id: new ObjectId,
            creator: request.user.username,
            name: newWorkoutName,
            sets: newSets
        });
        newWorkoutObject.save();
        //console.log("newWorkoutObject: " + newWorkoutObject);

        // add to users current workouts
        User.findById(request.user._id, function (err, user) {
            if (err) console.log("Error adding workout to user");
            else {
                const newCurrentWorkout = new CurrentWorkout({
                    workout_id: newWorkoutObject._id
                })
                newCurrentWorkout.save();
                // console.log("newCurrentWorkout: " + newCurrentWorkout)
                user.currentWorkouts.push(newCurrentWorkout);
                console.log("pushed workout " + newWorkoutObject + "\nto user " + user.username + "'s currentWorkouts");
                user.save();
                console.log("Workout saved successfully");
            }
        });

        // successfully built
        response.redirect("/landing");
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




