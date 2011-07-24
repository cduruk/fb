var input = [
              {id : 1, start : 30,  end : 150}
             ,{id : 2, start : 540, end : 600}
             ,{id : 3, start : 560, end : 620}
             ,{id : 4, start : 610, end : 670}
             ,{id : 5, start : 610, end : 670}
             ,{id : 6, start : 610, end : 670}


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

var zz;

/**
  Hold all strings
**/
var STRINGS = {
  SAMPLE_ITEM : 'Sample Item'
 ,SAMPLE_LOC  : 'Sample Location'
}

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
  events = getSortedEvents(events);


  var timeline = getTimeline(events);
  // console.log(timeline);
  return sweepAndAssign(events, timeline);
}

/**
Creates a timeline for events

 @param array myEvents
 An array of event objects.

 @return array
 The timeline is used to calculate how many events there are at a given
 time, each index of the array represents the minute and the value is
 an object of the form {total: INTEGER, level: INTEGER}.

 The total key in the object holds the number of all events at a given time.
 The level key holds the current level at which elements can be placed
 during the sweep across all the elements.

 Note that, for convenience, this array is indexed from 1, thus 720th minute
 (9PM) is on the 721th spot.

**/
function getTimeline(myEvents) {

  var timeline = new Array(721);

  //Initialize the timeline with zero elements and zero levels
  for (var i = 0; i < timeline.length; ++i) {
    timeline[i] = {total:0, levels: [false]};
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

The algorithm is as follows:
  * Calculate the width where width is the maximum allowed width divided by
    the highest number of events during that events' lifetime.
  * Calculate the vertical location. For this, we place an element on the
    as left as possible and then mark those spots on the timeline as taken by
    increasing the level count.

 @param array myEvents
 An array of event objects.

 @param array timeline
 An array representing the daily timeline where the index is the minue count
 and value is the number of events at that time.

 @return array
 Return an array objects where, in addition to their existing values, events
 are also assigned width, left, and top values.

**/
function sweepAndAssign(myEvents, timeline) {
  for (var i = 0; i < myEvents.length; ++i) {

    var conflict   = 0
       ,myEvent    = myEvents[i]
       ,startLevel = timeline[myEvent.start].level
       ,endLevel   = 0;

    for (var inner = myEvent.start; inner < timeline.length; ++inner) {
      if (timeline[inner].total == 0) break;
      if (conflict < timeline[inner].total) {
       conflict = timeline[inner].total;
     }
    }

    var myL   = 0;
    var found = false;
    for (var inner = myEvent.start; inner < myEvent.end; ++inner) {
      var levels = timeline[inner].levels;
      if (myEvent.id == 3) console.log(levels)

      if (found) {
        break;
      }

      for (var j = 0; j < levels.length; ++j) {
        if (levels[j] === false)
        myL = j;
        found = true;
      }
    }

    if (!found) {
      myL = timeline[myEvent.start].levels.length;
    }

    for (var inner = myEvent.start; inner < myEvent.end; ++inner) {
     timeline[inner].levels[myL] = true;
    }

    myEvent.width = DOM.WIDTH / conflict;
    myEvent.left  = myEvent.width * (myL);
    myEvent.top   = myEvent.start;

  }

  zz = timeline;
  return myEvents;
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
  result.title        = 'Oh god...' + myEvent.id;

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