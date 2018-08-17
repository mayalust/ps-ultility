(function(global, factory){
  if(typeof window === "undefined"){
    if(typeof module !== "undefined" && typeof module.exports === "function"){
      module.exports = factory();
    }
  } else {
    if(typeof define === "function"){
      define(factory);
    } else {
      window.psUltility = factory();
    }
  }
})(this, function(){
  function urlparser(input){
    var hostchar = "(?:[\\w\\d$!])+",
      querychar = "(?:[^;\\\/?:@&=+,$#]+)",
      protocol = "^(?:([\\w]+)\\:\/\/)?",
      pathchar = "(?:[^\/?;=]+)",
      host = "(" + hostchar + "(?:\\." + hostchar + ")*)",
      port = "(?:\\:([\\d]+))?",
      path = "(?:((?:\/" + pathchar + ")+))",
      query = "(?:\\?((?:" + querychar + "=" + querychar + ")(?:\\&{1,2}" + querychar + "=" + querychar + ")*))?",
      hash = "(#.*)?$",
      queryExp = "^(?:\\&{1,2})?(" + querychar + ")=(" + querychar + ")",
      pathExp = "^(?:\\\/?(" + pathchar + "))",
      url = protocol + host + port + path + query + hash,
      urlExp = new RegExp(protocol + host + port + path + query + hash, "g"),
      match = urlExp.exec(input),
      pathData = getPathData(match[4]),
      queryData = getQueryData(match[5]);
    function getQueryData(str){
      if(!str){
        return null;
      }
      var soFar = str, match, obj = {};
      while( match = new RegExp(queryExp).exec(soFar)){
        obj[match[1]] = match[2];
        soFar = soFar.slice(match[0].length)
      }
      return obj
    }
    function getPathData(str){
      if(!str){
        return null;
      }
      var soFar = str, match, obj = [];
      while( match = new RegExp(pathExp).exec(soFar)){
        obj.push(match[1]);
        soFar = soFar.slice(match[0].length)
      }
      return obj
    }
    return {
      url : match[0],
      protocol : match[1] ? match[1] : "http",
      address : match[2],
      port : match[3] ? match[3] - 0 : 80,
      path : match[4] ? match[4] : "/",
      patharr : pathData,
      query : queryData,
      hash : match[6]
    };
  };
  return {
    urlparser : urlparser
  }
});