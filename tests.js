
/* Function inheritance 
* Please check: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
*/

function Numbers() {
    
}

Numbers.prototype.multiply = (a, b) => {
    return a * b
}
Numbers.prototype.addition = (a, b) => {
    return a + b
}
const n = new Numbers();

console.log(n.addition(2, 3))

