/*
* This source code is inspired by the following projects.
* https://w3c.github.io/mediacapture-screen-share/
* https://www.webrtc-experiment.com/getDisplayMedia/
*/

class SenbayScreenCapture{

  static CURSOR = {
    DEFAULT : 'default',
    ALWAYS  : 'always',
    NEVER   : 'never',
    MOTION  : 'motion'
  };

  static DISPLAY_SURFACE = {
    DEFAULT : 'default',
    MONITOR : 'monitor',
    WINDOW  : 'window',
    APPLICATION : 'application',
    BROWSER : 'browser'
  };

  constructor(video, constraints={}) {
    this.video = video;
    this.videoConstraints = constraints; //videoConstraints;
  }

  resetConfig(){
    this.videoConstraints = {}
  }

  setFrameRate(frameRate){
    if (frameRate != null) {
      this.videoConstraints.frameRate = frameRate
    }
  }

  setDisplaySurface(surface){
    if (surface != null) {
      this.videoConstraints.displaySurface = surface
    }
  }

  isAvailable() {
    if(!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
      var error = 'Your browser does NOT supports getDisplayMedia API.'
      // throw new Error(error);
      return false
    }
    return true
  }

  start(callback) {
    this.callback = callback
    // console.log(this.video)
    this.invokeGetDisplayMedia(function(screen){

      this.addStreamStopListener(screen, function() {
          location.reload();
      });
      this.video.srcObject = screen;

      var _capabilities = screen.getTracks()[0].getCapabilities();
      console.log(_capabilities)

      var _settings = screen.getTracks()[0].getSettings();
      console.log(_settings)

      if (this.callback != null){
        this.callback(true)
      }

    }, function(e) {
      var error = {
          name:    e.name    || 'UnKnown',
          message: e.message || 'UnKnown',
          stack:   e.stack   || 'UnKnown'
      };

      if(error.name === 'PermissionDeniedError') {
          if(location.protocol !== 'https:') {
              error.message = 'Please use HTTPs.';
              error.stack   = 'HTTPs is required.';
          }
      }
      console.error(error.name);
      console.error(error.message);
      console.error(error.stack);

      alert('Unable to capture your screen.\n\n' + error.name + '\n\n' + error.message + '\n\n' + error.stack);
      if (this.callback != null) {
        this.callback(false)
      }
    });
  }

  stop(){
    this.video.pause()
    this.video.srcObject = null;
  }

  invokeGetDisplayMedia(success, error) {
    if(!Object.keys(this.videoConstraints).length) {
      this.videoConstraints = true;
    }

    var displayMediaStreamConstraints = {
      video: this.videoConstraints
    };

    console.log(displayMediaStreamConstraints);

    if(navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia(displayMediaStreamConstraints).then(success.bind(this)).catch(error);
    } else {
      navigator.getDisplayMedia(displayMediaStreamConstraints).then(success.bind(this)).catch(error);
    }
  }

  addStreamStopListener(stream, callback) {
    stream.addEventListener('ended', function() {
      callback();
      callback = function() {};
    }, false);
    stream.addEventListener('inactive', function() {
      callback();
      callback = function() {};
    }, false);
    stream.getTracks().forEach(function(track) {
      track.addEventListener('ended', function() {
        callback();
        callback = function() {};
      }, false);
      track.addEventListener('inactive', function() {
        callback();
        callback = function() {};
      }, false);
    });
  }

}

//     aspectRatio = [default,1.77,1.33,2.35,1.4,1.9] (=16:9,4:3,21:9,14:10,19:10)
//     frameRate   = [default,30,25,15,5]
//     cursor      = [default,always,never,motion]
//     displaySurface = [default,monitor,window,application,browser]
//     logicalSurface = [default,true]
//     resolutions  = [default,fit-screen,4K,1080p,720p,480p,360p]
//

// }
