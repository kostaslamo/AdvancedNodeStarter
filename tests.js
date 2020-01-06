
/* Function inheritance 
* Please check: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
*/
function Numbers() {
    
}

Numbers.prototype.multiply = function (a, b) {
    return a * b
}
Numbers.prototype.addition = function (a, b) {
    return a + b
}
const n = new Numbers();

console.log(n.addition(2, 3))

