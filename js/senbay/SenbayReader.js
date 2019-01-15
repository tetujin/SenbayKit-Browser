class SenbayReader{

  constructor(videoElementId, baseNumber=121, debug=false) {
      this.senbayFormat   = new SenbayFormat(baseNumber);
      this.videoElementId = videoElementId;
      this.video = document.getElementById(videoElementId);
      this.timerId = null;
      this.observer = null;
      this.DEBUG = debug;
  }

  start(scanInterval, observer){
    this.observer = observer;
    this.timerId  = setInterval( this.scan.bind(this), scanInterval );
  }

  stop(){
    clearInterval(this.timerId);
  }

  scan(){
    // set the canvas mode as 2d
    var canvas = document.getElementById('qr-canvas');
    if(canvas == null){
      console.error('please insert `<canvas id="qr-canvas" hidden></canvas>` into the `body` element.')
      return;
    }
    var ctx = canvas.getContext('2d');

    // get a width and height of video
    var w = this.video.offsetWidth;
    var h = this.video.offsetHeight;

    // set the same size of canvas with video
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);

    // copy video frame on canvas
    ctx.drawImage(this.video, 0, 0, w, h);

    qrcode.callback = this.read.bind(this);
    try {
      qrcode.decode();
    } catch (e) {
      if(this.DEBUG){
        console.log("Error: " + e);
      }
    }
  };

  read(rawData) {
    var senbayObj = this.senbayFormat.getSenbayData(rawData);
    try {
      if(typeof(senbayObj) != "undefined"){
        // var res = JSON.stringify(obj, null, " \t");
        if(this.observer != null){
          this.observer(senbayObj);
        }
      }
    } catch (e) {
      if(this.DEBUG){
        console.log("Error: " + e);
      }
    }
  }
}
