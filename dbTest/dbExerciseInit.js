// PURPOSE: clear and initialize list of all exercises

// AUTHOR: Jacob Meyer

const dbObjects = require(__dirname + "/dbObjects.js");
const Exercise = dbObjects.Exercise;

const { Db } = require("mongodb");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/testdb",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log("connected to testdb");

async function destroyExerciseCollection() {
    // destroy existing collection of exercises

    await Exercise.deleteMany({}, function(err) {
        if (err) console.log("Error in deleting existing collection");
        else console.log("Collection 'exercises' destroyed");
    });
}

    async function generateExerciseCollection() {
    // generate new collection of static exercises

    console.log("Generating static list of exercises...");
    const exercise1 = new Exercise({
        _id: 1,
        name: "situp",
        type: "strength",
        muscles: ["abs"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise1.save();

    const exercise2 = new Exercise({
        _id: 2,
        name: "squat",
        type: "strength",
        muscles: ["legs", "abs"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise2.save();

    const exercise3 = new Exercise({
        _id: 3,
        name: "pullup",
        type: "strength",
        muscles: ["arms", "shoulders", "chest", "back"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise3.save();

    const exercise4 = new Exercise({
        _id: 4,
        name: "pushup",
        type: "strength",
        muscles: ["arms", "shoulders", "chest", "back"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise4.save();

    const exercise5 = new Exercise({
        _id: 5,
        name: "run",
        type: "endurance",
        muscles: ["legs", "cardio"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise5.save();

    const exercise6 = new Exercise({
        _id: 6,
        name: "downward dog",
        type: "strength",
        muscles: ["arms", "shoulders", "legs"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise6.save();

    await mongoose.connection.close();
    console.log("List created successfully");
}

destroyExerciseCollection();
generateExerciseCollection();

exports.destroyExerciseCollection = destroyExerciseCollection;
exports.generateExerciseCollection = generateExerciseCollection;