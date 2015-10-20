EQ.MapView = Backbone.View.extend({

  el: '#eq-map',
  
  location: {
    'latitude' : 52.3694949,
    'longitude': 5.250602
  },
  map: null,
  allMarkers: [],
  defaultPinImage: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  selectedPinImage: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',

  initialize: function() {
    this.collection.on('sync', this.initMarkers, this);

    EQ.eventBus.on('toggleMarker', this.toggleMarker, this);
    EQ.eventBus.on('toggleAllMarkers', this.toggleAllMarkers, this);
    EQ.eventBus.on('filtered', this.setAllMarkers, this);

    this.initGoogleMap();
  },

  toggleMarker: function(selectedEqId) {
    var selectedMarker = this.getSelectedMarker(selectedEqId);
    this.setSelectedMarker(selectedMarker);
    this.map.setCenter(selectedMarker.position);
  },

  toggleAllMarkers: function(showMarkers) {
    var map = null;

    if (showMarkers) {
      map = this.map;
    } 
    _.each(this.allMarkers, function(marker) {
      if (marker.show) {
        marker.setMap(map);
      } else {
        marker.setMap(null);
      }
    });
  },

  removeAllMarkers: function() {
    this.toggleAllMarkers(false);
  },

  scrollToSelectedEarthquakeEvent: function(selectedEqId) {
    var selectedMarker = this.getSelectedMarker(selectedEqId);
    this.setSelectedMarker(selectedMarker);
    EQ.eventBus.trigger("scrollToSelectedEarthquake", selectedEqId);
  },

  clearSelectedMarkers: function() {
    _.each(this.allMarkers, function(marker) {
      if (marker.selected) {
        marker.setIcon(this.defaultPinImage);
        marker.selected = false;
        marker.setZIndex(google.maps.Marker.MAX_ZINDEX);
      }
    });
  },

  getSelectedMarker: function(selectedEqId) {
    return _.find(this.allMarkers, function(eq) {
      return eq.id === selectedEqId;
    });
  },

  setSelectedMarker: function(selectedMarker) {
    this.clearSelectedMarkers();
    selectedMarker.setMap(this.map);
    selectedMarker.setIcon(this.selectedPinImage);
    selectedMarker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
    selectedMarker.selected = true;
  },

  setAllMarkers: function(earthquakes) {
    _.each(this.allMarkers, function(marker) {
      var eq = _.find(earthquakes.models, function(eq) {
        return eq.id == marker.id;
      });
      marker.show = eq? true: false;
    });
  },

  initMarkers: function() {
    this.removeAllMarkers();
    this.allMarkers = [];
    var self = this;
    _.each(this.collection.allMarkers, function(modelMarker) {
      var marker = new google.maps.Marker({
        position: modelMarker,
        id: modelMarker.id,
        map: null,
        icon: this.defaultPinImage,
        selected: false,
        show: true
      });
      marker.addListener('click', function() {
        self.scrollToSelectedEarthquakeEvent(marker.id);
      });
      self.allMarkers.push(marker);
    });
  },

  initGoogleMap: function() {
    var myCenter = new google.maps.LatLng(this.getLatitude(), this.getLongitude());

    var mapProp = {
      center:    myCenter,
      zoom:      3,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.$el.get(0), mapProp);

    var rectangle = new google.maps.Rectangle({
      strokeColor: '#333333',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#CCCCCC',
      fillOpacity: 0.35,
      map: this.map,
      bounds: {
        north: 72,
        south: 35,
        east: 40,
        west:-25 
      }
    });
  },

  getLongitude: function() {
    return this.location.longitude;
  },

  getLatitude: function() {
    return this.location.latitude;
  }

});
