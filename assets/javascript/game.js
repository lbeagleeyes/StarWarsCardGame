

class Character {
    constructor(name, imgName, isChosen, isOpponent) {
        this.name = name;
        this.healthPoints = this.calculatePoints(100, 30);
        this.attackPoints = this.calculatePoints(10, 1);
        this.originalAttackPoints = this.attackPoints;
        this.counterAttackPoints = this.calculatePoints(25, 1);
        this.imgName = imgName;
        this.isChosen = isChosen;
        this.isOpponent = isOpponent;
    }

    calculatePoints(max, min) {
        var points = Math.floor((Math.random() * max) + min);;
        return points;
    }

    resetAttackPoints() {
        this.attackPoints = this.originalAttackPoints;
    }

    // updatePoints() {

    // }


}



var goodCharactersArr = [];
var evilCharactersArr = [];
var choseCharacter = false;
var choseOpponent = false;
var chosenCharacter = {};
var currentOpponent = {};
var numCharsDefeated = 0;

function resetGame() {
    goodCharactersArr = [new Character("Luke", "luke", false, false), new Character("Solo", "hanSolo", false, false), new Character("Chewie", "chewie", false, false), new Character("Rey", "rey", false, false)];
    evilCharactersArr = [new Character("Maul", "darthMaul"), new Character("Vader", "darthVader", false, false), new Character("Trooper", "stormTropper", false, false), new Character("Kylo", "kylo", false, false)];

    $("#goodGuysDeck").empty();
    $("#badGuysDeck").empty();
    $("#playbtn").css('display', 'none');
    $("#chosenCharacter").empty();
    $("#opponentCard").empty();

    //generate good guy card decks

    goodCharactersArr.forEach(character => {
        var card = createCard(character);
        $('#goodGuysDeck').append(card);
    });

    evilCharactersArr.forEach(character => {
        var card = createCard(character);
        $('#badGuysDeck').append(card);
    });

    $('#attackBtn').prop("disabled", false);

    chosenCharacter = {};
    currentOpponent = {};
    numCharsDefeated = 0;
    choseCharacter = false;
    choseOpponent = false;
    updateInstructions();

}

function updateInstructions(status = "") {

 

    if (status == "winner") {
        $('#instruccions').text("You won!");
        return;
    }

    if (choseCharacter == false) {
        $('#instruccions').text("Choose your character");
        $('#attackBtn').hide();
    }
    if (choseCharacter == true && choseOpponent == false) {
        $('#instruccions').text("Choose your opponent");
    }

    if (choseCharacter == true && choseOpponent == true) {
        $('#instruccions').text("Attack!");
        $('#attackBtn').show();
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
            if (!choseCharacter) {
                character.isChosen = true;
                //set visibility to false
                $('#chosenCharacter').append($(this));
                choseCharacter = true;
                chosenCharacter = character;
                updateInstructions();
            } else {
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
            + ' ABP: ' + character.attackPoints
            + ' CAP: ' + character.counterAttackPoints
    });

    cardbody.append(cardtitle);
    cardbody.append(cardtext);

    card.append(cardimg);
    card.append(cardbody);

    return card;
}

function attack() {
    currentOpponent.healthPoints -= chosenCharacter.attackPoints;
    chosenCharacter.attackPoints *= 2;
    chosenCharacter.healthPoints -= currentOpponent.counterAttackPoints;

    //checkforWin
    if (chosenCharacter.healthPoints <= 0) {
        chosenCharacter.healthPoints = 0;
        updateInstructions("defeated");
        $('#attackBtn').prop("disabled", true);
        $('#playbtn').show();
        //youLost
    }
    if (currentOpponent.healthPoints <= 0) {
        currentOpponent.healthPoints = 0;
        chosenCharacter.resetAttackPoints();

        if (numCharsDefeated < evilCharactersArr.length) {
            numCharsDefeated++;
            $('#opponentCard').empty();
            currentOpponent = {};
            choseOpponent = false;
            updateInstructions();
        } else {
            //youWon!
            updateInstructions("winner");
            $('#attackBtn').prop("disabled", true);
            $('#playbtn').show();
        }
    }

    var charId = '#' + chosenCharacter.imgName + 'pointsText';
    var charText = 'HP: ' + chosenCharacter.healthPoints
        + ' ABP: ' + chosenCharacter.attackPoints
        + ' CAP: ' + chosenCharacter.counterAttackPoints;

    var opponentId = '#' + currentOpponent.imgName + 'pointsText';
    var opponentText = 'HP: ' + currentOpponent.healthPoints
        + ' ABP: ' + currentOpponent.attackPoints
        + ' CAP: ' + currentOpponent.counterAttackPoints;

    $(charId).text(charText);
    $(opponentId).text(opponentText);
    // chosenCharacter.updatePoints();
    // currentOpponent.updatePoints();


}

$(document).ready(function () {

    resetGame();

});