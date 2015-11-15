var EQ = {

  Models: {},
  Collections: {},
  Views: {},

  Events: {
    // constant for events
    LOCATION_CHANGED      : 'locationChanged',
    SCROLL_TO_SELECTED_EQ : 'scrollToSelectedEarthquake',
    SEARCH                : 'search',
    GET_DATA              : 'getData',
    FILTERED              : 'filtered',
    TOGGLE_MARKER         : 'toggleMarker',
    TOGGLE_ALL_MARKERS    : 'toggleAllMarkers',
    DRAWING_FINISHED      : 'drawingFinished',
    // the event bus
    bus                   : _.extend({}, Backbone.Events)
  }
};

$(document).ready(function() {
 
  var earthquakes = new EQ.Collections.EarthQuakes();

  new EQ.Views.EarthQuakesView({
    collection: earthquakes
  });

  new EQ.Views.MapView({
    collection: earthquakes
  });

  new EQ.Views.ActionsView({
  });

});
