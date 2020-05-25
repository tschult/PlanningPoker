"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/pokerHub").build();


connection.on("ReceiveNewUser", function (user, connectionId) {
    appendLine(user + " ist beigetreten.");
    sendMyStatus();
});

connection.on("ReceiveUserDisconnect", function (connectionId) {
    appendLine(connectionId + " ist gegangen.");
});

connection.on("ReceiveStatus", function (user, lockedIn) {
    if (lockedIn) {
        appendLine(user + " hat eine Karte ausgewählt!");
    } else {
        appendLine(user + " hat sich noch nicht für eine Karte entschieden.");
    }
});

connection.on("ReceiveStart", function (user, cards) {
    document.getElementById("startNewRoundButton").style.display = "none";
    document.getElementById("endRoundButton").style.display = "block";
    enableCardSelection();
    fillCardOptions(cards);
    document.getElementById("cards").style.display = "block";

    appendLine(user + " hat eine neue Runde gestartet. Mögliche Karten sind: " + cards);
});

connection.on("ReceiveEnd", function (user) {
    document.getElementById("startNewRoundButton").style.display = "block";
    document.getElementById("endRoundButton").style.display = "none";
    document.getElementById("cards").style.display = "none";

    appendLine(user + " hat die Runde beendet. Es wird aufgedeckt...");

    revealMyCard();
});

connection.on("ReceiveCard", function (user, card) {
    appendLine(user + " hat " + card + " gewählt.");
});


document.getElementById("enterButton").addEventListener("click", function (event) {

    connection.start().then(function () {

        var user = document.getElementById("userInput").value;
        document.getElementById("spn-user").innerText = user;

        document.getElementById("entrance").style.display = "none";
        document.getElementById("pokerRoom").style.display = "block";

        connection.invoke("Enter", user).catch(function (err) {
            return console.error(err.toString());
        });

    }).catch(function (err) {
        return console.error(err.toString());
    });

    
    event.preventDefault();
});

document.getElementById("startNewRoundButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    var cards = ["1", "2", "3", "5", "8", "13", "Kaffee"];
    
    connection.invoke("StartRound", user, cards).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("endRoundButton").addEventListener("click", function (event) {
    var user = document.getElementById("userInput").value;
    
    connection.invoke("EndRound", user).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("lockCardButton").addEventListener("click", function (event) {
    disableCardSelection();
    sendMyStatus();
    event.preventDefault();
});

document.getElementById("unlockCardButton").addEventListener("click", function (event) {
    enableCardSelection();
    sendMyStatus();
    event.preventDefault();
});



function appendLine(msg) {
    var li = document.createElement("li");
    li.textContent = msg;
    document.getElementById("messagesList").appendChild(li);
}

function sendMyStatus() {
    var user = document.getElementById("userInput").value;
    connection.invoke("SendStatus", user, isCardSelected()).catch(function (err) {
        return console.error(err.toString());
    });
}

function revealMyCard() {
    if (isCardSelected()) {
        var user = document.getElementById("userInput").value;
        var card = document.getElementById("cardSelect").value;
        connection.invoke("RevealCard", user, card).catch(function(err) {
            return console.error(err.toString());
        });
    }
}

function fillCardOptions(cards) {

    var select = document.getElementById("cardSelect");
    while (select.options.length) select.options.remove(0);
    
    cards.forEach(card => {
        var option = document.createElement("option");
        option.textContent = card;
        select.appendChild(option);
    });
}

function isCardSelected() {
    return document.getElementById("cardSelect").disabled;
}

function enableCardSelection() {
    document.getElementById("cardSelect").disabled = false;
    document.getElementById("lockCardButton").style.display = "inline";
    document.getElementById("unlockCardButton").style.display = "none";
}

function disableCardSelection() {
    document.getElementById("cardSelect").disabled = true;
    document.getElementById("lockCardButton").style.display = "none";
    document.getElementById("unlockCardButton").style.display = "inline";
}

