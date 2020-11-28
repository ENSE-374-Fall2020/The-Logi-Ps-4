// PURPOSE: clear and initialize list of all exercises

const dbObjects = require(__dirname + "/dbObjects.js");
const Exercise = dbObjects.Exercise;
const Set = dbObjects.Set;
const Workout = dbObjects.Workout;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/progressDB",
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
    const exercise1 = await new Exercise({
        _id: 1,
        name: "Crunch",
        type: "strength",
        imagePath: "img/exercises/crunch.png",
        muscles: ["Abdominals", "Obliques"],
        bodyParts: ["Stomach"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise1.save();

    const exercise2 = new Exercise({
        _id: 2,
        name: "Squat",
        type: "strength",
        imagePath: "img/exercises/squat.jpg",
        muscles: ["Quadriceps", "Glutes", "Hamstrings", "Abdominals"],
        bodyParts: ["Stomach", "Legs"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise2.save();

    const exercise3 = new Exercise({
        _id: 3,
        name: "Pullup",
        type: "strength",
        imagePath: "img/exercises/pullup.png",
        muscles: ["Deltoid", "Pectoralis", "Triceps", "Biceps", "Abdominals", "Obliques"],
        bodyParts: ["Stomach", "Chest", "Arms", "Shoulders", "Back"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise3.save();

    const exercise4 = new Exercise({
        _id: 4,
        name: "Pushup",
        type: "strength",
        imagePath: "img/exercises/pushup.png",
        muscles: ["Biceps", "Triceps", "Pectoralis", "Abdominals", "Deltoids"],
        bodyParts: ["Stomach", "Chest", "Arms", "Shoulders"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise4.save();

    const exercise5 = new Exercise({
        _id: 5,
        name: "Sprint",
        type: "strength",
        imagePath: "",
        muscles: ["Legs"],
        bodyParts: ["Legs", "Cardio"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise5.save();

    const exercise6 = new Exercise({
        _id: 6,
        name: "Downward Dog",
        type: "strength",
        imagePath: "",
        muscles: ["arms", "shoulders", "legs"],
        bodyParts: ["Stomach", "Legs", "Cardio", "Shoulders"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise6.save();

    const exercise7 = new Exercise({
        _id: 7,
        name: "Run",
        type: "endurance",
        imagePath: "img/exercises/run.jpg",
        muscles: ["Glutes", "Quadriceps", "Hamstrings"],
        bodyParts: ["Legs", "Cardio"],
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