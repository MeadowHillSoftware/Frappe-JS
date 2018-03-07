//Copyright 2018 Meadow Hill Software. Some rights reserved.
//Affero GPL 3 or Later

"use strict";
var oFrappe = {};

oFrappe.addMainEventListeners = function() {
    $('#dice-entry')
        .on('keypress', oFrappe.handleDiceEntryKeypress);
    $('#enter-button')
        .on('click', oFrappe.handleButtonClick);
};
oFrappe.addParagraph = function(sText) {
    var paragraph = $('<p></p>')
        .text(sText);
    var results = $('#results')
        .append(paragraph);
};

oFrappe.calculateOdds = function(iDice) {
    var oSuccesses = {
        0: 4,
        1: 2
    };
    var oAdders = {};
    if (iDice > 0) {
        var aNumberOfSuccesses = Object.keys(oSuccesses);
        aNumberOfSuccesses.sort();
        while (iDice > 1) {
            for (var k = 0; k < aNumberOfSuccesses.length; k++) {
                var sKey = aNumberOfSuccesses[k];
                var iMultiple = oSuccesses[sKey] * 6;
                var iQuotient = iMultiple / 3;
                var iDifference = iMultiple - iQuotient;
                oSuccesses[sKey] = iDifference;
                var iKey = Number(sKey);
                oAdders[(iKey + 1)] = iQuotient;
            }
            var aAdderKeys = Object.keys(oAdders);
            for (var k = 0; k < aAdderKeys.length; k++) {
                var sKey = aAdderKeys[k];
                if (aNumberOfSuccesses.indexOf(sKey) !== -1) {
                    oSuccesses[sKey] += oAdders[sKey];
                } else {
                    oSuccesses[sKey] = oAdders[sKey];
                    aNumberOfSuccesses = Object.keys(oSuccesses);
                    aNumberOfSuccesses.sort();
                }
            }
            iDice--;
        }
        aNumberOfSuccesses = Object.keys(oSuccesses);
        aNumberOfSuccesses.sort();
        var iTotal = 0;
        for (var k = 0; k < aNumberOfSuccesses.length; k++) {
            var sKey = aNumberOfSuccesses[k];
            iTotal += oSuccesses[sKey];
        }
        var sTotal = "Total number of possible combinations: " + String(iTotal) + ".";
        oFrappe.addParagraph(sTotal);
        for (var k = 0; k < aNumberOfSuccesses.length; k++) {
            var sKey = aNumberOfSuccesses[k];
            var iCombos = oSuccesses[sKey];
            var sCombos = "Number of possible combinations with " + String(sKey) + " successes: " + String(iCombos) + ".";
            oFrappe.addParagraph(sCombos);
        }
        for (var k = 0; k < aNumberOfSuccesses.length; k++) {
            var sKey = aNumberOfSuccesses[k];
            var iCombos = oSuccesses[sKey];
            var iPercent = ((oSuccesses[sKey] * 100) / iTotal);
            var sPercents = "Chance of " + String(sKey) + " successes: " + String(iPercent) + " percent.";
            oFrappe.addParagraph(sPercents);
        }
    };
};

oFrappe.handleButtonClick = function(event) {
    event.stopPropagation();
    oFrappe.processInput();
};

oFrappe.handleDiceEntryKeypress = function(event) {
    var sKey = event.key;
    event.stopPropagation()
    if (sKey === "Enter") {
        oFrappe.processInput();
    }
};

oFrappe.processInput = function() {
    var dice = $('#dice-entry');
    var sDice = dice.val();
    dice
        .val('')
        .focus();
    var iDice = Number(sDice);
    if (!isNaN(iDice) && iDice > 0) {
        var sText = "Number of Dice: " + sDice + ".";
        $('#results').empty();
        oFrappe.addParagraph(sText);
        oFrappe.calculateOdds(iDice);
    }
};

oFrappe.addMainEventListeners();
