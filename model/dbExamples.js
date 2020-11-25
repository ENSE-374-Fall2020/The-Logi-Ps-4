const dbObjects = require(__dirname + "/dbObjects.js");
const Exercise = dbObjects.Exercise;
const Set = dbObjects.Set;
const Workout = dbObjects.Workout;
const FinishedWorkout = dbObjects.FinishedWorkout;
const CurrentWorkout = dbObjects.CurrentWorkout;
const User = dbObjects.User;
const Post = dbObjects.Post;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/progressDB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

async function databaseCalls() {
    console.log("connected to progressDB");

    const exercise1 = new Exercise({
        _id: 7,
        name: "jump squat",
        type: "strength",
        muscles: ["legs"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise1.save();
    const exercise2 = new Exercise({
        _id: 8,
        name: "sprint",
        type: "strength",
        muscles: ["legs", "cardio"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise2.save();

    await Exercise.find({ type: "strength" }, function(err, results) {
        if (err) console.log("err");
        else {
            console.log("searching for exercises with type: 'strength'...");
            if (results.length !== 0) {
                for (currentExercise of results){
                    console.log(currentExercise.name, currentExercise.muscles);
                }
            }
        }
    });

    await mongoose.connection.close();
}


databaseCalls();
