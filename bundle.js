(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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




},{"./modules/game.js":6,"./modules/mouseState.js":8,"./modules/placementObject.js":9,"./modules/point.js":10}],2:[function(require,module,exports){
"use strict";

//parameter is a point that denotes starting position
function button(startPosition, width, height){
    this.position = position;
    this.width = width;
    this.height = height;
    this.clicked = false;
    this.hovered = false;
}
button.drawLib = undefined;

var p = button.prototype;

p.draw = function(ctx){
    ctx.save();
    var col;
    if(this.hovered){
        col = "dodgerblue";
    }
    else{
        col = "lightblue";
    }
    //draw rounded container
    boardButton.drawLib.rect(ctx, this.position.x - this.width/2, this.position.y - this.height/2, this.width, this.height, col);

    ctx.restore();
};

module.exports = button;
},{}],3:[function(require,module,exports){
"use strict";
var UtilityLibrary = require('./utilities.js');

var utility;

//parameter is a point that denotes starting position
function card(pMember){
    this.progress = 0;
    this.name = pMember.name;
    this.number = pMember.number;
    this.image = new Image();
    this.image.src = "images/" + pMember.image;
    
    utility = new UtilityLibrary();
}

card.drawLib = undefined;

var p = card.prototype;

p.draw = function(ctx, pPlacement, pOverlay){
    var drawPositionX = utility.map(this.progress, 0, 100, pPlacement.startPoint.x, pPlacement.endPoint.x);
    var drawPositionY = utility.map(this.progress, 0, 100, pPlacement.startPoint.y, pPlacement.endPoint.y);
    
    
    ctx.save();
    ctx.drawImage(this.image, drawPositionX - pPlacement.cardWidth/2, drawPositionY - pPlacement.cardHeight/2, pPlacement.cardWidth, pPlacement.cardHeight);
    ctx.drawImage(pOverlay, drawPositionX - pPlacement.cardWidth/2, drawPositionY - pPlacement.cardHeight/2, pPlacement.cardWidth, pPlacement.cardHeight);
    ctx.restore();
};

module.exports = card;
},{"./utilities.js":11}],4:[function(require,module,exports){
"use strict";
function drawLib(){
    
}

var p = drawLib.prototype;

p.clear = function(ctx, x, y, w, h) {
    ctx.clearRect(x, y, w, h);
}

p.rect = function(ctx, x, y, w, h, col) {
    ctx.save();
    ctx.fillStyle = col;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
}

p.line = function(ctx, x1, y1, x2, y2, thickness, color) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

p.circle = function(ctx, x, y, radius, color){
    ctx.save();
    ctx.beginPath();
    ctx.arc(x,y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

function boardButton(ctx, position, width, height, hovered){
    //ctx.save();
    if(hovered){
        ctx.fillStyle = "dodgerblue";
    }
    else{
        ctx.fillStyle = "lightblue";
    }
    //draw rounded container
    ctx.rect(position.x - width/2, position.y - height/2, width, height);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fill();
    //ctx.restore();
}

module.exports = drawLib;
},{}],5:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"dup":4}],6:[function(require,module,exports){
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
},{"./card.js":3,"./drawLib.js":4,"./member.js":7,"./point.js":10,"./utilities.js":11}],7:[function(require,module,exports){
"use strict";
function member(pNumber, pFirst, pLast, pImage){
    this.number = pNumber;
    this.name = pFirst + " " + pLast;
    this.image = pImage;
}

var p = member.prototype;

module.exports = member;
},{}],8:[function(require,module,exports){
//keeps track of mouse related variables.
//calculated in main and passed to game
//contains up state
//position
//relative position
//on canvas
"use strict";
function mouseState(pPosition, pRelativePosition, pMousedown, pMouseIn){
    this.position = pPosition;
    this.relativePosition = pRelativePosition;
    this.mouseDown = pMousedown;
    this.mouseIn = pMouseIn;
}

var p = mouseState.prototype;

module.exports = mouseState;
},{}],9:[function(require,module,exports){
"use strict";
var Point = require('./point.js');

function placementObject(pCanvasWidth, pCanvasHeight, pDivisions){
    this.divisions = pDivisions;
    this.cardWidth = pCanvasWidth / this.divisions;
    this.cardHeight = this.cardWidth * .614583;//whatever the ratio is
    
    this.startPoint = new Point(-this.cardWidth, (pCanvasHeight / 2) - this.cardHeight);
    this.endPoint = new Point(pCanvasWidth + this.cardWidth, pCanvasHeight + this.cardHeight);
}

var p = placementObject.prototype;

module.exports = placementObject;
},{"./point.js":10}],10:[function(require,module,exports){
"use strict";
function point(pX, pY){
    this.x = pX;
    this.y = pY;
}

var p = point.prototype;

module.exports = point;
},{}],11:[function(require,module,exports){
"use strict";
var Point = require('./point.js');

function utilities(){
}

var p = utilities.prototype;
// returns mouse position in local coordinate system of element
p.getMouse = function(e){
    //return new app.Point((e.pageX - e.target.offsetLeft) * (app.main.renderWidth / actualCanvasWidth), (e.pageY - e.target.offsetTop) * (app.main.renderHeight / actualCanvasHeight));
    return new Point((e.pageX - e.target.offsetLeft), (e.pageY - e.target.offsetTop));
}

p.map = function(value, min1, max1, min2, max2){
    return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}

p.clamp = function(value, min, max){
    //return Math.max(min, Math.min(max, value));
}

module.exports = utilities;
},{"./point.js":10}]},{},[1,2,3,5,6,7,8,9,10,11])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9tYWluLmpzIiwianMvbW9kdWxlcy9idXR0b24uanMiLCJqcy9tb2R1bGVzL2NhcmQuanMiLCJqcy9tb2R1bGVzL2RyYXdMaWIuanMiLCJqcy9tb2R1bGVzL2dhbWUuanMiLCJqcy9tb2R1bGVzL21lbWJlci5qcyIsImpzL21vZHVsZXMvbW91c2VTdGF0ZS5qcyIsImpzL21vZHVsZXMvcGxhY2VtZW50T2JqZWN0LmpzIiwianMvbW9kdWxlcy9wb2ludC5qcyIsImpzL21vZHVsZXMvdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vaW1wb3J0c1xyXG52YXIgR2FtZSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9nYW1lLmpzJyk7XHJcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9wb2ludC5qcycpO1xyXG52YXIgTW91c2VTdGF0ZSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9tb3VzZVN0YXRlLmpzJyk7XHJcbnZhciBQbGFjZW1lbnRPYmplY3QgPSByZXF1aXJlKCcuL21vZHVsZXMvcGxhY2VtZW50T2JqZWN0LmpzJyk7XHJcblxyXG4vL3ZhcmlhYmxlc1xyXG52YXIgZ2FtZTtcclxudmFyIGNhbnZhcztcclxudmFyIGN0eDtcclxuXHJcbnZhciBjZW50ZXI7XHJcblxyXG52YXIgbW91c2VQb3NpdGlvbjtcclxudmFyIHJlbGF0aXZlTW91c2VQb3NpdGlvbjtcclxudmFyIG1vdXNlRG93bjtcclxudmFyIG1vdXNlSW47XHJcblxyXG52YXIgcGxhY2VtZW50O1xyXG5cclxudmFyIGxhc3RVcGRhdGU7XHJcblxyXG53aW5kb3cub25sb2FkID0gZnVuY3Rpb24oZSl7XHJcbiAgICBpbml0aWFsaXplVmFyaWFibGVzKCk7XHJcbiAgICBsb29wKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluaXRpYWxpemVWYXJpYWJsZXMoKXtcclxuICAgIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xyXG4gICAgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBjYW52YXMud2lkdGggPSBjYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gY2FudmFzLm9mZnNldEhlaWdodDtcclxuICAgIGNvbnNvbGUubG9nKFwiQ2FudmFzIERpbWVuc2lvbnM6IFwiICsgY2FudmFzLndpZHRoICsgXCIsIFwiICsgY2FudmFzLmhlaWdodCk7XHJcbiAgICBcclxuICAgIGNlbnRlciA9IG5ldyBQb2ludChjYW52YXMud2lkdGgvMiwgY2FudmFzLmhlaWdodC8yKTtcclxuICAgIFxyXG4gICAgbW91c2VQb3NpdGlvbiA9IG5ldyBQb2ludCgwLDApO1xyXG4gICAgcmVsYXRpdmVNb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KDAsMCk7XHJcbiAgICBcclxuICAgIC8vZXZlbnQgbGlzdGVuZXIgZm9yIHdoZW4gdGhlIG1vdXNlIG1vdmVzIG92ZXIgdGhlIGNhbnZhc1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgdmFyIGJvdW5kUmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBtb3VzZVBvc2l0aW9uID0gbmV3IFBvaW50KGUuY2xpZW50WCAtIGJvdW5kUmVjdC5sZWZ0LCBlLmNsaWVudFkgLSBib3VuZFJlY3QudG9wKTtcclxuICAgICAgICByZWxhdGl2ZU1vdXNlUG9zaXRpb24gPSBuZXcgUG9pbnQobW91c2VQb3NpdGlvbi54IC0gKGNhbnZhcy5vZmZzZXRXaWR0aC8yLjApLCBtb3VzZVBvc2l0aW9uLnkgLSAoY2FudmFzLm9mZnNldEhlaWdodC8yLjApKTsgICAgICAgIFxyXG4gICAgfSk7XHJcbiAgICBtb3VzZURvd24gPSBmYWxzZTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIG1vdXNlRG93biA9IHRydWU7XHJcbiAgICB9KTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBmdW5jdGlvbihlKXtcclxuICAgICAgICBtb3VzZURvd24gPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gICAgbW91c2VJbiA9IGZhbHNlO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgbW91c2VJbiA9IHRydWU7XHJcbiAgICB9KTtcclxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgbW91c2VJbiA9IGZhbHNlO1xyXG4gICAgICAgIG1vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIHBsYWNlbWVudCA9IG5ldyBQbGFjZW1lbnRPYmplY3QoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0LCA1KTtcclxuICAgIFxyXG4gICAgZ2FtZSA9IG5ldyBHYW1lKHBsYWNlbWVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvb3AoKXtcclxuICAgIC8vZHQgY2FsY3VsYXRpb25cclxuICAgIHZhciBub3cgPSBEYXRlLm5vdygpO1xyXG4gICAgdmFyIGR0ID0gbm93IC0gbGFzdFVwZGF0ZTtcclxuICAgIGxhc3RVcGRhdGUgPSBub3c7XHJcbiAgICBcclxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcC5iaW5kKHRoaXMpKTtcclxuICAgIGdhbWUudXBkYXRlKGN0eCwgY2FudmFzLCBkdCwgY2VudGVyLCAgbmV3IE1vdXNlU3RhdGUobW91c2VQb3NpdGlvbiwgcmVsYXRpdmVNb3VzZVBvc2l0aW9uLCBtb3VzZURvd24sIG1vdXNlSW4pLCBwbGFjZW1lbnQpO1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbihlKXtcclxuICAgIGNhbnZhcy53aWR0aCA9IGNhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBjYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG4gICAgY2VudGVyID0gbmV3IFBvaW50KGNhbnZhcy53aWR0aCAvIDIsIGNhbnZhcy5oZWlnaHQgLyAyKVxyXG4gICAgY29uc29sZS5sb2coXCJDYW52YXMgRGltZW5zaW9uczogXCIgKyBjYW52YXMud2lkdGggKyBcIiwgXCIgKyBjYW52YXMuaGVpZ2h0KTtcclxuICAgIFxyXG4gICAgLy91cGRhdGUgcGxhY2VtZW50IHN0dWZmXHJcbiAgICBwbGFjZW1lbnQuY2FyZFdpZHRoID0gY2FudmFzLndpZHRoIC8gcGxhY2VtZW50LmRpdmlzaW9ucztcclxuICAgIHBsYWNlbWVudC5jYXJkSGVpZ2h0ID0gcGxhY2VtZW50LmNhcmRXaWR0aCAqIC42MTQ1ODM7XHJcbiAgICBwbGFjZW1lbnQuc3RhcnRQb2ludCA9IG5ldyBQb2ludCgtcGxhY2VtZW50LmNhcmRXaWR0aCwgKGNhbnZhcy5oZWlnaHQgLyAyKSAtIHBsYWNlbWVudC5jYXJkSGVpZ2h0KTtcclxuICAgIHBsYWNlbWVudC5lbmRQb2ludCA9IG5ldyBQb2ludChjYW52YXMud2lkdGggKyBwbGFjZW1lbnQuY2FyZFdpZHRoLCBjYW52YXMuaGVpZ2h0ICsgcGxhY2VtZW50LmNhcmRIZWlnaHQpO1xyXG59KTtcclxuXHJcblxyXG5cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG4vL3BhcmFtZXRlciBpcyBhIHBvaW50IHRoYXQgZGVub3RlcyBzdGFydGluZyBwb3NpdGlvblxyXG5mdW5jdGlvbiBidXR0b24oc3RhcnRQb3NpdGlvbiwgd2lkdGgsIGhlaWdodCl7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIHRoaXMuY2xpY2tlZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5ob3ZlcmVkID0gZmFsc2U7XHJcbn1cclxuYnV0dG9uLmRyYXdMaWIgPSB1bmRlZmluZWQ7XHJcblxyXG52YXIgcCA9IGJ1dHRvbi5wcm90b3R5cGU7XHJcblxyXG5wLmRyYXcgPSBmdW5jdGlvbihjdHgpe1xyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIHZhciBjb2w7XHJcbiAgICBpZih0aGlzLmhvdmVyZWQpe1xyXG4gICAgICAgIGNvbCA9IFwiZG9kZ2VyYmx1ZVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICBjb2wgPSBcImxpZ2h0Ymx1ZVwiO1xyXG4gICAgfVxyXG4gICAgLy9kcmF3IHJvdW5kZWQgY29udGFpbmVyXHJcbiAgICBib2FyZEJ1dHRvbi5kcmF3TGliLnJlY3QoY3R4LCB0aGlzLnBvc2l0aW9uLnggLSB0aGlzLndpZHRoLzIsIHRoaXMucG9zaXRpb24ueSAtIHRoaXMuaGVpZ2h0LzIsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCBjb2wpO1xyXG5cclxuICAgIGN0eC5yZXN0b3JlKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJ1dHRvbjsiLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIFV0aWxpdHlMaWJyYXJ5ID0gcmVxdWlyZSgnLi91dGlsaXRpZXMuanMnKTtcclxuXHJcbnZhciB1dGlsaXR5O1xyXG5cclxuLy9wYXJhbWV0ZXIgaXMgYSBwb2ludCB0aGF0IGRlbm90ZXMgc3RhcnRpbmcgcG9zaXRpb25cclxuZnVuY3Rpb24gY2FyZChwTWVtYmVyKXtcclxuICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xyXG4gICAgdGhpcy5uYW1lID0gcE1lbWJlci5uYW1lO1xyXG4gICAgdGhpcy5udW1iZXIgPSBwTWVtYmVyLm51bWJlcjtcclxuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gXCJpbWFnZXMvXCIgKyBwTWVtYmVyLmltYWdlO1xyXG4gICAgXHJcbiAgICB1dGlsaXR5ID0gbmV3IFV0aWxpdHlMaWJyYXJ5KCk7XHJcbn1cclxuXHJcbmNhcmQuZHJhd0xpYiA9IHVuZGVmaW5lZDtcclxuXHJcbnZhciBwID0gY2FyZC5wcm90b3R5cGU7XHJcblxyXG5wLmRyYXcgPSBmdW5jdGlvbihjdHgsIHBQbGFjZW1lbnQsIHBPdmVybGF5KXtcclxuICAgIHZhciBkcmF3UG9zaXRpb25YID0gdXRpbGl0eS5tYXAodGhpcy5wcm9ncmVzcywgMCwgMTAwLCBwUGxhY2VtZW50LnN0YXJ0UG9pbnQueCwgcFBsYWNlbWVudC5lbmRQb2ludC54KTtcclxuICAgIHZhciBkcmF3UG9zaXRpb25ZID0gdXRpbGl0eS5tYXAodGhpcy5wcm9ncmVzcywgMCwgMTAwLCBwUGxhY2VtZW50LnN0YXJ0UG9pbnQueSwgcFBsYWNlbWVudC5lbmRQb2ludC55KTtcclxuICAgIFxyXG4gICAgXHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCBkcmF3UG9zaXRpb25YIC0gcFBsYWNlbWVudC5jYXJkV2lkdGgvMiwgZHJhd1Bvc2l0aW9uWSAtIHBQbGFjZW1lbnQuY2FyZEhlaWdodC8yLCBwUGxhY2VtZW50LmNhcmRXaWR0aCwgcFBsYWNlbWVudC5jYXJkSGVpZ2h0KTtcclxuICAgIGN0eC5kcmF3SW1hZ2UocE92ZXJsYXksIGRyYXdQb3NpdGlvblggLSBwUGxhY2VtZW50LmNhcmRXaWR0aC8yLCBkcmF3UG9zaXRpb25ZIC0gcFBsYWNlbWVudC5jYXJkSGVpZ2h0LzIsIHBQbGFjZW1lbnQuY2FyZFdpZHRoLCBwUGxhY2VtZW50LmNhcmRIZWlnaHQpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2FyZDsiLCJcInVzZSBzdHJpY3RcIjtcclxuZnVuY3Rpb24gZHJhd0xpYigpe1xyXG4gICAgXHJcbn1cclxuXHJcbnZhciBwID0gZHJhd0xpYi5wcm90b3R5cGU7XHJcblxyXG5wLmNsZWFyID0gZnVuY3Rpb24oY3R4LCB4LCB5LCB3LCBoKSB7XHJcbiAgICBjdHguY2xlYXJSZWN0KHgsIHksIHcsIGgpO1xyXG59XHJcblxyXG5wLnJlY3QgPSBmdW5jdGlvbihjdHgsIHgsIHksIHcsIGgsIGNvbCkge1xyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBjb2w7XHJcbiAgICBjdHguZmlsbFJlY3QoeCwgeSwgdywgaCk7XHJcbiAgICBjdHgucmVzdG9yZSgpO1xyXG59XHJcblxyXG5wLmxpbmUgPSBmdW5jdGlvbihjdHgsIHgxLCB5MSwgeDIsIHkyLCB0aGlja25lc3MsIGNvbG9yKSB7XHJcbiAgICBjdHguc2F2ZSgpO1xyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgY3R4Lm1vdmVUbyh4MSwgeTEpO1xyXG4gICAgY3R4LmxpbmVUbyh4MiwgeTIpO1xyXG4gICAgY3R4LmxpbmVXaWR0aCA9IHRoaWNrbmVzcztcclxuICAgIGN0eC5zdHJva2VTdHlsZSA9IGNvbG9yO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxufVxyXG5cclxucC5jaXJjbGUgPSBmdW5jdGlvbihjdHgsIHgsIHksIHJhZGl1cywgY29sb3Ipe1xyXG4gICAgY3R4LnNhdmUoKTtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5hcmMoeCx5LCByYWRpdXMsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYm9hcmRCdXR0b24oY3R4LCBwb3NpdGlvbiwgd2lkdGgsIGhlaWdodCwgaG92ZXJlZCl7XHJcbiAgICAvL2N0eC5zYXZlKCk7XHJcbiAgICBpZihob3ZlcmVkKXtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJkb2RnZXJibHVlXCI7XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImxpZ2h0Ymx1ZVwiO1xyXG4gICAgfVxyXG4gICAgLy9kcmF3IHJvdW5kZWQgY29udGFpbmVyXHJcbiAgICBjdHgucmVjdChwb3NpdGlvbi54IC0gd2lkdGgvMiwgcG9zaXRpb24ueSAtIGhlaWdodC8yLCB3aWR0aCwgaGVpZ2h0KTtcclxuICAgIGN0eC5saW5lV2lkdGggPSA1O1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibGFja1wiO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICAgIC8vY3R4LnJlc3RvcmUoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkcmF3TGliOyIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL3BvaW50LmpzJyk7XHJcbnZhciBEcmF3TGliID0gcmVxdWlyZSgnLi9kcmF3TGliLmpzJyk7XHJcbnZhciBNZW1iZXIgPSByZXF1aXJlKCcuL21lbWJlci5qcycpO1xyXG52YXIgVXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMuanMnKTtcclxudmFyIENhcmQgPSByZXF1aXJlKCcuL2NhcmQuanMnKTtcclxuXHJcbnZhciBnYW1lTW9kZTtcclxuXHJcbnZhciBtb3VzZVN0YXRlO1xyXG52YXIgcHJldmlvdXNNb3VzZVN0YXRlO1xyXG52YXIgbW91c2VUYXJnZXQ7XHJcbnZhciBwYWludGVyO1xyXG52YXIgcGxhY2VtZW50O1xyXG5cclxudmFyIG1lbWJlckxpc3Q7XHJcbnZhciBkYXRhUmVhZDtcclxuXHJcbnZhciBjYXJkT3ZlcmxheTtcclxuXHJcbi8vZ2FtZSBtb2RlIDEgc3R1ZmZcclxudmFyIGFjdGl2ZUNhcmRMaXN0O1xyXG52YXIgY2FyZFNwZWVkO1xyXG52YXIgaW50ZXJ2YWxDb3VudGVyO1xyXG52YXIgbWVtYmVySW5jcmVtZW50ZXI7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2FtZShwUGxhY2VtZW50KXtcclxuICAgIGRhdGFSZWFkID0gZmFsc2U7XHJcbiAgICBnYW1lTW9kZSA9IDE7XHJcbiAgICBjYXJkT3ZlcmxheSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgY2FyZE92ZXJsYXkuc3JjID0gXCJpbWFnZXMvb3ZlcmxheS5wbmdcIjtcclxuICAgIFxyXG4gICAgcGFpbnRlciA9IG5ldyBEcmF3TGliKCk7XHJcbiAgICBwbGFjZW1lbnQgPSBwUGxhY2VtZW50O1xyXG4gICAgXHJcbiAgICBtZW1iZXJMaXN0ID0gW107XHJcbiAgICBwYXJzZURhdGEoXCIuLi8uLi9kYXRhL3Jvc3Rlci5jc3ZcIik7XHJcbiAgICBcclxuICAgIC8vZ2FtZSBtb2RlIDEgc3R1ZmZcclxuICAgIGFjdGl2ZUNhcmRMaXN0ID0gW107XHJcbiAgICBjYXJkU3BlZWQgPSAuMDE7XHJcbiAgICBpbnRlcnZhbENvdW50ZXIgPSAwO1xyXG4gICAgbWVtYmVySW5jcmVtZW50ZXIgPSAwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwYXJzZURhdGEocFVybCl7XHJcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICB2YXIgbGluZUxpc3QgPSByZXNwb25zZS5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICBcclxuICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgbGluZUxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICB2YXIgbGluZVNwbGl0ID0gbGluZUxpc3RbaV0uc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICBtZW1iZXJMaXN0LnB1c2gobmV3IE1lbWJlcihpLCBsaW5lU3BsaXRbMF0sIGxpbmVTcGxpdFsxXSwgbGluZVNwbGl0WzJdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRhdGFSZWFkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHhoci5vcGVuKCdHRVQnLCBwVXJsLCB0cnVlKTtcclxuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiSWYtTW9kaWZpZWQtU2luY2VcIiwgXCJTYXQsIDEgSmFuIDIwMTAgMDA6MDA6MDAgR01UXCIpO1xyXG4gICAgeGhyLnNlbmQoKTtcclxufVxyXG5cclxudmFyIHAgPSBnYW1lLnByb3RvdHlwZTtcclxuXHJcbnAudXBkYXRlID0gZnVuY3Rpb24oY3R4LCBjYW52YXMsIGR0LCBjZW50ZXIsIHBNb3VzZVN0YXRlLCBwUGxhY2VtZW50T2JqZWN0KXtcclxuICAgIHBsYWNlbWVudCA9IHBQbGFjZW1lbnRPYmplY3Q7XHJcbiAgICBwcmV2aW91c01vdXNlU3RhdGUgPSBtb3VzZVN0YXRlO1xyXG4gICAgbW91c2VTdGF0ZSA9IHBNb3VzZVN0YXRlO1xyXG4gICAgbW91c2VUYXJnZXQgPSAwO1xyXG4gICAgaWYodHlwZW9mIHByZXZpb3VzTW91c2VTdGF0ZSA9PT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgIHByZXZpb3VzTW91c2VTdGF0ZSA9IG1vdXNlU3RhdGU7XHJcbiAgICB9XHJcbiAgICBpZihkYXRhUmVhZCl7XHJcbiAgICAgICAgLy91cGRhdGUgc3R1ZmZcclxuICAgICAgICBwLmFjdChkdCk7XHJcbiAgICAgICAgLy9kcmF3IHN0dWZmXHJcbiAgICAgICAgcC5kcmF3KGN0eCwgY2FudmFzLCBjZW50ZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG5wLmFjdCA9IGZ1bmN0aW9uKGR0KXtcclxuICAgIGlmKGdhbWVNb2RlID09IDApe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgZWxzZSBpZihnYW1lTW9kZSA9PSAxKXtcclxuICAgICAgICBpZihpbnRlcnZhbENvdW50ZXIgPT0gMCl7XHJcbiAgICAgICAgICAgIGFjdGl2ZUNhcmRMaXN0LnB1c2gobmV3IENhcmQobWVtYmVyTGlzdFttZW1iZXJJbmNyZW1lbnRlcl0pKTtcclxuICAgICAgICAgICAgbWVtYmVySW5jcmVtZW50ZXIrKztcclxuICAgICAgICAgICAgaWYobWVtYmVySW5jcmVtZW50ZXIgPiBtZW1iZXJMaXN0Lmxlbmd0aCAtIDEpe1xyXG4gICAgICAgICAgICAgICAgbWVtYmVySW5jcmVtZW50ZXIgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBhY3RpdmVDYXJkTGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vYWRkIHRvIGVhY2ggY2FyZCdzIHByb2dyZXNzXHJcbiAgICAgICAgICAgIGFjdGl2ZUNhcmRMaXN0W2ldLnByb2dyZXNzICs9IGNhcmRTcGVlZCAqIGR0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZihhY3RpdmVDYXJkTGlzdFswXS5wcm9ncmVzcyA+IDEwMCl7XHJcbiAgICAgICAgICAgIGFjdGl2ZUNhcmRMaXN0LnNwbGljZSgwLDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvL2ludGVydmFsIG1hbmFnZW1lbnRcclxuICAgICAgICBpbnRlcnZhbENvdW50ZXIgKz0gY2FyZFNwZWVkICogZHQ7XHJcbiAgICAgICAgaWYoaW50ZXJ2YWxDb3VudGVyID4gKDUwIC8gcGxhY2VtZW50LmRpdmlzaW9ucykpe1xyXG4gICAgICAgICAgICBpbnRlcnZhbENvdW50ZXIgPSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxucC5kcmF3ID0gZnVuY3Rpb24oY3R4LCBjYW52YXMsIGNlbnRlcil7XHJcbiAgICAvL2RyYXcgYm9hcmRcclxuICAgIGN0eC5zYXZlKCk7XHJcbiAgICBwYWludGVyLmNsZWFyKGN0eCwgMCwgMCwgY2FudmFzLm9mZnNldFdpZHRoLCBjYW52YXMub2Zmc2V0SGVpZ2h0KTtcclxuICAgIHBhaW50ZXIucmVjdChjdHgsIDAsIDAsIGNhbnZhcy5vZmZzZXRXaWR0aCwgY2FudmFzLm9mZnNldEhlaWdodCwgXCJ3aGl0ZVwiKTtcclxuICAgIHBhaW50ZXIubGluZShjdHgsIGNhbnZhcy5vZmZzZXRXaWR0aC8yLCBjZW50ZXIueSAtIGNhbnZhcy5vZmZzZXRIZWlnaHQvMiwgY2FudmFzLm9mZnNldFdpZHRoLzIsIGNhbnZhcy5vZmZzZXRIZWlnaHQsIDIsIFwibGlnaHRncmF5XCIpO1xyXG4gICAgcGFpbnRlci5saW5lKGN0eCwgMCwgY2VudGVyLnksIGNhbnZhcy5vZmZzZXRXaWR0aCwgY2VudGVyLnksIDIsIFwibGlnaHRHcmF5XCIpO1xyXG4gICAgXHJcbiAgICBwYWludGVyLmxpbmUoY3R4LCBwbGFjZW1lbnQuc3RhcnRQb2ludC54LCBwbGFjZW1lbnQuc3RhcnRQb2ludC55LCBwbGFjZW1lbnQuZW5kUG9pbnQueCwgcGxhY2VtZW50LmVuZFBvaW50LnksIDIsIFwiYmx1ZVwiKTtcclxuICAgIFxyXG4gICAgaWYoZ2FtZU1vZGUgPT0gMCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKGdhbWVNb2RlID09IDEpe1xyXG4gICAgICAgIGZvcih2YXIgaSA9IGFjdGl2ZUNhcmRMaXN0Lmxlbmd0aCAtIDE7IGkgPiAtMTsgaS0tKXtcclxuICAgICAgICAgICAgLy9kcmF3IGVhY2ggY2FyZFxyXG4gICAgICAgICAgICBhY3RpdmVDYXJkTGlzdFtpXS5kcmF3KGN0eCwgcGxhY2VtZW50LCBjYXJkT3ZlcmxheSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3R4LnJlc3RvcmUoKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnYW1lO1xyXG5cclxuLy9wRWxlbWVudCBpcyB0aGUgb2JqZWN0IG9uIHRoZSBjYW52YXMgdGhhdCBpcyBiZWluZyBjaGVja2VkIGFnYWluc3QgdGhlIG1vdXNlLCBwT2Zmc2V0dGVyIHdpbGwgbW9zdCBsaWtlbHkgYmUgdGhlIGJvYXJkIHNvIHdlIGNhbiBzdWJ0cmFjdCBwb3NpdGlvbiBvciB3aGF0ZXZlciBpdCBuZWVkcyB0byByZW1haW4gYWxpZ25lZFxyXG5mdW5jdGlvbiBtb3VzZUludGVyc2VjdChwRWxlbWVudCwgcE9mZnNldHRlciwgcFNjYWxlKXtcclxuICAgIGlmKG1vdXNlU3RhdGUucmVsYXRpdmVQb3NpdGlvbi54ICsgcE9mZnNldHRlci54ID4gKHBFbGVtZW50LnBvc2l0aW9uLnggLSAocFNjYWxlKnBFbGVtZW50LndpZHRoKS8yKSAmJiBtb3VzZVN0YXRlLnJlbGF0aXZlUG9zaXRpb24ueCArIHBPZmZzZXR0ZXIueCA8IChwRWxlbWVudC5wb3NpdGlvbi54ICsgKHBTY2FsZSpwRWxlbWVudC53aWR0aCkvMikpe1xyXG4gICAgICAgIGlmKG1vdXNlU3RhdGUucmVsYXRpdmVQb3NpdGlvbi55ICsgcE9mZnNldHRlci55ID4gKHBFbGVtZW50LnBvc2l0aW9uLnkgLSAocFNjYWxlKnBFbGVtZW50LmhlaWdodCkvMikgJiYgbW91c2VTdGF0ZS5yZWxhdGl2ZVBvc2l0aW9uLnkgKyBwT2Zmc2V0dGVyLnkgPCAocEVsZW1lbnQucG9zaXRpb24ueSArIChwU2NhbGUqcEVsZW1lbnQuaGVpZ2h0KS8yKSl7XHJcbiAgICAgICAgICAgIHBFbGVtZW50Lm1vdXNlT3ZlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHBFbGVtZW50Lm1vdXNlT3ZlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgcEVsZW1lbnQubW91c2VPdmVyID0gZmFsc2U7XHJcbiAgICB9XHJcbn0iLCJcInVzZSBzdHJpY3RcIjtcclxuZnVuY3Rpb24gbWVtYmVyKHBOdW1iZXIsIHBGaXJzdCwgcExhc3QsIHBJbWFnZSl7XHJcbiAgICB0aGlzLm51bWJlciA9IHBOdW1iZXI7XHJcbiAgICB0aGlzLm5hbWUgPSBwRmlyc3QgKyBcIiBcIiArIHBMYXN0O1xyXG4gICAgdGhpcy5pbWFnZSA9IHBJbWFnZTtcclxufVxyXG5cclxudmFyIHAgPSBtZW1iZXIucHJvdG90eXBlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtZW1iZXI7IiwiLy9rZWVwcyB0cmFjayBvZiBtb3VzZSByZWxhdGVkIHZhcmlhYmxlcy5cclxuLy9jYWxjdWxhdGVkIGluIG1haW4gYW5kIHBhc3NlZCB0byBnYW1lXHJcbi8vY29udGFpbnMgdXAgc3RhdGVcclxuLy9wb3NpdGlvblxyXG4vL3JlbGF0aXZlIHBvc2l0aW9uXHJcbi8vb24gY2FudmFzXHJcblwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBtb3VzZVN0YXRlKHBQb3NpdGlvbiwgcFJlbGF0aXZlUG9zaXRpb24sIHBNb3VzZWRvd24sIHBNb3VzZUluKXtcclxuICAgIHRoaXMucG9zaXRpb24gPSBwUG9zaXRpb247XHJcbiAgICB0aGlzLnJlbGF0aXZlUG9zaXRpb24gPSBwUmVsYXRpdmVQb3NpdGlvbjtcclxuICAgIHRoaXMubW91c2VEb3duID0gcE1vdXNlZG93bjtcclxuICAgIHRoaXMubW91c2VJbiA9IHBNb3VzZUluO1xyXG59XHJcblxyXG52YXIgcCA9IG1vdXNlU3RhdGUucHJvdG90eXBlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtb3VzZVN0YXRlOyIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgUG9pbnQgPSByZXF1aXJlKCcuL3BvaW50LmpzJyk7XHJcblxyXG5mdW5jdGlvbiBwbGFjZW1lbnRPYmplY3QocENhbnZhc1dpZHRoLCBwQ2FudmFzSGVpZ2h0LCBwRGl2aXNpb25zKXtcclxuICAgIHRoaXMuZGl2aXNpb25zID0gcERpdmlzaW9ucztcclxuICAgIHRoaXMuY2FyZFdpZHRoID0gcENhbnZhc1dpZHRoIC8gdGhpcy5kaXZpc2lvbnM7XHJcbiAgICB0aGlzLmNhcmRIZWlnaHQgPSB0aGlzLmNhcmRXaWR0aCAqIC42MTQ1ODM7Ly93aGF0ZXZlciB0aGUgcmF0aW8gaXNcclxuICAgIFxyXG4gICAgdGhpcy5zdGFydFBvaW50ID0gbmV3IFBvaW50KC10aGlzLmNhcmRXaWR0aCwgKHBDYW52YXNIZWlnaHQgLyAyKSAtIHRoaXMuY2FyZEhlaWdodCk7XHJcbiAgICB0aGlzLmVuZFBvaW50ID0gbmV3IFBvaW50KHBDYW52YXNXaWR0aCArIHRoaXMuY2FyZFdpZHRoLCBwQ2FudmFzSGVpZ2h0ICsgdGhpcy5jYXJkSGVpZ2h0KTtcclxufVxyXG5cclxudmFyIHAgPSBwbGFjZW1lbnRPYmplY3QucHJvdG90eXBlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwbGFjZW1lbnRPYmplY3Q7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbmZ1bmN0aW9uIHBvaW50KHBYLCBwWSl7XHJcbiAgICB0aGlzLnggPSBwWDtcclxuICAgIHRoaXMueSA9IHBZO1xyXG59XHJcblxyXG52YXIgcCA9IHBvaW50LnByb3RvdHlwZTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcG9pbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBQb2ludCA9IHJlcXVpcmUoJy4vcG9pbnQuanMnKTtcclxuXHJcbmZ1bmN0aW9uIHV0aWxpdGllcygpe1xyXG59XHJcblxyXG52YXIgcCA9IHV0aWxpdGllcy5wcm90b3R5cGU7XHJcbi8vIHJldHVybnMgbW91c2UgcG9zaXRpb24gaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW0gb2YgZWxlbWVudFxyXG5wLmdldE1vdXNlID0gZnVuY3Rpb24oZSl7XHJcbiAgICAvL3JldHVybiBuZXcgYXBwLlBvaW50KChlLnBhZ2VYIC0gZS50YXJnZXQub2Zmc2V0TGVmdCkgKiAoYXBwLm1haW4ucmVuZGVyV2lkdGggLyBhY3R1YWxDYW52YXNXaWR0aCksIChlLnBhZ2VZIC0gZS50YXJnZXQub2Zmc2V0VG9wKSAqIChhcHAubWFpbi5yZW5kZXJIZWlnaHQgLyBhY3R1YWxDYW52YXNIZWlnaHQpKTtcclxuICAgIHJldHVybiBuZXcgUG9pbnQoKGUucGFnZVggLSBlLnRhcmdldC5vZmZzZXRMZWZ0KSwgKGUucGFnZVkgLSBlLnRhcmdldC5vZmZzZXRUb3ApKTtcclxufVxyXG5cclxucC5tYXAgPSBmdW5jdGlvbih2YWx1ZSwgbWluMSwgbWF4MSwgbWluMiwgbWF4Mil7XHJcbiAgICByZXR1cm4gbWluMiArIChtYXgyIC0gbWluMikgKiAoKHZhbHVlIC0gbWluMSkgLyAobWF4MSAtIG1pbjEpKTtcclxufVxyXG5cclxucC5jbGFtcCA9IGZ1bmN0aW9uKHZhbHVlLCBtaW4sIG1heCl7XHJcbiAgICAvL3JldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKG1heCwgdmFsdWUpKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1dGlsaXRpZXM7Il19
