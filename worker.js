"use strict";

let imgWidth = null;
let imgHeight = null;

let imgData = null;
let originalPixel = null;
let currentPixel = null;

function getIndex(x, y){
  return (x + y * imgWidth) * 4
}

function clamp(value) {
  return Math.max(0, Math.min(Math.floor(value), 255))
}

const R_OFFSET = 0
const G_OFFSET = 1
const B_OFFSET = 2

function addRed(x, y, value) {
  const index = getIndex(x, y) + R_OFFSET;
  const currentValue = currentPixel[index];
  currentPixel[index] = clamp(currentValue + value);
}

function commitChanges() {
  for (let i = 0; i < imgData.data.length; i++) {
    imgData.data[i] = currentPixel[i]
  }

  postMessage(imgData);
}

function processImg(value) {
  currentPixel = originalPixel.slice();

  for(let i = 0; i < imgHeight; i++){
    for(let j = 0; j < imgWidth; j++){
        addRed(j, i, value);
    }
  }

  commitChanges();
}

onmessage = function(event) {
  if(event.data[0] === "calculate"){
    imgWidth = event.data[1][0];
    imgHeight = event.data[1][1];
    imgData = event.data[2];
    originalPixel = event.data[3];
    const range = event.data[4];
    processImg(range);
  }
}
// reference: https://hackernoon.com/understanding-basic-image-processing-algorithms-a-hands-on-javascript-tutorial-8r3u32qk