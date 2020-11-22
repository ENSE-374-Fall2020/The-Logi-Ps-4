$(function () {
    console.log("file viewFunctions.js loaded successfully");

    function populateExerciseSideList(allExercisesList) {
        for (let exercise of allExercisesList) {
            for (let bodyPart of exercise.bodyParts) {
                $(bodyPart)
            }
        }
    }

    // for each exercise bodyPart
    // find the header element for that bodypart
    // add the exercise to that list
});