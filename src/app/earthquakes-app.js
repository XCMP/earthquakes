
var EQ = {};

EQ.events = {
  // Constant for events
  LOCATION_CHANGED      : 'locationChanged',
  SCROLL_TO_SELECTED_EQ : 'scrollToSelectedEarthquake',
  search                : 'search',
  GET_DATA              : 'getData',
  FILTERED              : 'filtered',
  TOGGLE_MARKER         : 'toggleMarker',
  TOGGLE_ALL_MARKERS    : 'toggleAllMarkers',

  // The bus
  bus                   : _.extend({}, Backbone.Events)
};

$(document).ready(function() {
 
  var earthquakes = new EQ.EarthQuakes();

  new EQ.EarthQuakesView({
    collection: earthquakes
  });

  new EQ.MapView({
    collection: earthquakes
  });

  new EQ.ActionsView({
  });

});
