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
  function remove$$hashKey(str){
    let regex = /\"\${2}hashKey\"\s*:\"[^"]*\",?/g;
    while(regex.test(str)){
      str = str.replace(regex, "");
    };
    console.log(str);
    return str;
  };
  var dh = (function(){
    /**
     * Date Handler Created by leonlin.
     * e.g.
     * 1) create a Date Object on Today
     * var dh = datehandler();
     * 2) create a Date on certain Date
     * var dh = datehandler('2017/12/31,10:20')
     * 3) Add several years on original Date Object
     * dh.addYear(1); dh.addYear(-2);
     * 3) Add several years on clone Date Object
     * var clone = dh.addYear(1, true)
     * 4)output date string
     * var str = dh.getDateString();
     * var str = dh.getDateString('yy/MM/dd,hh');
     * 5)output utc date string
     * var utcstr = dh.getUTCDateString();
     * var utcstr = dh.getUTCDateString('yy/MM/dd,hh');
     */
    function DateHandler(dateStr){
      return new DateHandler.fn.init(dateStr);
    };
    var VERSION = "DateHandler v1.0.0",
      SECONDTIMESTAMP = 1000,
      MINUTETIMESTAMP = 60 * SECONDTIMESTAMP,
      HOURTIMESTAMP = 60 * MINUTETIMESTAMP,
      DAYTIMESTAMP = 24 * HOURTIMESTAMP,
      OFFSET = "0800",
      events = {};
    function extend(self, target){
      var cur = self;
      for(var i in target){
        cur[i] = target[i];
      }
    };
    function to2Char(num){
      if(num < 10){
        return "0" + num
      } else {
        return num;
      }
    };
    function to3Char(num){
      if(num < 10){
        return "00" + num
      } else if(num < 100){
        return "0" + num
      } else {
        return num;
      }
    };
    function dateObject(date){
      function dObject(d){
        var cur = this;
        extend(cur, {
          year : d.getFullYear(),
          month : d.getMonth() + 1,
          dat : d.getDate(),
          hour : d.getHours(),
          minute : d.getMinutes(),
          second : d.getSeconds(),
          milisecond : d.getMilliseconds(),
          utcyear : d.getUTCFullYear(),
          utcmonth : d.getUTCMonth(),
          utcdat : d.getUTCDate(),
          utchour : d.getUTCHours(),
          utcminute : d.getUTCMinutes(),
          utcsecond : d.getUTCSeconds(),
          utcmilisecond : d.getUTCMilliseconds()
        })
      };
      dObject.prototype.toString = function(){
        var cur = this, str;
        str = cur.year + "-";
        str += to2Char(cur.month) + "-";
        str += to2Char(cur.dat) + ":";
        str += to2Char(cur.hour) + ":";
        str += to2Char(cur.minute) + ":";
        str += to2Char(cur.second) + ".";
        str += to2Char(cur.utcmilisecond) + "+" + OFFSET;
        return str;
      };
      dObject.prototype.toUTCString = function(){
        var cur = this, str;
        str = cur.utcyear + "-";
        str += to2Char(cur.utcmonth) + "-";
        str += to2Char(cur.utcdat) + ":";
        str += to2Char(cur.utchour) + ":";
        str += to2Char(cur.utcminute) + ":";
        str += to2Char(cur.utcsecond) + ".";
        str += to2Char(cur.utcmilisecond) + "+" + OFFSET;
        return str;
      };
      return new dObject(date);
    }
    DateHandler.fn = DateHandler.prototype;
    DateHandler.fn.init = function(dateStr){
      var cur = this;
      if(dateStr){
        if(typeof dateStr == "object"){
          cur.setDate(dateStr);
        } else {
          cur.setDate(new Date(dateStr));
        }
      } else {
        cur.setDate(new Date());
      };
      cur.on("dateChange", function(d){
        cur.setDate(d);
      });
    };
    DateHandler.fn.init.prototype = DateHandler.fn
    extend(DateHandler.fn.init.prototype, {
      version : VERSION,
      on : function(eventName, callback){
        events[eventName] = events[eventName] || [];
        events[eventName].push(callback);
      },
      clone : function(){
        var cur = this;
        return new DateHandler.fn.init(cur.getTimeStamp());
      },
      setDate : function(d){
        var cur = this;
        cur.date = d;
        cur.dateObject = dateObject(d);
        cur.dateString = cur.dateObject.toString();
        cur.utcDateString = cur.dateObject.toUTCString();
      },
      update : function(){
        var cur = this;
        var str = cur.dateObject.toString();
        cur.setDate(new Date(str));
      },
      addYear : function(num, clone){
        var target = clone == true ? this.clone() : this;
        target.dateObject.year += parseInt(num);
        target.update();
        return target;
      },
      addMonth : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var madd = target.dateObject.month + parseInt(num);
        var yadd = 0;
        while(madd < 1){
          madd += 12;
          yadd--;
        }
        while(madd > 12){
          madd -= 12;
          yadd++;
        }
        target.dateObject.year += yadd;
        target.dateObject.month = madd;
        target.update();
        return target;
      },
      addDay : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var dateMinSecond = DAYTIMESTAMP * num;
        target.addTimeStamp(dateMinSecond);
        return target;
      },
      addHour : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var dateMinSecond = HOURTIMESTAMP * num;
        target.addTimeStamp(dateMinSecond);
        return target;
      },
      addMinute : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var dateMinSecond = MINUTETIMESTAMP * num;
        target.addTimeStamp(dateMinSecond);
        return target;
      },
      addSecond : function(num, clone){
        var target = clone == true ? this.clone() : this;
        var dateMinSecond = SECONDTIMESTAMP * num;
        target.addTimeStamp(dateMinSecond);
        return target;
      },
      addTimeStamp : function(timestamp, clone){
        var target = clone == true ? this.clone() : this;
        var minSecond = target.date.getTime() + timestamp;
        target.setDate(new Date(minSecond));
        return target;
      },
      trimmToYear : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year + "-01-01,00:00:00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToMonth : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year + "-" + to2Char(target.dateObject.month) + "-01,00:00:00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToWeek : function(clone){
        var target = clone == true ? this.clone() : this;
        var d = target.date.getDay() || 7;
        return target.addDay(1 - d).trimmToDate();
      },
      trimmToDate : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year;
        dt += "-" + to2Char(target.dateObject.month);
        dt += "-" + to2Char(target.dateObject.dat) + ",00:00:00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToHour : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year;
        dt += "-" + to2Char(target.dateObject.month);
        dt += "-" + to2Char(target.dateObject.dat);
        dt += "," + to2Char(target.dateObject.hour) + ":00:00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToMinute : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year;
        dt += "-" + to2Char(target.dateObject.month);
        dt += "-" + to2Char(target.dateObject.dat);
        dt += "," + to2Char(target.dateObject.hour);
        dt += ":" + to2Char(target.dateObject.minute) + ":00.000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      trimmToSecond : function(clone){
        var target = clone == true ? this.clone() : this;
        var dt = target.dateObject.year;
        dt += "-" + to2Char(target.dateObject.month);
        dt += "-" + to2Char(target.dateObject.dat);
        dt += "," + to2Char(target.dateObject.hour);
        dt += ":" + to2Char(target.dateObject.minute);
        dt += ":" + to2Char(target.dateObject.second) + ".000+" + OFFSET;
        target.setDate(new Date(dt));
        return target;
      },
      getDate : function(){
        return this.date;
      },
      getTimeStamp : function(){
        return this.date.getTime();
      },
      getYear : function(){
        return this.dateObject.year;
      },
      getMonth : function(){
        return this.dateObject.month;
      },
      getDateString : function(str){
        var year = this.dateObject.year;
        var month = this.dateObject.month;
        var dat = this.dateObject.dat;
        var hour = this.dateObject.hour;
        var minute = this.dateObject.minute;
        var second = this.dateObject.second;
        var milisecond = this.dateObject.milisecond;
        if(str){
          str = str.replace(/y+/g, year);
          str = str.replace(/M+/g, to2Char(month));
          str = str.replace(/d+/g, to2Char(dat));
          str = str.replace(/h+/g, to2Char(hour));
          str = str.replace(/m+/g, to2Char(minute));
          str = str.replace(/s+/g, to2Char(second));
          return str.replace(/n+/g, to3Char(milisecond));
        } else {
          return year + "-" + to2Char(month) + "-" + to2Char(dat) + "," + to2Char(hour) + ":" + to2Char(minute) + ":" + to2Char(second) + "." + to3Char(milisecond) + "+" + OFFSET;
        }
      },
      getUTCDateString : function(str){
        var utcyear = this.dateObject.utcyear;
        var utcmonth = this.dateObject.utcmonth;
        var utcdat = this.dateObject.utcdat;
        var utchour = this.dateObject.utchour;
        var utcminute = this.dateObject.utcminute;
        var utcsecond = this.dateObject.utcsecond;
        var utcmilisecond = this.dateObject.utcmilisecond;
        if(str){
          str = str.replace(/y+/g, utcyear);
          str = str.replace(/M+/g, to2Char(utcmonth));
          str = str.replace(/d+/g, to2Char(utcdat));
          str = str.replace(/h+/g, to2Char(utchour));
          str = str.replace(/m+/g, to2Char(utcminute));
          str = str.replace(/s+/g, to2Char(utcsecond));
          return str.replace(/n+/g, to3Char(utcsecond));
        } else {
          return utcyear + "-" + to2Char(utcmonth) + "-" + to2Char(utcdat) + "T" + to2Char(utchour) + ":" + to2Char(utcminute) + ":" + to2Char(utcsecond) + "." + to3Char(utcmilisecond) +"Z";
        }
      }
    })
    return DateHandler;
  })()
  return {
    urlparser : urlparser,
    dateparser : dh,
    remove$$hashKey : remove$$hashKey
  }
});