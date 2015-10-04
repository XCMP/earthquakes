var MapView = Backbone.View.extend({

  el: '#eq-map',
  
  location: {
    'latitude'  : 52.3694949,
    'longitude': 5.250602
  },
  map: null,
  allMarkers: [],

  initialize: function() {
    this.collection.on('sync', this.initMarkers, this);

    eventBus.on('toggleMarker', this.toggleMarker, this);
    eventBus.on('toggleAllMarkers', this.toggleAllMarkers, this);

    this.fixPositionOfMap();
    this.initGoogleMap();
  },

  toggleMarker: function(selectedEqId) {
    var selectedMarker = _.find(this.allMarkers, function(eq) {
      return eq.id === selectedEqId;
    });

    selectedMarker.setMap(
      selectedMarker.getMap() === null ? this.map : null
    );
  },

  toggleAllMarkers: function(showMarkers) {
    var map = null;
    if (showMarkers) {
      map = this.map
    } 
    _.each(this.allMarkers, function(marker) {
      marker.setMap(map);
    })
  },

  scrollToSelectedEarthquakeEvent: function(selectedEqId) {
    eventBus.trigger("scrollToSelectedEarthquake", selectedEqId);
  },

  initMarkers: function() {
    this.allMarkers = [];
    var self = this;
    _.each(this.collection.allMarkers, function(modelMarker) {
      var marker = new google.maps.Marker({
        position: modelMarker,
        id: modelMarker.id,
        map: null
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

  fixPositionOfMap: function() {
    $(window).scroll(function(e) { 
      var $fixedElement = $('.map-fixed');
      var isPositionFixed = ($fixedElement.css('position') == 'fixed');
      var l = $fixedElement.position().left;
      if ($(this).scrollTop() > 0 && !isPositionFixed) { 
        $fixedElement.css({'position': 'fixed', 'top': '0px', 'left': l+'px', 'margin-top': '.5em'});
      }
      if ($(this).scrollTop() < 0 && isPositionFixed) {
        $fixedElement.css({'position': 'static', 'top': '0px', 'left': l+'px', 'margin-top': '.5em'});
      } 
    });

  },

  getLongitude: function() {
    return this.location.longitude;
  },

  getLatitude: function() {
    return this.location.latitude;
  },

  setLocation: function(location) {
    this.location = location;
  }

});
