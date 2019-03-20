class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }

    play() {
        this.sound.play();
    }
    stop() {
        this.sound.pause();
    }
}

class Character {
    constructor(name, imgName, isJedi) {
        this.name = name;
        this.healthPoints = this.calculatePoints(100, 30);
        this.attackPoints = this.calculatePoints(10, 1);
        this.originalAttackPoints = this.attackPoints;
        this.counterAttackPoints = this.calculatePoints(25, 1);
        this.imgName = imgName;
        this.isChosen = false;
        this.isOpponent = false;
        this.isJedi = isJedi;
        if (!this.isJedi) {
            this.openingSound = new Sound("assets/sounds/LaserBlaster.mp3");
            this.attackSound = new Sound("assets/sounds/LaserBlasts.mp3");
        } else {
            this.openingSound = new Sound("assets/sounds/LightsaberTurnOn.mp3");
            this.attackSound = new Sound("assets/sounds/LightsaberClash.mp3");
        }
        if (this.imgName == "chewie") {
            this.openingSound = new Sound("assets/sounds/Chewbacca.mp3");
        }
    }

    calculatePoints(max, min) {
        var points = Math.floor((Math.random() * max) + min);;
        return points;
    }
}

var goodCharactersArr = [];
var evilCharactersArr = [];
var choseCharacter = false;
var choseOpponent = false;
var chosenCharacter = {};
var currentOpponent = {};
var numCharsDefeated = 0;

function clearView() {
    $("#goodGuysDeck").empty();
    $("#badGuysDeck").empty();
    $("#playbtn").css('display', 'none');
    $("#chosenCharacter").empty();
    $("#opponentCard").empty();
}

function resetGame() {

    goodCharactersArr = [new Character("Luke", "luke", true), new Character("Solo", "hanSolo", false), new Character("Chewie", "chewie", false), new Character("Rey", "rey", true)];

    evilCharactersArr = [new Character("Maul", "darthMaul", true), new Character("Vader", "darthVader", true), new Character("Trooper", "stormTropper", false), new Character("Kylo", "kylo", true)];

    clearView();

    //generate good guys card decks
    goodCharactersArr.forEach(character => {
        var card = createCard(character);
        $('#goodGuysDeck').append(card);
    });

    //generate evil guys card deck
    evilCharactersArr.forEach(character => {
        var card = createCard(character);
        $('#badGuysDeck').append(card);
    });

    //enable attack button
    $('#attackBtn').prop("disabled", false);

    chosenCharacter = {};
    currentOpponent = {};
    numCharsDefeated = 0;
    choseCharacter = false;
    choseOpponent = false;

    updateInstructions();
}

function updateInstructions(status = "") {

    if (choseCharacter == false && status == "") {
        $('#instruccions').text("Choose your character");
        $('#attackBtn').hide();
    }
    if (choseCharacter == true && choseOpponent == false && status == "") {
        $('#instruccions').text("Choose your opponent");
    }

    if (choseCharacter == true && choseOpponent == true && status == "") {
        $('#instruccions').text("Attack!");
        $('#attackBtn').show();
    }

    if (status == "winner") {
        $('#instruccions').text("You won!");
        return;
    }

    if (status == "defeated") {
        $('#instruccions').text("You were defeated! Game Over.");
        return;
    }

}

function createCard(character) {
    var card = $('<div>', {
        class: 'card character',
        id: character.imgName + 'card',
        click: function () {
            character.openingSound.play();
            if (!choseCharacter) {
                character.isChosen = true;
                $('#chosenCharacter').append($(this));
                choseCharacter = true;
                chosenCharacter = character;
                updateInstructions();
            } else if (!choseOpponent) {
                character.isOpponent = true;
                $('#opponentCard').append($(this));
                choseOpponent = true;
                currentOpponent = character;
                updateInstructions();
            }

        }
    });
    var cardimg = $('<img>', {
        class: 'card-img-top',
        src: 'assets/images/' + character.imgName + '.jpg',
        alt: character.name
    });
    var cardbody = $('<div>').addClass('card-body');
    var cardtitle = $('<h5>', {
        class: 'card-title',
        text: character.name
    });
    var cardtext = $('<p>', {
        class: 'card-text',
        id: character.imgName + 'pointsText',
        text: 'HP: ' + character.healthPoints
            + ' AP: ' + character.attackPoints
            + ' CAP: ' + character.counterAttackPoints
    });

    cardbody.append(cardtitle);
    cardbody.append(cardtext);

    card.append(cardimg);
    card.append(cardbody);

    return card;
}

function updateCardPoints(character) {

    var charId = '#' + character.imgName + 'pointsText';
    var charText = 'HP: ' + character.healthPoints
        + ' AP: ' + character.attackPoints
        + ' CAP: ' + character.counterAttackPoints;

    $(charId).text(charText);
}

function checkForWin() {

    if (chosenCharacter.healthPoints <= 0) {
        //you lost
        chosenCharacter.healthPoints = 0;
        updateInstructions("defeated");
        $('#attackBtn').prop("disabled", true);
        $('#playbtn').show();

    } else if (currentOpponent.healthPoints <= 0) {
        //you defeated current opponent
        currentOpponent.healthPoints = 0;
        numCharsDefeated++;

        if (numCharsDefeated < evilCharactersArr.length) {
            //choose your next opponent
            $('#opponentCard').empty();
            currentOpponent = {};
            choseOpponent = false;
            updateInstructions();

        } else {
            //no more opponents - you Won!
            updateInstructions("winner");
            $('#attackBtn').prop("disabled", true);
            $('#playbtn').show();
        }
    }
}

function attack() {
    if (!choseOpponent || !choseCharacter) {
        return;
    }

    currentOpponent.healthPoints -= chosenCharacter.attackPoints;
    chosenCharacter.attackSound.play();
    chosenCharacter.attackPoints += chosenCharacter.originalAttackPoints;
    chosenCharacter.healthPoints -= currentOpponent.counterAttackPoints;
    currentOpponent.attackSound.play();

    checkForWin();

    updateCardPoints(chosenCharacter);
    updateCardPoints(currentOpponent);
}

$(document).ready(function () {

    resetGame();

    $('#gameInstructionsPopOver').popover({
        container: 'body'
    });

});