(function(_events, _utils, _validation){
  
  EQ.Views.ActionsView = Backbone.View.extend({

    el: '#eq-actions',
    
    template: Handlebars.templates['actions.hbs'],
    errors: {'messages': [], 'fields': {}},

    cachedQueryData: {
      dataChanged: false,
      times: {
        'starttimeFormatted' : _utils.getInitStarttime(),
        'endtimeFormatted'   : ''
      },
      coordinates: {
        'minlongitude': 0,
        'maxlongitude': 0,
        'minlatitude' : 0,
        'maxlatitude' : 0
      }
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
      this.processRequest();

      _events.bus.on(_events.DRAWING_RECTANGLE_FINISHED, this.processDrawing, this);
    },

    cacheElements: function() {
      this.$startDate = this.$('.startDate');
      this.$endDate = this.$('.endDate');
      this.$minLongitude = this.$('.minLongitude');
      this.$maxLongitude = this.$('.maxLongitude');
      this.$minLatitude = this.$('.minLatitude');
      this.$maxLatitude = this.$('.maxLatitude');
      this.$errorsContainer = this.$('.error-container');
      this.$errors = this.$errorsContainer.find('.errors-list');
    },

    processDrawing: function(data) {
      this.$minLongitude.val(data.minlongitude);
      this.$maxLongitude.val(data.maxlongitude);
      this.$minLatitude.val(data.minlatitude);
      this.$maxLatitude.val(data.maxlatitude);
      this.processRequest();
    },

    processRequest: function(ev) {
      if (ev) {
        ev.preventDefault();
      }

      this.setCachedData();
      this.validateData();

      if (!this.hasErrors()) {

        if (this.cachedQueryData.coordinatesChanged) {
          _events.bus.trigger(_events.COORDINATES_CHANGED, this.cachedQueryData.coordinates);
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
          _events.bus.trigger(_events.FETCH_DATA, params);
          this.cachedQueryData.dataChanged = false;
        }

      } else {
        
        this.render();

      }
    },

    setCachedData: function() {
      // coordinates
      var newCoordinates = {
        'minlongitude' : parseFloat(this.$minLongitude.val(), 10),
        'maxlongitude' : parseFloat(this.$maxLongitude.val(), 10),
        'minlatitude'  : parseFloat(this.$minLatitude.val(), 10),
        'maxlatitude'  : parseFloat(this.$maxLatitude.val(), 10)
      };
      if (!_.isEqual(this.cachedQueryData.coordinates, newCoordinates)) {
        this.cachedQueryData.coordinates = newCoordinates;
        this.cachedQueryData.dataChanged = true;
        this.cachedQueryData.coordinatesChanged = true;
      }

      // times
      var newTimes = {
        'starttimeFormatted' : this.$startDate.val(),
        'starttime'          : _utils.formattedIsoDate(this.$startDate.val()),
        'endtimeFormatted'   : this.$endDate.val(),
        'endtime'            : _utils.formattedIsoDate(this.$endDate.val())
      };
      if (!_.isEqual(this.cachedQueryData.times, newTimes)) {
        this.cachedQueryData.dataChanged = true;
        this.cachedQueryData.times = newTimes;
      }

    },

    validateData: function() {
      this.errors = {'messages': [], 'fields': {}};

      this.errors = _validation.validateCoordinates(this.cachedQueryData.coordinates, this.errors);
      this.errors = _validation.validateTimes(this.cachedQueryData.times, this.errors);

    },

    hasErrors: function() {
      return this.errors && this.errors.messages.length > 0;
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
      if (this.hasErrors()) {
        this.$el.html(this.template({
          errors: true,
          errorFields: this.errors.fields,
          errorMessages: this.errors.messages,
          data: this.cachedQueryData
        }));
      } else {
        this.$el.html(this.template({
          data: this.cachedQueryData
        }));
      }
      this.cacheElements();
      return this;
    }

  });

})(EQ.Events, EQ.utils, EQ.validation);
