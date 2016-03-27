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