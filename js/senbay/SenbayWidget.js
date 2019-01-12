class SenbayWidget{

  constructor(swID, type, buffer){
    this.swID = swID;
    this.type = type;
    this.data = [];
    this.keys = [];
    this.buffer = buffer;
    this.ctx = null;
    this.chart = null;
    this.x = [];
    this.y = [];
    this.z = [];
    this.times = [];
  }

////////////////////////////////////////
  addWidget(targetID){
    $("#"+targetID).append(this.getWidgetElement());
    // $("#widget_"+this.swID).offset({top:10,left:10});
    //$("#"+targetID).prepend(this.getWidgetElement());
    $(".draggable").draggable({ stack: "#set div" });
    $(".resizable").resizable({ stack: "#set div" });
    $(".ui-widget-content").mouseover(function(event){
      $(".sws-control-btn").show();
    });
    $(".ui-widget-content").mouseout(function(event){
      $(".sws-control-btn").hide();
    });
    $("#widget_close_btn_"+this.swID).on('click',function(event){
      var targetID = event.currentTarget.parentElement.id;
     $("#"+targetID).remove();
     });
     this.initChart();
  }

  initChart(){
    this.ctx = document.getElementById('canvas_'+this.swID).getContext('2d');
    this.chart = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        }
      });
  }

  removeWidget(){
    $("#widget_"+this.swID).remove();
  }

  getWidgetElement(){
    var element = "";
    if(this.type==0){ // chart
      element = '<div id="widget_'+this.swID+'" class="ui-widget-content draggable resizable">'
              + '<a id="widget_close_btn_'+this.swID+'"><i class="fa fa-times-circle sws-close-btn sws-control-btn" aria-hidden="true"></i></a>'
              + '<canvas id="canvas_'+this.swID+'"></canvas>'
              + '</div>';
    }
    return element;
  }
// '+this.swID+'
  /**
  * This method updates data on the window
  */
  update(senbayData){
    // console.log(senbayData);
    if(senbayData==null) return false;

    for (var i = 0; i < this.keys.length; i++) {
      var key = this.keys[i];
      var value = senbayData[key];
      if(isNaN(value) ||
         typeof(value) == "undefined" ||
         value == null){
        return false;
      }
    }

    for (var i = 0; i < this.keys.length; i++) {
      var key = this.keys[i];
      var value = senbayData[key];
      if(i==0){
        this.x.push(value);
        if(this.x.length > this.buffer)this.x.shift();
        this.chart.data.datasets[0].data = this.x;
      }else if(i==1){
        this.y.push(value);
        if(this.y.length > this.buffer)this.y.shift();
        this.chart.data.datasets[1].data = this.y;
      }else if(i==2){
        this.z.push(value);
        if(this.z.length > this.buffer)this.z.shift();
        this.chart.data.datasets[2].data = this.z;
      }
    }

    this.times.push(this.timeConverter(senbayData['TIME']));
    if(this.times.length > this.buffer)this.times.shift();
    this.chart.data.labels = this.times;

    // console.log("---");
    // // console.log(this.chart.data.datasets);
    // console.log(this.chart.data);
    // console.log("---");

    this.chart.update();

    return true;
  }

  addKey(key){
    if(key != null){
      this.keys.push(key);

      // initialized a chart element
      this.x = [];
      this.y = [];
      this.z = [];
      this.times = [];
      var chartData = [];
      for (var akindex = 0; akindex < this.keys.length; akindex++) {
        var key = this.keys[akindex];
        var line = null;
        if(akindex==0){
          line = {label:key,
                  data:this.x,
                  backgroundColor:"rgba(255,0,0,0)",
                  borderColor    :"rgba(255,0,0,0.5)"}
        }else if(akindex==1){
          line = {label:key,
                   data:this.y,
                   backgroundColor:"rgba(0,255,0,0)",
                   borderColor    :"rgba(0,255,0,0.5)"}
        }else if(akindex==2){
          line = {label:key,
                  data:this.z,
                   backgroundColor:"rgba(0,0,255,0)",
                   borderColor    :"rgba(0,0,255,0.5)"}
        }
        if(line != null){
          chartData.push(line);
        }
      }

      this.chart = new Chart(this.ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: chartData
          }
        });

    }else{
      return false;
    }
  }

  removeKey(key){
    for (var i=0; i<this.keys.length; i++) {
      if(this.keys[i] == key){
        this.keys.splice(i--, 1);
      }
    }
  }

  timeConverter(timestamp){
    var a = new Date(timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    var time = hour + ':' + min + ':' + sec ;
    return time;
  }
}
