"use strict";
require("babel-polyfill");
let iterable = [10, 20, 30];
console.log('a');
for (let value of iterable) {
    console.log(value);
}
console.log('b');
