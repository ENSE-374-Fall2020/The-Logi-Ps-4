// PURPOSE: Initialize and export database schemas, accessed in other files via:

const { ObjectID } = require("bson");
const mongoose = require("mongoose");


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
        exercise: String,
        repetitions: Number,
        sets: Number,
        duration: String
    });
const Set = mongoose.model("Set", setSchema);

const workoutSchema = new mongoose.Schema(
    {
        creator: String,
        name: String,
        sets: [setSchema]
    });
const Workout = mongoose.model("Workout", workoutSchema);

const finishedWorkoutSchema = new mongoose.Schema(
    {
        count: Number,
        workout_id: ObjectID,
    });
const FinishedWorkout = mongoose.model("FinishedWorkout", finishedWorkoutSchema);

const currentWorkoutSchema = new mongoose.Schema(
    {
        workout_id: ObjectID
    });
const CurrentWorkout = mongoose.model("CurrentWorkout", currentWorkoutSchema);


exports.Exercise = Exercise;
exports.Set = Set;
exports.Workout = Workout;
exports.FinishedWorkout = FinishedWorkout;
exports.finishedWorkoutSchema = finishedWorkoutSchema;
exports.CurrentWorkout = CurrentWorkout;
exports.currentWorkoutSchema = currentWorkoutSchema;


console.log("Schemas initialized and exported successfully");
