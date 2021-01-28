"use strict";

require("@babel/polyfill");

// 这就是@babel/polyfill的用法
var arrow = function arrow() {
  console.log('arrow');
};

var arr = [1, 2, 3];
arr.includes(3);
