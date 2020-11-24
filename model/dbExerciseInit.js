// PURPOSE: clear and initialize list of all exercises

const dbObjects = require(__dirname + "/dbObjects.js");
const Exercise = dbObjects.Exercise;
const Set = dbObjects.Set;
const Workout = dbObjects.Workout;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/testdb",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

console.log("connected to testdb");

async function destroyExerciseCollection() {
    // destroy existing collection of exercises

    await Exercise.deleteMany({}, function (err) {
        if (err) console.log("Error in deleting existing collection");
        else console.log("Collection 'exercises' destroyed");
    });
}

async function generateExerciseCollection() {
    // generate new collection of static exercises

    console.log("Generating static list of exercises...");
    const exercise1 = new Exercise({
        _id: 1,
        name: "Situp",
        type: "strength",
        imagePath: "",
        muscles: ["abs"],
        bodyParts: ["abs"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise1.save();

    const exercise2 = new Exercise({
        _id: 2,
        name: "Squat",
        type: "strength",
        imagePath: "img/exercises/squat.jpg",
        muscles: ["quadriceps", "glutes", "hamstrings", "abs"],
        bodyParts: ["abs", "legs"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise2.save();

    const exercise3 = new Exercise({
        _id: 3,
        name: "Pullup",
        type: "strength",
        imagePath: "",
        muscles: ["arms", "shoulders", "chest", "back"],
        bodyParts: ["abs", "chest", "arms"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise3.save();

    const exercise4 = new Exercise({
        _id: 4,
        name: "Pushup",
        type: "strength",
        imagePath: "",
        muscles: ["arms", "shoulders", "chest", "back"],
        bodyParts: ["abs", "chest", "arms"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise4.save();

    const exercise5 = new Exercise({
        _id: 5,
        name: "Sprint",
        type: "endurance",
        imagePath: "",
        muscles: ["legs"],
        bodyParts: ["abs", "legs", "cardio"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise5.save();

    const exercise6 = new Exercise({
        _id: 6,
        name: "Downward Dog",
        type: "strength",
        imagePath: "",
        muscles: ["arms", "shoulders", "legs"],
        bodyParts: ["abs", "legs", "cardio"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise6.save();

    const exercise7 = new Exercise({
        _id: 7,
        name: "Run",
        type: "endurance",
        imagePath: "",
        muscles: ["abs", "legs"],
        bodyParts: ["abs", "legs", "cardio"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise7.save();

    await mongoose.connection.close();

    

    console.log("Exercise list created successfully");
}

destroyExerciseCollection();
generateExerciseCollection();

exports.destroyExerciseCollection = destroyExerciseCollection;
exports.generateExerciseCollection = generateExerciseCollection;