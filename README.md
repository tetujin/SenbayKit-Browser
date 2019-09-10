# SenbayKit-Browser
**SenbayKit-Browser** is a library for decoding embedded sensor data from SenbayVideo on your web browser.


<p align="center">
  <img src="video/demo.gif", width="640">
</p>

## Basic Usages
First of all, you need to add a `video` element into the `body` element.

```html
<video  id="v" width="100%" src="video.mp4" autoplay controls></video>
```

In JavaScript, you just initialize `SenbayReader` with video element's id and call `start(interval,observer)` method. SenbayReader try to decode a QR code by the `interval` (millisecond). The `observer` is called when a QR code is detected by `SenbayReader`.
You can stop the loop by `stop()` method.

```JavaScript
var reader = new SenbayReader('v');
var interval = 100; // millisecond
reader.start(interval, function(json){
  console.log(json);
});
// reader.stop();
```

You can decode a QR code on any other screens by using screen capture function. You can easily connect the function using **[getScreenId](https://github.com/muaz-khan/getScreenId)** library.
Just adding the following code into HTML and JavaScript, you can scan QR codes on any other screens.

```html
<script src="https://cdn.WebRTC-Experiment.com/getScreenId.js"></script>
```

```JavaScript
getScreenId(function (error, sourceId, screen_constraints) {
  navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
  navigator.getUserMedia(screen_constraints, function (stream) {
      document.querySelector('video').srcObject = stream
      // console.log(stream);
  }, function (error) {
      console.error(error);
  });
});
```
NOTE: You have to install an extension except Firefox. Please check the detail on their [website](https://github.com/muaz-khan/getScreenId).

## Demo
You can try demo applications on this [link](https://www.ht.sfc.keio.ac.jp/~tetujin/SenbayKit-Browser/).

## Instruction
1. Download SenbayKit-Browser library
2. Move `js` directory into your project
3. Import following JavaScript files
```html
<!-- install 'jsQR' ( https://github.com/cozmo/jsQR )-->
  <script src="js/QR/jsQR.js"></script>

 <!-- install 'senbay' -->
<script type="text/javascript" src="js/senbay/BaseX.js" charset="utf-8"></script>
<script type="text/javascript" src="js/senbay/SenbayFormat.js" charset="utf-8"></script>
<script type="text/javascript" src="js/senbay/SenbayReader.js" charset="utf-8"></script>

<!-- install 'getScreenId' if you use screen capture-->
<script src="https://cdn.WebRTC-Experiment.com/getScreenId.js"></script>
```

4. Add required HTML elements
```html
<video  id="v" width="100%" src="video.mp4" autoplay controls></video>
```

5. Initialize `SenbayReader` class and execute methods
```JavaScript
var reader = new SenbayReader('v');
var interval = 100; // millisecond
reader.start(interval, function(json){
  console.log(json);
});
// reader.stop();
```

6. [Option] Add the screen capture function
```JavaScript
getScreenId(function (error, sourceId, screen_constraints) {
  navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
  navigator.getUserMedia(screen_constraints, function (stream) {
      document.querySelector('video').srcObject = stream
      // console.log(stream);
  }, function (error) {
      console.error(error);
  });
});
```

## Author and Contributors
SenbayKit is authord by [Yuuki Nishiyama](http://www.yuukinishiyama.com). In addition, [Takuro Yonezawa](https://www.ht.sfc.keio.ac.jp/~takuro/), [Denzil Ferreira](http://www.oulu.fi/university/researcher/denzil-ferreira), [Anind K. Dey](http://www.cs.cmu.edu/~anind/), [Jin Nakazawa](https://keio.pure.elsevier.com/ja/persons/jin-nakazawa) are deeply contributing this project. Please see more detail information on our [website](http://www.senbay.info).

## Related Links
* [Senbay Platform Website](http://www.senbay.info)
* [Senbay YouTube Channel](https://www.youtube.com/channel/UCbnQUEc3KpE1M9auxwMh2dA/videos)

## Citation
Please cite these papers in your publications if it helps your research:

```
@inproceedings{Nishiyama:2018:SPI:3236112.3236154,
author = {Nishiyama, Yuuki and Dey, Anind K. and Ferreira, Denzil and Yonezawa, Takuro and Nakazawa, Jin},
title = {Senbay: A Platform for Instantly Capturing, Integrating, and Restreaming of Synchronized Multiple Sensor-data Stream},
booktitle = {Proceedings of the 20th International Conference on Human-Computer Interaction with Mobile Devices and Services Adjunct},
series = {MobileHCI '18},
year = {2018},
location = {Barcelona, Spain},
publisher = {ACM},
}
```

## License
SenbayKit-Browser is available under the Apache License, Version 2.0 license. See the LICENSE file for more info.

## Open Source Softwares
* jQuery (MIT)
* chart (MIT)
* getScreenId (MIT)
* jsQR (Apache 2.0)
