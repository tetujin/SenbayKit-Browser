class SenbayReader{

  constructor(videoElementId, baseNumber=122, debug=false) {
    // console.log(baseNumber)
    this.senbayFormat   = new SenbayFormat(baseNumber);
    this.videoElementId = videoElementId;
    this.video = document.getElementById(videoElementId);
    this.timerId = null;
    this.decodeHandler = null;
    this.detectHandler = null;
    this.errorHandler  = null;
    this.DEBUG = debug;
    this.preX = 0
    this.preY = 0
    this.preW = 0
    this.preH = 0
    this.preTimestamp = 0
  }

  start(scanInterval, decodeHandler=null){
    if (decodeHandler != null){
      this.decodeHandler = decodeHandler;
    }
    this.timerId  = setInterval( this.scan.bind(this), scanInterval );
  }

  stop(){
    clearInterval(this.timerId);
  }

  scan(){
    // get a width and height of video
    var w = this.video.offsetWidth;
    var h = this.video.offsetHeight;

    // create a virtual canvas
    let canvas = document.createElement("canvas");
    canvas.height = w;
    canvas.width  = h;

    var ctx = canvas.getContext('2d');

    // set the same size of canvas with video
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);

    // copy video frame on canvas
    ctx.drawImage(this.video, 0, 0, w, h);

    try{
      let date = new Date()
      let timestamp = date.getTime()
      let code = null;

      if (this.preTimestamp + (1000*5) > timestamp && this.preY > 10) {
        let imageData = ctx.getImageData(this.preX - 3,
                                         this.preY - 3,
                                         this.preW + 6,
                                         this.preH + 6)
        // console.log(imageData)
        code = jsQR(imageData.data, imageData.width, imageData.height);
      }else{
        // console.log('normal')
        this.preX = 0
        this.preY = 0
        this.preW = 0
        this.preH = 0
        let imageData = ctx.getImageData(0, 0, w, h);
        code = jsQR(imageData.data, w, h);
      }

      // check result
      if (code) {

        if(this.detectHandler != null){
          this.detectHandler(code);
        }

        this.preX = code.location.topLeftCorner.x
        this.preY = code.location.topLeftCorner.y
        this.preW = code.location.bottomRightCorner.x- code.location.bottomLeftCorner.x
        this.preH = code.location.bottomRightCorner.y - code.location.topRightCorner.y

        this.preTimestamp = timestamp

        // console.log(this.preX, this.preY, this.preW, this.preH)

        var senbayObj = this.senbayFormat.getSenbayData(code.data);
        try {
          if(typeof(senbayObj) != "undefined"){
            // var res = JSON.stringify(obj, null, " \t");
            if(this.decodeHandler != null){
              this.decodeHandler(senbayObj);
            }
          }
        } catch (e) {
          if(this.DEBUG){
            console.log("Error: " + e);
            if (this.errorHandler != null){
              this.errorHandler(e);
            }
          }
        }
      }
    }catch(e){
      console.log(e)
      if (this.errorHandler != null){
        this.errorHandler(e);
      }
      return;
    }
  };
}
