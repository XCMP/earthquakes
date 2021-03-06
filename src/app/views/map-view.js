(function (_events) {

  EQ.Views.MapView = Backbone.View.extend({

    el: '#eq-map',
    
    location: {
      'latitude' : 52.3694949,
      'longitude': 5.250602
    },
    defaultPinImage: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    selectedPinImage: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',

    rectangle: null,
    map: null,
    drawingManager: null,

    allMarkers: [],

    initialize: function() {
      this.collection.on('sync', this.initMarkers, this);

      _events.bus.on(_events.TOGGLE_MARKER, this.toggleMarker, this);
      _events.bus.on(_events.TOGGLE_ALL_MARKERS, this.toggleAllMarkers, this);
      _events.bus.on(_events.FILTERED, this.setAllMarkers, this);
      _events.bus.on(_events.COORDINATES_CHANGED, this.adjustRectangle, this);

      this.initGoogleMap();
    },

    toggleMarker: function(selectedEqId) {
      var selectedMarker = this.getSelectedMarker(selectedEqId);
      this.setSelectedMarker(selectedMarker);
      this.map.setCenter(selectedMarker.position);
    },

    toggleAllMarkers: function(showMarkers) {
      _.each(this.allMarkers, function(marker) {
        if (marker.show) {
          marker.setMap(showMarkers? this.map : null);
        } else {
          marker.setMap(null);
        }
      }, this);
    },

    removeAllMarkers: function() {
      this.toggleAllMarkers(false);
    },

    selectedEarthquake: function(selectedEqId) {
      var selectedMarker = this.getSelectedMarker(selectedEqId);
      this.setSelectedMarker(selectedMarker);
      _events.bus.trigger(_events.EQ_SELECTED, selectedEqId);
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
        marker.show = eq ? true: false;
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
          self.selectedEarthquake(marker.id);
        });
        self.allMarkers.push(marker);
      });
      this.toggleAllMarkers(true);
    },

    adjustRectangle: function(locationCoordinates) {
      if (this.rectangle) {
        this.rectangle.setBounds({
          north: parseFloat(locationCoordinates.maxlatitude, 10),
          south: parseFloat(locationCoordinates.minlatitude, 10),
          east : parseFloat(locationCoordinates.maxlongitude, 10),
          west : parseFloat(locationCoordinates.minlongitude, 10)
        });
      } else {
        this.rectangle = new google.maps.Rectangle({
          strokeColor: '#333333',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#CCCCCC',
          fillOpacity: 0.35,
          map: this.map,
          bounds: {
            north: parseInt(locationCoordinates.maxlatitude, 10),
            south: parseInt(locationCoordinates.minlatitude, 10),
            east : parseInt(locationCoordinates.maxlongitude, 10),
            west : parseInt(locationCoordinates.minlongitude, 10)
          }
        });
      }
    },

    initGoogleMap: function() {
      var myCenter = new google.maps.LatLng(this.getLatitude(), this.getLongitude());

      var mapProp = {
        center:    myCenter,
        zoom:      3,
        mapTypeId: google.maps.MapTypeId.HYBRID
      };

      this.map = new google.maps.Map(this.$el.get(0), mapProp);
      this.configureDrawingManager();
    },

    configureDrawingManager: function() {
      this.drawingManager = new google.maps.drawing.DrawingManager();
      this.drawingManager.setOptions({
        drawingMode : google.maps.drawing.OverlayType.RECTANGLE,
        drawingControl : true,
        drawingControlOptions : {
          position : google.maps.ControlPosition.TOP_CENTER,
          drawingModes : [ google.maps.drawing.OverlayType.RECTANGLE ]
        } ,
        rectangleOptions: {
          strokeColor: '#333333',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#CCCCCC',
          fillOpacity: 0.35,
          editable: false,
          draggable: false,
          map: this.map
        }
      });
      this.drawingManager.setMap(this.map);

      var self = this;

      // adding listener for ready drawing rectangle
      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function(event) {
        if (event.type == google.maps.drawing.OverlayType.RECTANGLE) {
          if(self.rectangle !== null) {
            self.rectangle.setMap(null);
          }
          self.rectangle = event.overlay;

          var bounds = self.rectangle.getBounds();
          var newCoordinates = {
            'minlongitude': bounds.getSouthWest().lng(),
            'maxlongitude': bounds.getNorthEast().lng(),
            'minlatitude': bounds.getSouthWest().lat(),
            'maxlatitude': bounds.getNorthEast().lat()
          };
          _events.bus.trigger(_events.DRAWING_RECTANGLE_FINISHED, newCoordinates);
          self.drawingManager.setDrawingMode(null);
        }
      });

      // set rectangle off, dragging on
      this.drawingManager.setDrawingMode(null);
    },

    getLongitude: function() {
      return this.location.longitude;
    },

    getLatitude: function() {
      return this.location.latitude;
    }

  });

})(EQ.Events);
