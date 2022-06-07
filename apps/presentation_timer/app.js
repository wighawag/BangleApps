g.setFontAlign(0,0); // center font
g.setFont("6x8",8); // bitmap font, 8x magnified

var MINUTES = 1; // 60
var steps = [3*MINUTES, 6*MINUTES, 9*MINUTES, 12*MINUTES, 13*MINUTES, 14*MINUTES]
var currentStep = 0;
var counter;
var counterInterval;

function outOfTime() {
  if (counterInterval) return;
  E.showMessage("Out of Time", "My Timer");
  Bangle.buzz();
  Bangle.beep(200, 4000)
    .then(() => new Promise(resolve => setTimeout(resolve,200)))
    .then(() => Bangle.beep(200, 3000));
  // again, 10 secs later
  setTimeout(outOfTime, 10000);
}

function countDown() {
  counter++;
  

  var last = steps[steps.length - 1];
  var count = 0;
  if (counter < last) {
    count = last - counter;
  }
  
  

  g.clear();
  g.setFontAlign(0,0); // center font
  g.setFont("Vector",80); // vector font, 80px  
  // draw the current counter value
  g.drawString(count,120,120);
  // optional - this keeps the watch LCD lit up
  Bangle.setLCDPower(1);

  if (currentStep < steps.length) {
    if (counter >= steps[currentStep]) {
      console.log({counter:counter,count:count});
      E.showMessage("" + steps[currentStep], "PROGRESS");
      currentStep++;
      Bangle.buzz();
      Bangle.beep(200, 4000)
        .then(() => new Promise(resolve => setTimeout(resolve,200)))
        .then(() => Bangle.beep(200, 3000));
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

startTimer();