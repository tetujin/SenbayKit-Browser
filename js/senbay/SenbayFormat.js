//  Created by Yuuki Nishiyama on 2017/07/17.
//  Copyright (c) 2017 Yuuki NISHIYAMA. All rights reserved.
//
// [List of Format Version]
// Format Version 0 (normal data     ) => "1234,0.1,0.03378785976,0.001,-1,-0.1,-0.01,-0.001,'CLEAR'" => normal versiono
// Format Version 1 (normal data     ) => "TIME:1234,ACCX:0.1,ACCY:0.03378785976,ACCZ:0.001,YAW:-1,ROLL:-0.1,PITC:-0.01,BRIG:-0.001,WEATHER:'CLEAR'"
// Format Version 2 (compression data) => "TIME:1234,ACCX:0.1,ACCY:0.03378785976,ACCZ:0.001,YAW:-1,ROLL:-0.1,PITC:-0.01,BRIG:-0.001,WEATHER:'CLEAR'"
// Format Version 3 (normal data     ) => "V:3,TIME:1234,ACCX:0.1,ACCY:0.03378785976,ACCZ:0.001,YAW:-1,ROLL:-0.1,PITC:-0.01,BRIG:-0.001,WEATHER:'CLEAR'"
// Format Version 4 (compression data) => "V:4,TIME:1234,ACCX:0.1,ACCY:0.03378785976,ACCZ:0.001,YAW:-1,ROLL:-0.1,PITC:-0.01,BRIG:-0.001,WEATHER:'CLEAR'"
class SenbayFormat{
  constructor(baseNumber){
    this.reservedKeys = {
      "TIME" : "0", "0" : "TIME",
      "LONG" : "1", "1" : "LONG",
      "LATI" : "2", "2" : "LATI",
      "ALTI" : "3", "3" : "ALTI",
      "ACCX" : "4", "4" : "ACCX",
      "ACCY" : "5", "5" : "ACCY",
      "ACCZ" : "6", "6" : "ACCZ",
      "YAW"  : "7", "7" : "YAW",
      "ROLL" : "8", "8" : "ROLL",
      "PITC" : "9", "9" : "PITC",
      "HEAD" : "A", "A" : "HEAD",
      "SPEE" : "B", "B" : "SPEE",
      "BRIG" : "C", "C" : "BRIG",
      "AIRP" : "D", "D" : "AIRP",
      "HTBT" : "E", "E" : "HTBT",
      "V"  : "V"
    };
    this.baseX = new BaseX(baseNumber);
  }

  getSenbayData(dataLine){
    // get a version information from text
    // console.log(dataLine);
    var version = this.getVersion(dataLine);
    // console.log(version);
    var obj;
    //// Normal SenbayFormat
    if (version == "1") {
      obj = this.convertSenbayFormatToDictionary(dataLine,false);
    }else if (version == "2"){
      obj = this.convertSenbayFormatToDictionary(dataLine,true);
    }else if(version == "3"){
      obj = this.convertSenbayFormatToDictionary(dataLine,false);
    //// Compressed SenbayFormat
    }else if(version == "4"){ // compressed data
      obj = this.convertSenbayFormatToDictionary(dataLine,true);
    //// Unsupported SenbayFormat
    }else{
      console.log("This format is not supported on SenbayFormat for JavaScript.");
    }
    // console.log(obj);
    // var senbayData = new SenbayData(obj);
    return obj;// senbayData;
  }

  /**
  * This method converts a SenbayFormat string object to a dictonary object if the SenbayFormat is correct.
  */
  convertSenbayFormatToDictionary(dataLine,compression){
    var senbayData = {};
    var splittedDL = dataLine.split(",");
    if(splittedDL.length > 0){
      for (var variable in splittedDL) {
        if (splittedDL.hasOwnProperty(variable)) {
          var key, value;
          var keyValueEle = splittedDL[variable].split(":");
          // a value is splitted by ":"
          if(keyValueEle.length>1){
            key   = keyValueEle[0];
            value = keyValueEle[1];
          //////////////////////////////////////////////////////////////
          // a value is unsplitted by ":" => The key might be reserved
          //////////////////////////////////////////////////////////////
          }else{
            var data = splittedDL[variable];
            key   = data.substring(0,1);
            value = data.substring(1,data.length);
            if (key in this.reservedKeys == true) {
              key = this.reservedKeys[key];
            }
          }
          // Check reserved keys
          // The value is string
          if (value.indexOf("'") == 0 && value.charAt(value.length-1) == "'") {
            senbayData[key] = value.substring(1,value.length-1);
          // The value is number
          }else{
            if(!compression){
              senbayData[key] = Number(value);
            }else{
              // deocde 121 base number
              // senbayData[key] = Number(value);
              senbayData[key] = this.baseX.decodeDouble(value);
            }
          }
        }
      }
    }
    return senbayData;
  }

  /**
  * This method provides version number from SenbayFormat if the format is correct.
  */
  getVersion(str){
    // get version information
    var clippedChar = str.substring(0,1);
    if(clippedChar == "0"){
      return "2";
    }else if(clippedChar == "T"){
      return "1";
    }

    var index = str.indexOf(",");
    if( index > 0 ){
      var clippedLine = str.substring(0,index);
      var versionList = clippedLine.split(":");
      if(versionList.length > 0){
        return versionList[1]; // The version information is existed
      }
    }
    return -1; // there is no version information
  }
}
