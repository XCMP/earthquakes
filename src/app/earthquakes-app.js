var eventBus = _.extend({}, Backbone.Events);

$(document).ready(function() {

  var earthquakes = new EarthQuakes();

  var earthQuakesView = new EarthQuakesView({
    collection: earthquakes
  });

  var mapView = new MapView({
    collection: earthquakes
  });

  var buttonsView = new ButtonsView({
  });

});