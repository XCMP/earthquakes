var eventBus = _.extend({}, Backbone.Events);

$(document).ready(function() {

  var earthQuakes = new EarthQuakes();

  var earthQuakesView = new EarthQuakesView({
    collection: earthQuakes
  });

  var mapView = new MapView({
    collection: earthQuakes
  });

  var buttonsView = new ButtonsView({
  });

});