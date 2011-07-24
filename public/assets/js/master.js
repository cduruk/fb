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

var WIDTH = 60;

var myArray = new Array(721);
for (var i = 0; i < myArray.length; ++i) {
  myArray[i] = {total:0, proced: 0};
}


function layOutDay(events) {
  addEventsToArray(events, myArray);
  sweepAndAssign(events, myArray);
  return events;
}

function addEventsToArray(myEvents, timeline) {
  for (var i = 0; i < myEvents.length; ++i) {
    var myEvent = myEvents[i];
    for (var inner = myEvent.start; inner <= myEvent.end; inner++) {
      timeline[inner].total += 1;
    }
  }
}

function sweepAndAssign(myEvents, timeline) {

  for (var i = 0; i < myEvents.length; ++i) {
    var conflict = 0,
        elsOnLeft = 0,
        myEvent = myEvents[i];

    for (var inner = myEvent.start; inner < myEvent.end; ++inner) {
      if (conflict < timeline[inner].total) {
        conflict = timeline[inner].total;
      }

      if (elsOnLeft < timeline[inner].proced) {
        elsOnLeft = timeline[inner].proced;
      }
    }

    myEvent.width = WIDTH / conflict;
    myEvent.left  = myEvent.width * elsOnLeft;

    for (var inner = myEvent.start; inner <= myEvent.end; inner++) {
      timeline[inner].proced  += 1;
    }
  }
}

console.log(layOutDay(input));
