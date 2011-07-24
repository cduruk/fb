// var input = [
//               {id : 1, start : 50,  end : 100}
//              ,{id : 2, start : 70,  end : 180}
//              ,{id : 3, start : 60,  end : 260}
//              ,{id : 4, start : 150, end : 200}
//              ,{id : 5, start : 190, end : 270}
//              ,{id : 6, start : 250, end : 300}
//             ];

var input = [
              {id : 1, start : 30,  end : 150}
             ,{id : 2, start : 540, end : 600}
             ,{id : 3, start : 560, end : 620}
             ,{id : 4, start : 610, end : 670}
            ];

var WIDTH     = 600
   ,EVENT     = 'event'
   ,EVENTS    = 'events';

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
function layOutDay(events) {
  var timeline = getTimeline(events);
  return sweepAndAssign(events, timeline);
}

function getTimeline(myEvents) {

  var timeline = new Array(721);
  for (var i = 0; i < timeline.length; ++i) {
    timeline[i] = {total:0, level: 0};
  }

  for (var i = 0; i < myEvents.length; ++i) {
    var myEvent = myEvents[i];
    for (var inner = myEvent.start; inner <= myEvent.end; ++inner) {
      timeline[inner].total += 1;
    }
  }
  return timeline;
}

function sweepAndAssign(myEvents, timeline) {
  for (var i = 0; i < myEvents.length; ++i) {

    var conflict   = 0
       ,myEvent    = myEvents[i]
       ,startLevel = timeline[myEvent.start].level
       ,endLevel   = 0;

    for (var inner = myEvent.start; inner < myEvent.end; ++inner) {
      if (conflict < timeline[inner].total) {
        conflict = timeline[inner].total;
      }
      if (timeline[inner].level >= startLevel) {
        timeline[inner].level += 1;
      }
      if (endLevel < timeline[inner].level) {
        endLevel = timeline[inner].level;
      }
    }

    myEvent.width = WIDTH / conflict;
    myEvent.left  = myEvent.width * (endLevel-1);
    myEvent.top   = myEvent.start;

  }
  return myEvents;
}

function addThingsToDom() {
  var realEvents = layOutDay(input)
     ,events = document.getElementById(EVENTS);

  for (var i = 0; i < realEvents.length; ++i) {
    var myEvent   = document.createElement('div')
       ,realEvent = realEvents[i];

    myEvent.style.width  = realEvent.width + 'px';
    myEvent.style.top    = realEvent.top  + 'px';
    myEvent.style.left   = realEvent.left  + 'px';
    myEvent.style.height = (realEvent.end - realEvent.start) + 'px';
    myEvent.className    = EVENT;

    events.appendChild(myEvent);
  }
}

addThingsToDom();