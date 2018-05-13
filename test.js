
const PATH = require('path');
var util = require("./lib/util.js")
function test(opt){
    console.log(opt)
}
test(PATH.join(__dirname, "filterStr1.txt"))

test([].length)
