// PURPOSE: clear and initialize list of all exercises

// AUTHOR: Jacob Meyer

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
        name: "Situp",
        type: "strength",
        imagePath: "",
        muscles: ["abs"],
        bodyPart: ["abs"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise1.save();

    const exercise2 = new Exercise({
        _id: 2,
        name: "Squat",
        type: "strength",
        imagePath: "",
        muscles: ["quadriceps", "glutes", "hamstrings", "abs"],
        bodyPart: ["abs", "legs"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise2.save();

    const exercise3 = new Exercise({
        _id: 3,
        name: "Pullup",
        type: "strength",
        imagePath: "",
        muscles: ["arms", "shoulders", "chest", "back"],
        bodyPart: ["abs", "chest", "arms"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise3.save();

    const exercise4 = new Exercise({
        _id: 4,
        name: "Pushup",
        type: "strength",
        imagePath: "",
        muscles: ["arms", "shoulders", "chest", "back"],
        bodyPart: ["abs", "chest", "arms"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise4.save();

    const exercise5 = new Exercise({
        _id: 5,
        name: "Sprint",
        type: "endurance",
        imagePath: "",
        muscles: ["legs"],
        bodyPart: ["abs", "legs", "cardio"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise5.save();

    const exercise6 = new Exercise({
        _id: 6,
        name: "Downward Dog",
        type: "strength",
        imagePath: "",
        muscles: ["arms", "shoulders", "legs"],
        bodyPart: ["abs", "legs", "cardio"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise6.save();

    const exercise7 = new Exercise({
        _id: 7,
        name: "Run",
        type: "endurance",
        imagePath: "",
        muscles: ["abs", "legs"],
        bodyPart: ["abs", "legs", "cardio"],
        tutorialURL: "www.goToWebsite.com"
    });
    await exercise7.save();

    const set1 = new Set({
        _id: 1,
        exercise: "Sprint",
        repetitions: 8,
        sets: 3
    })

    await set1.save();

    const set2 = new Set({
        _id: 2,
        exercise: "Downward Dog",
        duration: "45 seconds",
        sets: 3
    })

    await set2.save();

    const set3 = new Set({
        _id: 3,
        exercise: "Pushup",
        repetitions: 25,
        sets: 3
    })

    await set3.save();

    const set4 = new Set({
        _id: 4,
        exercise: "Run",
        duration: "2km"
    })

    await set4.save();

    const workout1 = new Workout({
        _id: 1,
        name: "Full Body",
        sets: [set1, set2, set3]
    })

    await workout1.save();

    const workout2 = new Workout({
        _id: 2,
        name: "Track & Field",
        sets: [set1, set2, set4]
    })

    await workout2.save();

    await mongoose.connection.close();
    console.log("List created successfully");
}

destroyExerciseCollection();
generateExerciseCollection();

exports.destroyExerciseCollection = destroyExerciseCollection;
exports.generateExerciseCollection = generateExerciseCollection;