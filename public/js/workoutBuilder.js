console.log("workoutBuilder.js loaded succcessfully");

// create empty set before addSetCard
$(document).ready(function () {

    var numberOfSets = 0;

    function createWorkout(event) {
        console.log("create workout button clicked");

        $("#blankCard").remove();

        // some jQuery stuff
        // thanks internet!!
        var form = $("#buildWorkout");
        var formData = new FormData(form);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/buildWorkout", false);
        xhr.send(formData);

    }

    function setCardNumber(card, newId) {
        // console.log("setCardNumber called");
        card.prop("id", "setCard" + newId);
        card.find("data").prop("value" , newId);
        card.find("h4").text("SET #" + newId);
    }

    function removeCard(event) {
        console.log("remove button clicked");
        numberOfSets--;

        let currentCard = $(this).parent();
        console.log("event target: " + currentCard);
        // for each card after this one
        // rename ids to itself - 1
        let currentCardId = 0;
        let cardList = currentCard.nextAll(); // all children AFTER this card
        console.log("card list: " + cardList + " \n.getted: " + cardList.get());
        for (card of cardList) {
            console.log("iterating card is: " + card);
            currentCardId = card.firstElementChild().getAttribute("value");
            setCardNumber(card, currentCardId);
        }
        currentCard.remove();
    }

    function addBlankCard(event) {
        console.log("add button clicked");
        numberOfSets++;

        let newCard = blankCard.clone(); // copy default, blank card
        newCard.toggleClass("d-none");
        addSetCard.before(newCard);

        // change all id numbers to current numberOfSets
        setCardNumber(newCard, numberOfSets);

        // add event listener to remove button
        // for destroying card
        newCard.find("#removeButton").on("click", removeCard);
    }

    // ======================================================

    var blankCard = $("#blankCard");
    var addSetCard = $("#addSetCard"); // card that contains add button
    var submittedName = $("#workoutName"); // name of workout to submit
    var submittedSets = []; // list of sets to submit
    // has [id], exercise, repetitions, set, duration

    $("#addButton").on("click", addBlankCard);
    $("#createButton").on("click", createWorkout);
}); 
