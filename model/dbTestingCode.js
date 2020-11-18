const dbObjects = require(__dirname + "/dbObjects.js");
const Exercise = dbObjects.Exercise;
const Set = dbObjects.Set;
const Workout = dbObjects.Workout;
const FinishedWorkout = dbObjects.FinishedWorkout;
const CurrentWorkout = dbObjects.CurrentWorkout;
const User = dbObjects.User;
const Post = dbObjects.Post;

const mongoose = require("mongoose");

async function addStaticExercises(id, name, type, muscles, tutorialURL) {
    console.log("\nadding static exercise...");
    // construct exercise using input variables
    const exercise = new Exercise({
        _id: id,
        name: name,
        type: type,
        muscles: muscles,
        tutorialURL: tutorialURL
    });
    await exercise.save();
}

// it would be great if this was a generic function
// that you could pass the attribute and the value to
//      i.e. findExerciseBy("type", "strength") to look
//      for all exercises by type strength
async function findExercisesByType(value) {
    console.log("\nsearching for exercises with type: '" + value + "'...");
    await Exercise.find({ type: value }, function (err, results) {
        if (err) console.log(err);
        else { // found exercises of given type
            if (results.length !== 0) {
                let listOfExercises = [];
                for (currentExercise of results) {
                    // console.log(currentExercise.name, currentExercise.muscles);
                    listOfExercises.push(currentExercise.name);
                }
                //console.log(listOfExercises);
                return listOfExercises;
            }
        }
    });
    await mongoose.connection.close(); // ***
    return 0; // no exercises of given type found
}

async function callToDatabase() {
    // open the connection
    // call the test functions
    // close the connection
    mongoose.connect("mongodb://localhost:27017/testdb",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log("connected to testdb");

    // load sample data
    addStaticExercises(7, "jump squat", "strength", ["legs"], "www.goToWebsite.com");
    addStaticExercises(8, "sprint", "strength", ["legs", "cardio"], "www.goToWebsite.com");
    let listOfStrengthExercises = findExercisesByType("strength");
    console.log(listOfStrengthExercises);
  
    // *********************************************************
    // Pseudo-code for creating a workout
    // ----------------------------------
    // for each exercise (accessed by id or name) in an array
    //      (alternatively, array is only of exercise name or id, not entire exercise)
    // create a set connected to that id with fixed amount and duration
    //      (eventually this will be taken from form input)
    // every set_array.workout_id contains the same value (points to same workout)
    // now, with an array of sets
    // *********************************************************
}

callToDatabase();