var input = [
              {id : 1, start : 30,  end : 150}
             ,{id : 2, start : 540, end : 600}
             ,{id : 3, start : 560, end : 620}
             ,{id : 3, start : 510, end : 620}
             ,{id : 4, start : 610, end : 670}
             ,{id : 3, start : 510, end : 620}
             ,{id : 4, start : 610, end : 670}
            ];

/**
  Hold all the DOM related constants, classes, sizes
**/
var DOM = {
  EVENT        : 'event'     // Class for the event
 ,EVENTS       : 'events'    // ID for the event container
 ,LOCATION     : 'location'  // Class for the event location paragraph
 ,TITLE        : 'title'     // Class for the event title parapgrah
 ,WIDTH        : 600         // Overall maximum width of the event
 ,HORIZ_OFFSET : 2           // The height difference caused by borders
 ,VERTI_OFFSET : 5           // Width difference caused by borders
}

/**
  Hold all strings
**/
var STRINGS = {
  SAMPLE_ITEM : 'Sample Item'
 ,SAMPLE_LOC  : 'Sample Location'
}

function layOutDay(events) {
  events = getSortedEvents(events);

  var timeline = getTimeline(events);
  return sweepAndAssign(events, timeline);
}


function getTimeline(myEvents) {

  var timeline = new Array(721);

  //Initialize the timeline with zero elements and zero levels
  for (var i = 0; i < timeline.length; ++i) {
    timeline[i] = {total:0, grid: 0};
  }

  // Sweep through the events and add number of events for each point in time
  for (var i = 0; i < myEvents.length; ++i) {
    var myEvent = myEvents[i];
    for (var inner = myEvent.start; inner <= myEvent.end; ++inner) {
        timeline[inner].total += 1;
    }
  }
  return timeline;
}


/**
Sweeps through the events and assings them width, left, and top values.

**/
function sweepAndAssign(myEvents, timeline) {
  var resultEvents = [];

  for (var i = 0; i < myEvents.length; i++) {
    var myEvent = myEvents[i];

    myEvent.conflicts = getConflictCount(myEvent, timeline);

    for (var j = myEvent.start; j <= myEvent.end; j++) {
      timeline[j].grid  = new Array(myEvent.conflicts)
      for (var index = 0; index < timeline[j].grid.length; index++) {
        timeline[j].grid[index] = -1;
      }
    }
  }

  for (var eventCount = 0; eventCount < myEvents.length; eventCount++) {
    var myEvent = myEvents[eventCount];

    myEvent.width  = DOM.WIDTH / myEvent.conflicts;
    myEvent.height = myEvent.end-myEvent.start;
    myEvent.top    = myEvent.start;

    var level = 0;
    var found = false;

    for (var eTime = myEvent.start; eTime <= myEvent.end; eTime++) {

      if (found) break;
      var myGrid = timeline[eTime].grid;

      for (var index = 0; index < myGrid.length; index++) {
       if (myGrid[index] === -1 && !found) {
         level = index;
         found = true;
          for (var time = myEvent.start; time <= myEvent.end; time++) {
            timeline[time].grid[level] = 1;
          }
          break;
        }
      }
    }

    myEvent.left = level * myEvent.width;
    resultEvents.push(myEvent);
  }
  return resultEvents;

}

function getConflictCount(myEvent, timeline) {
  var conflict = 0;
  for (var inner = myEvent.start; inner < timeline.length; ++inner) {
    if (timeline[inner].total == 0) break;
    if (conflict < timeline[inner].total) {
     conflict = timeline[inner].total;
   }
  }
  return conflict;
}

/**
 Return a DOM representation of the event

 @param Object myEvent
 An event object

 @return HTMLElement
 Return a DOM element representing that event

**/
function getEventDOM(myEvent) {
  var result = document.createElement('div');

  //4px left border + 1px right border
  result.style.width  = (myEvent.width - DOM.VERTI_OFFSET) + 'px';

  //1px top + 1px bottom border
  result.style.top    = (myEvent.top - DOM.HORIZ_OFFSET)  + 'px';

  result.style.left   = myEvent.left  + 'px';
  result.style.height = (myEvent.end - myEvent.start) + 'px';
  result.className    = DOM.EVENT;

  var title = document.createElement('p');
  title.className = DOM.TITLE;
  title.innerHTML = STRINGS.SAMPLE_ITEM;

  var location = document.createElement('p');
  location.className = DOM.LOCATION;
  location.innerHTML = STRINGS.SAMPLE_LOC;

  result.appendChild(title);
  result.appendChild(location);

  return result;
}

/**
Sort the events by their start time.

 @param array  events
 An array of event objects

 @return array
 An array of event objects where events are sorted by their start time

**/
function getSortedEvents(events) {
  return events.sort(function(event1, event2) {
    if (event1.start < event2.start) {
      return -1;
    }
    if (event1.start > event2.start) {
     return 1;
    }
    return 0;
  })
}


/**
 Build the calendar

**/
function buildCalendar() {
  var events    = layOutDay(input)
     ,container = document.getElementById(DOM.EVENTS);

  for (var i = 0; i < events.length; ++i) {
    container.appendChild(getEventDOM(events[i]));
  }
}

buildCalendar();