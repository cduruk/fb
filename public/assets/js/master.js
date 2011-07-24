var input = [
              {id : 1, start : 30,  end : 150}
             ,{id : 2, start : 540, end : 600}
             ,{id : 3, start : 560, end : 620}
             ,{id : 4, start : 610, end : 680}
            ];

/**
Lays out events for a single  day

@param array  events
 An array of event objects. Each event object consists of a start time, end
 Time (measured in minutes) from 9am, as well as a unique id. The
 Start and end time of each event will be [0, 720]. The start time will
 Be less than the end time.  The array is not sorted.

 @return array
 An array of event objects that has the width, the left and top positions set,
 In addition to start time, end time, and id.

**/

var WIDTH = 600;

var myArray = new Array(721);
for (var i = 0; i < myArray.length; ++i) {
  myArray[i] = {total:0, rem: 0};
}


function layOutDay(events) {
  addEventsToArray(events, myArray);
  sweepAndAssign(events, myArray);
  return events;
}

function addEventsToArray(myEvents, timeline) {
  for (var i = 0; i < myEvents.length; ++i) {
    var myEvent = myEvents[i];
    for (var inner = myEvent.start; inner <= myEvent.end; ++inner) {
      timeline[inner].total += 1;
    }
  }
}

function sweepAndAssign(myEvents, timeline) {
  for (var i = 0; i < myEvents.length; ++i) {
    var conflict   = 0,
        myEvent    = myEvents[i],
        startLevel = timeline[myEvent.start].rem;

    for (var inner = myEvent.start; inner < myEvent.end; ++inner) {
      if (conflict < timeline[inner].total) {
        conflict = timeline[inner].total;
      }
      if (timeline[inner].rem === startLevel) {
        timeline[inner].rem += 1;
      }
    }

    myEvent.width = WIDTH / conflict;
    myEvent.left  = myEvent.width * startLevel;
    myEvent.top   = myEvent.start;

  }
}

function addThingsToDom() {
  var realEvents = layOutDay(input);
  var container = document.getElementById('container');

  for (var i = 0; i < realEvents.length; ++i) {
    var myEvent   = document.createElement('div'),
        realEvent = realEvents[i];

    myEvent.style.width  = realEvent.width + 'px';
    myEvent.style.top    = realEvent.top  + 'px';
    myEvent.style.left   = realEvent.left  + 'px';
    myEvent.style.height = (realEvent.end - realEvent.start) + 'px';
    myEvent.className    = 'event';
    myEvent.innerHTML   = 'my name is ' + realEvent.id;
    container.appendChild(myEvent);
  }
}

addThingsToDom();
