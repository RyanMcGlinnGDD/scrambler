"use strict";
function member(pNumber, pFirst, pLast, pImage){
    this.number = pNumber;
    this.name = pFirst + " " + pLast;
    this.image = pImage;
}

var p = member.prototype;

module.exports = member;