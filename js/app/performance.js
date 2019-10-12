var screenCapture = null;
var reader = null;
var readerState = false;

$(function() {

  var controller = document.getElementById('controller-toggle');
  controller.change = function(){
    if (readerState) {
      readerState = false;
      stopQRcodeDecode()
    }else{
      readerState = true;
      selectScreen()
    }
    console.log(readerState);
  }
});

function selectScreen(){
  var video = document.getElementById('mv');
  screenCapture = new SenbayScreenCapture(video);
  screenCapture.start(function(success){
    if (success) {
      console.log("Start Screen Capturing")
      startQRcodeDecode()
    }else{
      console.error("Error: Screen Capturing")
    }
  });
}

function startQRcodeDecode(){
  if (reader != null){
    reader.stop();
    reader = null;
  }

  reader = new SenbayReader('mv',121);
  var interval = 30;
  console.log(interval);

  var preTimestamp = 0;
  var fps = 0;
  var countNow = 0;
  var countLimit = 60;
  var skip = 0;

  reader.start(interval, function(json){
    if (skip < 30) {
      skip++;
      return;
    }
    // console.log("decode::",json);
    var date = new Date() ;
    var timestamp = Math.floor( date.getTime() / 1000 ) ;
    if (preTimestamp == timestamp) {
      fps++;
    }else{
      var raw = document.getElementById('raw');
      if (preTimestamp != 0) {
        raw.innerHTML = raw.innerHTML + fps + ",<br>";
      }else{
        raw.innerHTML = "";
      }
      preTimestamp = timestamp;
      fps = 0;
      countNow++;
      if (countNow > countLimit) {
        stopQRcodeDecode();
        console.log('done');
      }
    }
  });
  reader.detectHandler = function(raw){
  }
  reader.errorHandler = function(e){
    console.log("error::",e);
  }
}

function stopQRcodeDecode(){
  reader.stop();
  screenCapture.stop()
  document.getElementById("set").hidden = true
}
