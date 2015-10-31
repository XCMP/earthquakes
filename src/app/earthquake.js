(function() {

  EQ.Models.EarthQuake = Backbone.Model.extend({
    /*
      See http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php for documentation about the model.
      The EarthQuakes model is a representation of a single type of the array of features.
    */

    initialize: function(model) {
      // overwrite time with readable time
      model.properties.time = new Date(model.properties.time);
    }

  });

})();