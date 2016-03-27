"use strict";
var Point = require('./point.js');
var DrawLib = require('./drawLib.js');
var Member = require('./member.js');
var Utilities = require('./utilities.js');
var Card = require('./card.js');

var gameMode;

var mouseState;
var previousMouseState;
var mouseTarget;
var painter;
var placement;

var memberList;
var dataRead;

var cardOverlay;

//game mode 1 stuff
var activeCardList;
var cardSpeed;
var intervalCounter;
var memberIncrementer;


function game(pPlacement){
    dataRead = false;
    gameMode = 1;
    cardOverlay = new Image();
    cardOverlay.src = "images/overlay.png";
    
    painter = new DrawLib();
    placement = pPlacement;
    
    memberList = [];
    parseData("../../data/roster.csv");
    
    //game mode 1 stuff
    activeCardList = [];
    cardSpeed = .01;
    intervalCounter = 0;
    memberIncrementer = 0;
}

function parseData(pUrl){
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var response = xhr.responseText;
        var lineList = response.split("\n");
        
        for(var i = 0; i < lineList.length; i++){
            var lineSplit = lineList[i].split(",");
            memberList.push(new Member(i, lineSplit[0], lineSplit[1], lineSplit[2]));
        }
        dataRead = true;
    }
    xhr.open('GET', pUrl, true);
    xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2010 00:00:00 GMT");
    xhr.send();
}

var p = game.prototype;

p.update = function(ctx, canvas, dt, center, pMouseState, pPlacementObject){
    placement = pPlacementObject;
    previousMouseState = mouseState;
    mouseState = pMouseState;
    mouseTarget = 0;
    if(typeof previousMouseState === 'undefined'){
        previousMouseState = mouseState;
    }
    if(dataRead){
        //update stuff
        p.act(dt);
        //draw stuff
        p.draw(ctx, canvas, center);
    }
}

p.act = function(dt){
    if(gameMode == 0){
        
    }
    else if(gameMode == 1){
        if(intervalCounter == 0){
            activeCardList.push(new Card(memberList[memberIncrementer]));
            memberIncrementer++;
            if(memberIncrementer > memberList.length - 1){
                memberIncrementer = 0;
            }
        }
        for(var i = 0; i < activeCardList.length; i++){
            //add to each card's progress
            activeCardList[i].progress += cardSpeed * dt;
        }
        
        if(activeCardList[0].progress > 100){
            activeCardList.splice(0,1);
        }
        
        //interval management
        intervalCounter += cardSpeed * dt;
        if(intervalCounter > (50 / placement.divisions)){
            intervalCounter = 0;
        }
    }
}

p.draw = function(ctx, canvas, center){
    //draw board
    ctx.save();
    painter.clear(ctx, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
    painter.rect(ctx, 0, 0, canvas.offsetWidth, canvas.offsetHeight, "white");
    painter.line(ctx, canvas.offsetWidth/2, center.y - canvas.offsetHeight/2, canvas.offsetWidth/2, canvas.offsetHeight, 2, "lightgray");
    painter.line(ctx, 0, center.y, canvas.offsetWidth, center.y, 2, "lightGray");
    
    painter.line(ctx, placement.startPoint.x, placement.startPoint.y, placement.endPoint.x, placement.endPoint.y, 2, "blue");
    
    if(gameMode == 0){
        
    }
    else if(gameMode == 1){
        for(var i = activeCardList.length - 1; i > -1; i--){
            //draw each card
            activeCardList[i].draw(ctx, placement, cardOverlay);
        }
    }
    ctx.restore();
}

module.exports = game;

//pElement is the object on the canvas that is being checked against the mouse, pOffsetter will most likely be the board so we can subtract position or whatever it needs to remain aligned
function mouseIntersect(pElement, pOffsetter, pScale){
    if(mouseState.relativePosition.x + pOffsetter.x > (pElement.position.x - (pScale*pElement.width)/2) && mouseState.relativePosition.x + pOffsetter.x < (pElement.position.x + (pScale*pElement.width)/2)){
        if(mouseState.relativePosition.y + pOffsetter.y > (pElement.position.y - (pScale*pElement.height)/2) && mouseState.relativePosition.y + pOffsetter.y < (pElement.position.y + (pScale*pElement.height)/2)){
            pElement.mouseOver = true;
        }
        else{
            pElement.mouseOver = false;
        }
    }
    else{
        pElement.mouseOver = false;
    }
}