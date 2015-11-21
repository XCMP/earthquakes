var EQ = {

  Models: {},
  Collections: {},
  Views: {},

  Events: {
    // constant for events
    COORDINATES_CHANGED        : 'coordinatesChanged',
    EQ_SELECTED                : 'earthquakeSelected',
    SEARCH                     : 'search',
    FETCH_DATA                 : 'fetchData',
    FILTERED                   : 'filtered',
    TOGGLE_MARKER              : 'toggleMarker',
    TOGGLE_ALL_MARKERS         : 'toggleAllMarkers',
    DRAWING_RECTANGLE_FINISHED : 'drawingFinished',
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
