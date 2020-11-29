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
        // true js DOM/jQuery wizard status has been achieved

        if (card instanceof jQuery) { // card is jQuery object
            console.log("setCardNumber called for (jQuery) " + card.prop("id") + ", changing to " + newId);
            card.prop("id", "setCard" + newId);
            card.find("data").prop("value", newId);
            card.find("h4").text("SET #" + newId);
        } else if (card instanceof HTMLElement) { // card is HTML DOM object
            console.log("setCardNumber called for (DOM) " + card.getAttribute("id") + ", changing to " + newId);
            card.setAttribute("id", "setCard" + newId);
            card.firstElementChild.value = newId; // assuming first element is <data>
            card.firstElementChild.nextElementSibling.innerText = "SET #" + newId; // assuming second element is <h4> title
        } else {
            console.log("ERROR setting card number");
        }
    }

    function removeCard(event) {
        numberOfSets--;

        let currentCard = $(this).parent();
        console.log("removing card " + currentCard.prop("id"));
        // for each card after this one
        // rename ids to itself - 1
        let currentCardId = 0;
        let cardList = currentCard.nextAll(":not(#addSetCard)"); // all children AFTER this card
        // console.log("card list: " + cardList + " \n\t.getted: " + cardList.get());
        //for (card of cardList) {
        cardList.each((index, card) => {
            // console.log("iterating card is: " + card);
            currentCardId = card.firstElementChild.getAttribute("value");
            setCardNumber(card, currentCardId - 1);
        });
        currentCard.remove();
    }

    function updateImageSource(event) {
        console.log("changing image source...");

        let imagePath = $(this).find(":selected").attr("data-image-path");
        // console.log("Found imagePath: " + imagePath + " from element: " + $(this).get());
        let image = $(this).closest("article").children("img");
        // console.log("Found image element: " + image.get());
        image.attr("src", imagePath);
    }

    function addBlankCard(event) {
        console.log("adding new card...");
        numberOfSets++;

        let newCard = blankCard.clone(); // copy default, blank card
        newCard.toggleClass("d-none");
        addSetCard.before(newCard);

        // change all id numbers to current numberOfSets
        setCardNumber(newCard, numberOfSets);

        // add event listeners
        newCard.find("#exercise").on("change", updateImageSource);
        newCard.find("#removeButton").on("click", removeCard);
    }

    // END function definitions
    // ======================================================

    var blankCard = $("#blankCard");
    var addSetCard = $("#addSetCard"); // card that contains add button
    var submittedName = $("#workoutName"); // name of workout to submit
    var submittedSets = []; // list of sets to submit
    // has [id], exercise, repetitions, set, duration

    $("#addButton").on("click", addBlankCard);
    $("#createButton").on("click", createWorkout);

    // click to hide instructions
    $("#alertMessage").on("click", function (event) {
        console.log("Hiding help message");
        event.currentTarget.classList.add("fade");
    });
}); 
