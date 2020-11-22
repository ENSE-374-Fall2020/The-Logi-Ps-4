// PURPOSE: Initialize and export database schemas, accessed in other files via:
//
//          const dbObjects = require(__dirname + "/dbObjects.js");
//
// AUTHOR: Jacob Meyer

const mongoose = require("mongoose");

console.log("Initializing schemas...");
const exerciseSchema = new mongoose.Schema(
    {
        _id: Number,
        name: String,
        type: String,
        muscles: [String],
        bodyParts: [String],
        imagePath: String,
        tutorialURL: String
    });
const Exercise = mongoose.model("Exercise", exerciseSchema);

const setSchema = new mongoose.Schema(
    {
        _id: Number,
        exercise: String, // alternative: exercise_id: Number,
        amount: Number,
        duration: Number
    });
const Set = mongoose.model("Set", setSchema);

const workoutSchema = new mongoose.Schema(
    {
        _id: Number, 
        creator: String,
        name: String,
        sets: [setSchema]
    });
const Workout = mongoose.model("Workout", workoutSchema);

const finishedWorkoutSchema = new mongoose.Schema(
    {
        _id: Number,
        workout_id: Number,
        // date_finished: Date // replaceable with mongoDB getTimestamp() method
    });
const FinishedWorkout = mongoose.model("FinishedWorkout", finishedWorkoutSchema);

const currentWorkoutSchema = new mongoose.Schema(
    {
        _id: Number,
        workout_id: Number
    });
const CurrentWorkout = mongoose.model("CurrentWorkout", currentWorkoutSchema);

const userSchema = new mongoose.Schema(
    {
        _id: Number,
        username: String,
        password: String,
        currentWorkouts: [currentWorkoutSchema],
        finishedWorkouts: [finishedWorkoutSchema]
        // weight: Number,  // optional
        // height: Number,  // extra
        // age: Number      // data
    });
const User = mongoose.model("User", userSchema);

const postSchema = new mongoose.Schema(
    {
        _id: Number,
        user_id: Number,
        content: String,
        // date_posted: Date // replaceable with mongoDB getTimestamp() method
    });
const Post = mongoose.model("Post", postSchema);

exports.Exercise = Exercise;
exports.Set = Set;
exports.Workout = Workout;
exports.finishedWorkout = FinishedWorkout;
exports.currentWorkout = CurrentWorkout;
exports.User = User;
exports.userSchema = userSchema; // required for passport-local-mongoose in index.js
exports.Post = Post;

console.log("Schemas initialized and exported successfully");
