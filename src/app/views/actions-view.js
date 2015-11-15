(function(_events, _utils, _validation){
  
  EQ.Views.ActionsView = Backbone.View.extend({

    el: '#eq-actions',
    
    template: Handlebars.templates['actions.hbs'],

    cachedQueryData: {
      dataChanged: false,
      times: {},
      coordinates: {}
    },

    events : {
      'click button.getData'        : 'processRequest',
      'submit'                      : 'processRequest',
      'blur form input[type=text]'  : 'setCachedData',
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
      this.$errorsContainer = $('.error-container');
      this.$errors = this.$errorsContainer.find('.errors-list');
      this.initQueryData();

      _events.bus.on(_events.DRAWING_FINISHED, this.processDrawing, this);
    },

    initQueryData: function() {
      var d = new Date();
      d.setDate(d.getDate()-30);
      this.$startDate.val(_utils.formattedDate(d));
      this.$minLongitude.val('0');
      this.$maxLongitude.val('0');
      this.$minLatitude.val('0');
      this.$maxLatitude.val('0');
      this.processRequest();
    },

    processDrawing: function(data) {
      this.$('.minLongitude').val(data.minlongitude);
      this.$('.maxLongitude').val(data.maxlongitude);
      this.$('.minLatitude').val(data.minlatitude);
      this.$('.maxLatitude').val(data.maxlatitude);
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
        'minlongitude': parseFloat(this.$('.minLongitude').val(), 10),
        'maxlongitude': parseFloat(this.$('.maxLongitude').val(), 10),
        'minlatitude': parseFloat(this.$('.minLatitude').val(), 10),
        'maxlatitude': parseFloat(this.$('.maxLatitude').val(), 10)
      };
      var errors = {'messages': [], 'fields': {}};
      errors = _validation.validateCoordinates(newCoordinates, errors);

      // times
      var newTimes = {
        'starttimeFormatted' : this.$('.startDate').val(),
        'starttime' : _utils.formattedIsoDate(this.$('.startDate').val()),
        'endtimeFormatted'   : this.$('.endDate').val(),
        'endtime'   : _utils.formattedIsoDate(this.$('.endDate').val())
      }
      errors = _validation.validateTimes(newTimes, errors);

      if (!_.isEqual(this.cachedQueryData.coordinates, newCoordinates)) {
        this.cachedQueryData.coordinates = newCoordinates;
        this.cachedQueryData.dataChanged = true;
        this.cachedQueryData.coordinatesChanged = true;
      }

      if (!_.isEqual(this.cachedQueryData.times, newTimes)) {
        this.cachedQueryData.dataChanged = true;
        this.cachedQueryData.times = newTimes;
      }

      this.render(errors);
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

    render: function(errors) {
      if (errors && errors.messages.length > 0) {
        this.$el.html(this.template({
          errors: true,
          errorFields: errors.fields,
          errorMessages: errors.messages,
          data: this.cachedQueryData
        }));
      } else {
        this.$el.html(this.template({
          data: this.cachedQueryData
        }));
      }
    }

  });

})(EQ.Events, EQ.utils, EQ.validation);
