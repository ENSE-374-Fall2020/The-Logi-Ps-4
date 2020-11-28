// PURPOSE: Initialize and export database schemas, accessed in other files via:
//
//          const dbObjects = require(__dirname + "/dbObjects.js");
//
// AUTHOR: Jacob Meyer

const { ObjectID } = require("bson");
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
        // _id: Number,
        exercise: String, // alternative: exercise_id: Number,
        repetitions: Number,
        sets: Number,
        duration: String
    });
const Set = mongoose.model("Set", setSchema);

const workoutSchema = new mongoose.Schema(
    {
        // _id: Number, 
        creator: String,
        name: String,
        sets: [setSchema]
    });
const Workout = mongoose.model("Workout", workoutSchema);

const finishedWorkoutSchema = new mongoose.Schema(
    {
        // _id: Number,
        count: Number,
        workout_id: ObjectID,
        // date_finished: { type: Date, default: Date.now() } // replaceable with mongoDB getTimestamp() method
    });
const FinishedWorkout = mongoose.model("FinishedWorkout", finishedWorkoutSchema);

const currentWorkoutSchema = new mongoose.Schema(
    {
        // _id: Number,
        workout_id: ObjectID
    });
const CurrentWorkout = mongoose.model("CurrentWorkout", currentWorkoutSchema);

const postSchema = new mongoose.Schema(
    {
        _id: Number,
        creator: String,
        content: String,
        title: String
        // date_posted: { type: Date, default: Date.now() } // replaceable with mongoDB getTimestamp() method
    });
const Post = mongoose.model("Post", postSchema);


exports.Exercise = Exercise;
exports.Set = Set;
exports.Workout = Workout;
exports.FinishedWorkout = FinishedWorkout;
exports.finishedWorkoutSchema = finishedWorkoutSchema;
exports.CurrentWorkout = CurrentWorkout;
exports.currentWorkoutSchema = currentWorkoutSchema;
exports.Post = Post;


console.log("Schemas initialized and exported successfully");
