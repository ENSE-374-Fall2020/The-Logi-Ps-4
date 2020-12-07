// PURPOSE: clear and initialize list of sample sets

const dbObjects = require(__dirname + "/dbObjects.js");
const Set = dbObjects.Set;
const Workout = dbObjects.Workout;

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/progressDB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

console.log("connected to progressDB");

async function destroyWorkoutCollection() {

    await Workout.deleteMany({}, function (err) {
        if (err) console.log("Error in deleting existing collection");
    });
}

async function destroySetCollection() {

    await Set.deleteMany({}, function (err) {
        if (err) console.log("Error in deleting existing collection");
    });
}

async function generateSetAndWorkoutCollection() {

    const set1 = new Set({
        exercise: "Sprint",
        repetitions: 8,
        sets: 3
    });

    await set1.save();

    const set2 = new Set({
        exercise: "Downward Dog",
        duration: "45 seconds",
        sets: 3
    });

    await set2.save();

    const set3 = new Set({
        exercise: "Pushup",
        repetitions: 25,
        sets: 3
    });

    await set3.save();

    const set4 = new Set({
        exercise: "Run",
        duration: "2km"
    });

    await set4.save();

    const workout1 = new Workout({
        name: "Full Body",
        sets: [set1, set2, set3]
    });

    await workout1.save();

    const workout2 = new Workout({
        name: "Track & Field",
        sets: [set1, set2, set4]
    });

    await workout2.save();

    await mongoose.connection.close();

    console.log("Workout list created successfully");
}

destroyWorkoutCollection();
destroySetCollection();
generateSetAndWorkoutCollection();

exports.destroyWorkoutCollection = destroyWorkoutCollection;
exports.destroySetCollection = destroySetCollection;
exports.generateSetAndWorkoutCollection = generateSetAndWorkoutCollection;
