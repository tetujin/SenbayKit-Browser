
class BaseX{
  constructor(baseNumber){
    this.baseNumber = baseNumber;
    this.asciiTable = [
      1,  2,  3,  4,  5,  6,  7,  8,  9,
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
      30, 31, 32, 33, 34, 35, 36, 37, 38,
      40, 41, 42, 43,         47, 48, 49,
      50, 51, 52, 53, 54, 55, 56, 57,     59,
      60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
      70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
      80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
      90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
      100, 101, 102, 103, 104, 105, 106, 107, 108, 109,
      110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
      120, 121, 122, 123, 124, 125, 126, 127];

    this.asciiRTable = [
      0, 0, 1, 2, 3, 4, 5, 6, 7, 8,
      9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
      29, 30, 31, 32, 33, 34, 35, 36, 37,  0,
      38, 39, 40, 41,  0,  0,  0, 42, 43, 44,
      45, 46, 47, 48, 49, 50, 51, 52,  0,  53,
      54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
      64, 65, 66, 67, 68, 69, 70, 71, 72, 73,
      74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
      84, 85, 86, 87, 88, 89, 90, 91, 92, 93,
      94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
      104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
      114, 115, 116, 117, 118, 119, 120, 121];

    if(baseNumber > this.asciiTable.length ||
      baseNumber < 2){
        console.log("The base number must be 2-"+this.asciiTable.length+"!");
      }
    }

  /**
  * This method encode to each base number.
  * @param  Long target value
  * @return String encoded string
  */
  encodeLong(value){
    var isNegative = (value < 0);
    if(isNegative){
      value *= -1;
    }
    var shinsu = this.baseNumber
    //Convert normal value to x-number value
    var ketas = [];
    if(value == 0){
      ketas.push(0);
    }else{
      while (value > 0) {
        var amari = parseInt(value%shinsu);
        ketas.push(this.asciiTable[amari]);
        value = parseInt(value / shinsu);
      }
    }
    // console.log(ketas);
    /**
    * 0x31 -> 1 in the 16 hexadecimal number (ascii character)
    * 49   -> 1 in the 10 hexadecimal number (ascii character)
    */
    // console.log(ketas);
    var baseStr = "";
    for (var i = 0; i < ketas.length; i++) {
      baseStr = String.fromCharCode(ketas[i]) + baseStr;
    }

    if(isNegative){
      baseStr = "-" + baseStr;
      return baseStr;
    }else{
      return baseStr;
    }
  }

  /////////////////////////////
  encodeDouble(value){
    // In the case of minus value, this method change a minus value to a plues value.
    var isNegative = (value < 0);
    if(isNegative){
      value *= -1;
    }
    // Remove extra zeros ( at Number -> String )
    var valueStr = String(value);
    // Divide a text into "Integer Part" and "Decimal Part"
    var doubleValues = valueStr.split(".");

    //Calculate a Integer Part
    var integerStr = this.encodeLong(doubleValues[0]);
    if(doubleValues.length == 1){
      if(isNegative){
        return "-"+integerStr;
      }else{
        return integerStr;
      }
    }
    if(doubleValues[0] == 0){
      integerStr = this.encodeLong(0);
    }

    //Calculate a Decimal Part
    // decimal
    var decimalStr = this.encodeLong(Number(doubleValues[1]));

    // Exstracts zeros after dot.
    // (e.g., A value is 0.0001. "000" after dot(".") has to store to a variable.
    var zeros = "";
    var baseDecimalStr = doubleValues[1];

    for(var i=0; i<baseDecimalStr.length; i++){
      if(baseDecimalStr.substr(i,1) == "0"){
        //char ellipsis = [[TABLE objectAtIndex:0] floatValue];
        //NSString *zeroChar = [NSString stringWithFormat:@"%c",ellipsis];
        zeros = zeros + this.encodeLong(0);
      }else{
        break;
      }
    }

    // return opperation
    if(isNegative){
      return "-"+integerStr+"."+zeros+decimalStr;
    }else{
      return integerStr + "."+zeros+decimalStr;
    }
  }

  //////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////

  decodeLong(value){
    // plus/minus
    var isNegative = false;
    if(value.indexOf("-") != -1){
      isNegative = true;
    }
    var shinsu = this.baseNumber
    // Converts String to Bytes
    var byteData = this.converStringToUTF8Bytes(value);
    var theValue = 0;
    for (var i=byteData.length-1; i>=0; i--) {
      var v = Math.pow(shinsu, byteData.length-i-1) * this.asciiRTable[byteData[i]];
      theValue += v;
    }
    
    if(isNegative){
      return theValue * -1;
    }else{
      return theValue;
    }
  }

  /////////////////////////////////////////////////////
  decodeDouble(value){
    var isNegative = false;
    if(value.indexOf("-") != -1){
      isNegative = true;
    }

    var shinsu = this.baseNumber

    var valueStr = String(value);
    // Divide a text into "Integer Part" and "Decimal Part"
    var doubleValues = valueStr.split(".");

    if(doubleValues.length == 1){
      ///// Calculate a Integer Part ////////////
      var integerLong = this.decodeLong(doubleValues[0]);
      return integerLong;
    }else if(doubleValues.length > 1){
      ///// Calculate a Integer Part ////////////
      var integerLong = this.decodeLong(doubleValues[0]);
      ///// Convert zero char to number
      var decimalStr = doubleValues[1];
      var zeros = "";
      var zeroChar = this.encodeLong(0);
      for (var i = 0; i < decimalStr.length; i++) {
        if(decimalStr.substr(i,1) == zeroChar){
          zeros += "0";
        }else{
          break;
        }
      }

      ///// Calculate a Decimal Part ////////////
      // remove addition zeros after dot
      if(zeros.length > 0){
        decimalStr = decimalStr.substr(zeros.length);
      }
      var decimalLong =  this.decodeLong(decimalStr);

      if(isNegative){
        if (integerLong < 0) {
          integerLong = integerLong * -1
        }
        var result = Number("-" + integerLong + "." + zeros + decimalLong);
        return result;
      }else{
        var result = Number(integerLong + "." + zeros + decimalLong);
        return result;
      }
    }else{
      console.log("error");
      return null;
    }
  }

  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  // http://d.hatena.ne.jp/yasuhallabo/20140211/1392131668
  converStringToUTF8Bytes	(text){
    var result = [];
    if (text == null)
    return result;
    for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c <= 0x7f) {
        result.push(c);
      } else if (c <= 0x07ff) {
        result.push(((c >> 6) & 0x1F) | 0xC0);
        result.push((c & 0x3F) | 0x80);
      } else {
        result.push(((c >> 12) & 0x0F) | 0xE0);
        result.push(((c >> 6) & 0x3F) | 0x80);
        result.push((c & 0x3F) | 0x80);
      }
    }
    return result;
  }
}


//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
function testBaseX(){
  var baseX = new BaseX(121);
  var sampleStr = baseX.encodeDouble(-0.000117);
  console.log(sampleStr);
  var resultStr = baseX.decodeDouble(sampleStr);
  console.log(resultStr);
}
// testBaseX();
