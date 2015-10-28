EQ.ActionsView = Backbone.View.extend({

  el: '#eq-actions',
  
  template: Handlebars.templates['earthquakes-actions.hbs'],

  cachedQueryData: {
    dataChanged: false,
    times: {},
    coordinates: {}
  },

  events : {
    'click button.getData'        : 'triggerGetData',
    'submit'                      : 'triggerGetData',
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
    this.$ = $('.endDate');
    this.initQueryData();
  },

  initQueryData: function() {
    var d = new Date();
    d.setDate(d.getDate()-30);
    this.$startDate.val(Utils.formattedDate(d));
    this.$minLongitude.val('-25');
    this.$maxLongitude.val('40');
    this.$minLatitude.val('35');
    this.$maxLatitude.val('72');
    this.triggerGetData();
  },

  triggerGetData: function(ev) {
    if (ev) ev.preventDefault();
    this.setCachedData();
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
      EQ.eventBus.trigger('getData', params);
      this.cachedQueryData.dataChanged = false;
    }
  },

  setCachedData: function() {
    var newCoordinates = {
      'minlongitude': this.$minLongitude.val(),
      'maxlongitude': this.$maxLongitude.val(),
      'minlatitude': this.$minLatitude.val(),
      'maxlatitude': this.$maxLatitude.val()
    };
    if (!_.isEqual(this.cachedQueryData.coordinates, newCoordinates)) {
      this.cachedQueryData.dataChanged = true;
      this.cachedQueryData.coordinates = newCoordinates;
      EQ.eventBus.trigger('locationChanged', this.cachedQueryData.coordinates);
    }
    var newTimes = {
      'starttime': Utils.formattedIsoDate(this.$startDate.val()),
      'endtime': Utils.formattedIsoDate(this.$endDate.val())
    }
    if (!_.isEqual(this.cachedQueryData.times, newTimes)) {
      this.cachedQueryData.dataChanged = true;
      this.cachedQueryData.times = newTimes;
    }
  },

  showAllMarkers: function(ev) {
    EQ.eventBus.trigger('toggleAllMarkers', true);
  },

  hideAllMarkers: function(ev) {
    EQ.eventBus.trigger('toggleAllMarkers', false);
  },

  reset: function(ev) {
    location.reload();
  },

  search: function(ev) {
    EQ.eventBus.trigger('search', $(ev.currentTarget).val());
  },

  render: function() {
    this.$el.html(this.template());
  }

});
