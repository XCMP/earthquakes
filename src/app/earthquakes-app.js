
var EQ = {};

$(document).ready(function() {
 
  EQ.eventBus = _.extend({}, Backbone.Events);

  var earthquakes = new EQ.EarthQuakes();

  new EQ.ActionsView({
  });

  new EQ.EarthQuakesView({
    collection: earthquakes
  });

  new EQ.MapView({
    collection: earthquakes
  });

});
