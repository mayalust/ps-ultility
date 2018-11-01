const ultility = require("./ps-ultility.js");
let a = {
  a : 10,
  b : [ 2,  3],
  c : "abd",
  d : [{
    a : "2",
    b : [ 5, 6],
    c : function(a){
      console.log(a);
    }
  }],
  e : {
    a : 1,
    b : [ 2, {
      a : 5
    }]
  }
};
console.log(ultility.attribute(a, "['b'][1]"));