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