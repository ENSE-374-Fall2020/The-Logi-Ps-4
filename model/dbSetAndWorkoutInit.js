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
    // destroy existing collection of workouts

    await Workout.deleteMany({}, function (err) {
        if (err) console.log("Error in deleting existing collection");
        else console.log("Collection 'workouts' destroyed");
    });
}

async function destroySetCollection() {
    // destroy existing collection of sets

    await Set.deleteMany({}, function (err) {
        if (err) console.log("Error in deleting existing collection");
        else console.log("Collection 'sets' destroyed");
    });
}

async function generateSetAndWorkoutCollection() {

    const set1 = new Set({
        _id: 11,
        exercise: "Sprint",
        repetitions: 8,
        sets: 3
    });

    await set1.save();

    const set2 = new Set({
        _id: 12,
        exercise: "Downward Dog",
        duration: "45 seconds",
        sets: 3
    });

    await set2.save();

    const set3 = new Set({
        _id: 13,
        exercise: "Pushup",
        repetitions: 25,
        sets: 3
    });

    await set3.save();

    const set4 = new Set({
        _id: 14,
        exercise: "Run",
        duration: "2km"
    });

    await set4.save();

    const workout1 = new Workout({
        _id: 21,
        name: "Full Body",
        sets: [set1, set2, set3]
    });

    await workout1.save();

    const workout2 = new Workout({
        _id: 22,
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
