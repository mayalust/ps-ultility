const ul = require("./ps-ultility.js")
const list = [{
  path : "/0/",
  label : "a"
},{
  path : "/0/1/",
  label : "b"
}];
var c = ul.list2Tree(list, function(a, b){
  let id = /(\d+)\/$/g.exec(b.path);
  let pid = /(\d+)\/(?:\d+)\/$/g.exec(a.path);
  id = id ? id[1] : null;
  pid = pid ? pid[2] : null;
  return id == pid;
});
console.log(c);