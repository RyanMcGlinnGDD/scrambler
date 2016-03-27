"use strict";
//imports
var Game = require('./modules/game.js');
var Point = require('./modules/point.js');
var MouseState = require('./modules/mouseState.js');
var PlacementObject = require('./modules/placementObject.js');

//variables
var game;
var canvas;
var ctx;

var center;

var mousePosition;
var relativeMousePosition;
var mouseDown;
var mouseIn;

var placement;

var lastUpdate;

window.onload = function(e){
    initializeVariables();
    loop();
}

function initializeVariables(){
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    console.log("Canvas Dimensions: " + canvas.width + ", " + canvas.height);
    
    center = new Point(canvas.width/2, canvas.height/2);
    
    mousePosition = new Point(0,0);
    relativeMousePosition = new Point(0,0);
    
    //event listener for when the mouse moves over the canvas
    canvas.addEventListener("mousemove", function(e){
        var boundRect = canvas.getBoundingClientRect();
        mousePosition = new Point(e.clientX - boundRect.left, e.clientY - boundRect.top);
        relativeMousePosition = new Point(mousePosition.x - (canvas.offsetWidth/2.0), mousePosition.y - (canvas.offsetHeight/2.0));        
    });
    mouseDown = false;
    canvas.addEventListener("mousedown", function(e){
        mouseDown = true;
    });
    canvas.addEventListener("mouseup", function(e){
        mouseDown = false;
    });
    mouseIn = false;
    canvas.addEventListener("mouseover", function(e){
        mouseIn = true;
    });
    canvas.addEventListener("mouseout", function(e){
        mouseIn = false;
        mouseDown = false;
    });
    
    placement = new PlacementObject(canvas.width, canvas.height, 5);
    
    game = new Game(placement);
}

function loop(){
    //dt calculation
    var now = Date.now();
    var dt = now - lastUpdate;
    lastUpdate = now;
    
    window.requestAnimationFrame(loop.bind(this));
    game.update(ctx, canvas, dt, center,  new MouseState(mousePosition, relativeMousePosition, mouseDown, mouseIn), placement);
}

window.addEventListener("resize", function(e){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    center = new Point(canvas.width / 2, canvas.height / 2)
    console.log("Canvas Dimensions: " + canvas.width + ", " + canvas.height);
    
    //update placement stuff
    placement.cardWidth = canvas.width / placement.divisions;
    placement.cardHeight = placement.cardWidth * .614583;
    placement.startPoint = new Point(-placement.cardWidth, (canvas.height / 2) - placement.cardHeight);
    placement.endPoint = new Point(canvas.width + placement.cardWidth, canvas.height + placement.cardHeight);
});



