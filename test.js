const { tree } = require("./ps-ultility.js");
var t = [{
  name : "abc",
  value : 10,
  children : [{
    name : "efg",
    children : [{
      value : 10,
      name : "ddd"
    }]
  },{
    name : "ppp"
  }]
}]
tree().forEach(t, function(node, i, parents, list){
  //console.log(node, i, parents, list);
})
var fd = tree().find(t, function(node){
  return node.name === "efg";
});
var ft = tree().every(t, function(node){
  return node.value === 10;
});
console.log(ft);