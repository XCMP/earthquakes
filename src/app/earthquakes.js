var EarthQuake = Backbone.Model.extend({
});

var EarthQuakes = Backbone.Collection.extend({

  model: EarthQuake,
  allMarkers: [],

  url: function() {
    return 'http://earthquake.usgs.gov/fdsnws/event/1/query?'
      + 'format=geojson&'
      + 'minlongitude=-25&'
      + 'maxlongitude=40&'
      + 'minlatitude=35&'
      + 'maxlatitude=72';
      //+ 'starttime=2015-01-01&'
      //+ 'endtime=2015-01-01&'
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
      filteredEarthquakes = new EarthQuakes(this.filter(
        function(eq) {
          return eq.attributes.properties.title.toLowerCase().indexOf(searchValue.toLowerCase(searchValue)) != -1;
        }
      ));
    }
    eventBus.trigger('filtered', filteredEarthquakes);
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
