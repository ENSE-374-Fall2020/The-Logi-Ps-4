// PURPOSE: Initialize and export database schemas, accessed in other files via:
//
//          const dbObjects = require(__dirname + "/dbObjects.js");
//
// AUTHOR: Jacob Meyer

const mongoose = require("mongoose");

console.log("Initializing schemas...");
// **NOTE: added "muscles" category array for muscle group
const exerciseSchema = new mongoose.Schema(
    {
        _id: Number,
        // exercise_id: Number, // could remove and use name as identifier
        name: String,
        type: String,
        muscles: [String],
        tutorialURL: String
        // difficulty: Number
    });
const Exercise = mongoose.model("Exercise", exerciseSchema);

const setSchema = new mongoose.Schema(
    {
        _id: Number,
        set_id: Number,
        exercise_id: Number, // could be string if exercise uses name as id
        workout_id: Number,
        amount: Number,
        duration: Number
        // difficulty: Number
    });
const Set = mongoose.model("Set", setSchema);

const workoutSchema = new mongoose.Schema(
    {
        workout_id: Number,
        creator: String
        // difficulty: Number
    });
const Workout = mongoose.model("Workout", workoutSchema);

const finishedWorkoutSchema = new mongoose.Schema(
    {
        finished_id: Number,
        user_id: Number,
        workout_id: Number,
        date_finished: Date
    });
const FinishedWorkout = mongoose.model("FinishedWorkout", finishedWorkoutSchema);

const currentWorkoutSchema = new mongoose.Schema(
    {
        current_id: Number,
        user_id: Number,
        workout_id: Number
    });
const CurrentWorkout = mongoose.model("CurrentWorkout", currentWorkoutSchema);

const userSchema = new mongoose.Schema(
    {
        user_id: Number, // could remove and use username as identifier
        username: String,
        password: String,
        weight: Number,
        height: Number
    });
const User = mongoose.model("User", userSchema);

const postSchema = new mongoose.Schema(
    {
        post_id: Number,
        user_id: Number,
        content: String,
        date_posted: Date
    });
const Post = mongoose.model("Post", postSchema);

exports.Exercise = Exercise;
exports.Set = Set;
exports.Workout = Workout;
exports.finishedWorkout = FinishedWorkout;
exports.currentWorkout = CurrentWorkout;
exports.User = User;
exports.Post = Post;

console.log("Schemas initialized and exported successfully");

// *****************************************************************************
// ALTERNATIVE: use embedded document to reference exercises in sets in workouts
// *****************************************************************************
