(function(_events) {

  EQ.Collections.EarthQuakes = Backbone.Collection.extend({

    model: EQ.Models.EarthQuake,
    allMarkers: [],
    initialized: false,

    url: function() {
      /**
        Interface:
          'starttime=2015-01-01'
          'endtime=2015-01-01'
          'minlongitude=-25'
          'maxlongitude=40'
          'minlatitude=35'
          'maxlatitude=72'
      */
      var location = '';
      if (!this.initialized) { 
        location = '&minlongitude=-25&maxlongitude=40&minlatitude=35&maxlatitude=72';
        this.initialized = true;
      }
      return 'http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson' + location;
    },

    initialize: function() {
    },

    parse: function(response) {
      this.allMarkers = [];
      for(var i = 0; i < response.features.length; i++) {
        response.features[i].properties.time = new Date(response.features[i].properties.time);
        this.addMarker(response.features[i]);
      }
      return response.features;
    },

    filterByPlace: function(searchValue) {
      var filteredEarthquakes;
      if (searchValue === '') {
        filteredEarthquakes = this;
      } else {
        filteredEarthquakes = new EQ.EarthQuakes(this.filter(
          function(eq) {
            return eq.attributes.properties.title.toLowerCase().indexOf(searchValue.toLowerCase(searchValue)) != -1;
          }
        ));
      }
      _events.bus.trigger(_events.FILTERED, filteredEarthquakes);
      return filteredEarthquakes;
    },

    addMarker: function(feature) {
      this.allMarkers.push(
        {
          'lng': feature.geometry.coordinates[0],
          'lat': feature.geometry.coordinates[1],
          'id' : feature.id
        }
      );
    },

    count: function() {
      return this.length;
    }

  });

})(EQ.Events);