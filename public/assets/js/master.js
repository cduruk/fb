var input = [
              {id : 1, start : 30,  end : 150}
             ,{id : 2, start : 540, end : 600}
             ,{id : 3, start : 560, end : 620}
             ,{id : 4, start : 510, end : 620}
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
    timeline[i] = {grid: []};
  }

  // Sweep through the events and add number of events for each point in time
  for (var i = 0; i < myEvents.length; ++i) {
    var myEvent = myEvents[i];
    for (var inner = myEvent.start; inner <= myEvent.end; ++inner) {
        timeline[inner].grid.push(-1);
    }
  }
  return timeline;
}

/**
Initialize the timeline and the events for further processing.

The algorithm we use relies on clustering the conflicting elements. When
there are N elements  in a cluster, we divide each line on the timeline
into N elements, and then try to place the next event into the first
empty spot.

This function the marks the part of timelines with the number of maximum
conflicts.

  @param Object myEvent
  An event object

  @param array timeline
  The timeline

  @return void
**/

function initializeEventsAndTimeline(myEvents, timeline) {

  for (var i = 0; i < myEvents.length; i++) {
    var myEvent = myEvents[i];
    myEvent.conflicts = getConflictCount(myEvent, timeline);

    for (var time = myEvent.start; time <= myEvent.end; time++) {
      timeline[time].grid  = new Array(myEvent.conflicts);
      for (var index = 0; index < timeline[time].grid.length; index++) {
        timeline[time].grid[index] = -1;
      }
    }

  }

}

/**
Sweeps through the events and assings them width, left, and top values.

The main algorithm relies on the idea that all conflicting elements need
to have the same width and we try to place the elements leftmost as possible.

Whenever we see a group of elements conflicting, we find the maximum number of
conflicts and then divide the each line on the timeline into that number
of conflicts. After that, we try to place the elements using that grid, when
an element is placed on a spot on that grid, we mark all the lines on the
timeline on that level as taken.

  @param Object myEvent
  An event object

  @param array timeline
  The timeline

  @return array
  An array of events where events are assigned a top, width, and a left
  value

**/
function sweepAndAssign(myEvents, timeline) {
  var resultEvents = [];

  initializeEventsAndTimeline(myEvents, timeline);

  for (var eventCount = 0; eventCount < myEvents.length; eventCount++) {
    var myEvent = myEvents[eventCount];

    myEvent.width  = DOM.WIDTH / myEvent.conflicts;
    myEvent.height = myEvent.end-myEvent.start;
    myEvent.top    = myEvent.start;

    myEvent.left = getLevelForEvent(myEvent, timeline) * myEvent.width;
    resultEvents.push(myEvent);
  }
  return resultEvents;
}

/**
Get the level, horizontally, for this event..

  @param Object myEvent
  An event object

  @param array timeline
  The timeline

  @return integer
  Return the level this event should be placed in
**/
function getLevelForEvent(myEvent, timeline) {

  var level = 0;
  var found = false;

  for (var eTime = myEvent.start; eTime <= myEvent.end; eTime++) {

    if (found) {
      break;
    }

    var myGrid = timeline[eTime].grid;
    for (var index = 0; index < myGrid.length; index++) {

      //See if there is any spot on that grid on this line.
      if (myGrid[index] === -1 && !found) {
        level = index;
        found = true;

         //Placed an element. Now mark those spots as taken
         //on all lines this element is in.
         for (var time = myEvent.start; time <= myEvent.end; time++) {
           timeline[time].grid[level] = 1;
         }
         break;
       }
    }
  }

  return level;
}

/**
 Return the max number of conflicts this event ever experiences

 @param Object myEvent
 An event object

 @param array timeline
 The timeline

 @return HTMLElement
 Return a DOM element representing that event

**/
function getConflictCount(myEvent, timeline) {
  var conflict = 0;
  for (var inner = myEvent.start; inner < timeline.length; ++inner) {
    if (timeline[inner].grid.length == 0) break;
    if (conflict < timeline[inner].grid.length) {
     conflict = timeline[inner].grid.length;
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

window.onload = buildCalendar();