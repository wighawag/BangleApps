var INITIAL_TOTAL = 15;
var totalList = [INITIAL_TOTAL, 20, 25, 30, 5, 10];
var totalIndex = 0;
var total = INITIAL_TOTAL;
var MINUTES = 60;
var steps = [3*MINUTES, 6*MINUTES, 9*MINUTES, 12*MINUTES, 13*MINUTES, 14*MINUTES]
var currentStep = 0;
var counter;
var counterInterval;

// taken from a_speech_timer (https://github.com/espruino/BangleApps/tree/master/apps/a_speech_timer)
function timeToString(duration) {
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;
    var ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}


function outOfTime() {
  if (counterInterval) return;
  E.showMessage("Out of Time", "My Timer");
  Bangle.buzz().then(()=>{
    return new Promise(resolve=>setTimeout(resolve,500)); // wait 500ms
  }).then(()=>{
    return Bangle.buzz().then(()=>{
      return new Promise(resolve=>setTimeout(resolve,500)); // wait 500ms
    })
  }).then(()=>{
    return Bangle.buzz().then(()=>{
      return new Promise(resolve=>setTimeout(resolve,500)); // wait 500ms
    })
  }).then(()=>{
    return Bangle.buzz().then(()=>{
      return new Promise(resolve=>setTimeout(resolve,500)); // wait 500ms
    })
  }).then(()=>{
    return Bangle.buzz().then(()=>{
      return new Promise(resolve=>setTimeout(resolve,500)); // wait 500ms
    })
  }).then(()=>{
    return Bangle.buzz(1000);
  }).then(()=>{
    console.log("Done");
  });
  setTimeout(outOfTime, 10000);
}

function countDown() {
  counter++;
  

  var last = Math.floor((total * 60));
  var count = 0;
  if (counter < last) {
    count = last - counter;
  }
  
  

  g.clear();
  g.setFontAlign(0,1);
  g.setFont("Vector",40); 
  g.drawString(timeToString(count),120,120);
  Bangle.setLCDPower(1);

  if (currentStep < steps.length) {
    if (counter >= Math.floor(steps[currentStep] * total / INITIAL_TOTAL)) {
      E.showMessage("" + timeToString(steps[currentStep]), "PROGRESS");
      currentStep++;
      if (currentStep < steps.length-1) {
        Bangle.buzz().then(()=>{
          return new Promise(resolve=>setTimeout(resolve,500)); // wait 500ms
        }).then(()=>{
          return Bangle.buzz(1000);
        }).then(()=>{
          console.log("step");
        });
      } else {
        Bangle.buzz().then(()=>{
          return new Promise(resolve=>setTimeout(resolve,500)); // wait 500ms
        }).then(()=>{
          return Bangle.buzz().then(()=>{
            return new Promise(resolve=>setTimeout(resolve,500)); // wait 500ms
          })
        }).then(()=>{
          return Bangle.buzz(1000);
        }).then(()=>{
          console.log("final step");
        });
      }
    }
  }

  // Out of time
  if (count<=0) {
    clearInterval(counterInterval);
    counterInterval = undefined;
    setWatch(startTimer, (process.env.HWVERSION==2) ? BTN1 : BTN2)
    outOfTime();
    return;
  }
  
}

function startTimer() {
  counter = 0;
  countDown();
  if (!counterInterval)
    counterInterval = setInterval(countDown, 1000);
}



setWatch(startTimer, (process.env.HWVERSION==2) ? BTN1 : BTN2)

function drawTotal() {
  g.clear();
  g.setFontAlign(0,1);
  g.setFont("Vector",40); 
  g.drawString(timeToString(total * 60),120,120);
  Bangle.setLCDPower(1);
}

Bangle.on('touch', function(zone,e) {
  console.log("touched")
  totalIndex++;
  if (totalIndex >= totalList.length) {
    totalIndex = 0;
  }
  total = totalList[totalIndex];
  drawTotal();
});

drawTotal();