(function(_events, _utils){
  
  EQ.Views.ActionsView = Backbone.View.extend({

    el: '#eq-actions',
    
    template: Handlebars.templates['earthquakes-actions.hbs'],

    cachedQueryData: {
      dataChanged: false,
      times: {},
      coordinates: {}
    },

    events : {
      'click button.getData'        : 'processRequest',
      'submit'                      : 'processRequest',
      'click button.showAllMarkers' : 'showAllMarkers',
      'click button.hideAllMarkers' : 'hideAllMarkers',
      'click button.reset'          : 'reset',
      'keyup input.searchField'     : 'search'
     },

    initialize: function() {
      this.render();
      this.$startDate = $('.startDate');
      this.$endDate = $('.endDate');
      this.$minLongitude = $('.minLongitude');
      this.$maxLongitude = $('.maxLongitude');
      this.$minLatitude = $('.minLatitude');
      this.$maxLatitude = $('.maxLatitude');
      this.initQueryData();
    },

    initQueryData: function() {
      var d = new Date();
      d.setDate(d.getDate()-30);
      this.$startDate.val(_utils.formattedDate(d));
      this.$minLongitude.val('-25');
      this.$maxLongitude.val('40');
      this.$minLatitude.val('35');
      this.$maxLatitude.val('72');
      this.processRequest();
    },

    processRequest: function(ev) {
      if (ev) {
        ev.preventDefault();
      }
      this.setCachedData();
      
      if (this.cachedQueryData.coordinatesChanged) {
        _events.bus.trigger(_events.LOCATION_CHANGED, this.cachedQueryData.coordinates);
        this.cachedQueryData.coordinatesChanged = false;
      }
      if (this.cachedQueryData.dataChanged) {
        var c = this.cachedQueryData.coordinates, t = this.cachedQueryData.times;
        var params = {
          reset: true,
          data: {
            'starttime'   : t.starttime,
            'endtime'     : t.endtime,
            'minlongitude': c.minlongitude,
            'maxlongitude': c.maxlongitude,
            'minlatitude' : c.minlatitude,
            'maxlatitude' : c.maxlatitude
          }
        };
        _events.bus.trigger(_events.GET_DATA, params);
        this.cachedQueryData.dataChanged = false;
      }
    },

    setCachedData: function() {
      // coordinates
      var newCoordinates = {
        'minlongitude': this.$minLongitude.val(),
        'maxlongitude': this.$maxLongitude.val(),
        'minlatitude': this.$minLatitude.val(),
        'maxlatitude': this.$maxLatitude.val()
      };
      if (!_.isEqual(this.cachedQueryData.coordinates, newCoordinates)) {
        this.cachedQueryData.coordinates = newCoordinates;
        this.cachedQueryData.dataChanged = true;
        this.cachedQueryData.coordinatesChanged = true;
      }

      // times
      var newTimes = {
        'starttime' : _utils.formattedIsoDate(this.$startDate.val()),
        'endtime'   : _utils.formattedIsoDate(this.$endDate.val())
      }
      if (!_.isEqual(this.cachedQueryData.times, newTimes)) {
        this.cachedQueryData.dataChanged = true;
        this.cachedQueryData.times = newTimes;
      }
    },

    showAllMarkers: function(ev) {
      _events.bus.trigger(_events.TOGGLE_ALL_MARKERS, true);
    },

    hideAllMarkers: function(ev) {
      _events.bus.trigger(_events.TOGGLE_ALL_MARKERS, false);
    },

    reset: function(ev) {
      location.reload();
    },

    search: function(ev) {
      _events.bus.trigger(_events.SEARCH, $(ev.currentTarget).val());
    },

    render: function() {
      this.$el.html(this.template());
    }

  });

})(EQ.Events, EQ.utils);
