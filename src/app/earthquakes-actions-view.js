EQ.ActionsView = Backbone.View.extend({

  el: '#eq-actions',
  
  template: Handlebars.templates['earthquakes-actions.hbs'],

  events : {
    'click button.getData'        : 'getData',
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
    this.initData();
  },

  initData: function() {
    var d = new Date();
    d.setDate(d.getDate()-30);
    this.$startDate.val(Utils.formattedDate(d));
    this.$minLongitude.val('-25');
    this.$maxLongitude.val('40');
    this.$minLatitude.val('35');
    this.$maxLatitude.val('72');
  },

  getData: function() {
    var params = {
      reset: true,
      data: {
       'starttime': Utils.formattedIsoDate(this.$startDate.val()),
        'endtime': Utils.formattedIsoDate(this.$endDate.val()),
        'minlongitude': this.$minLongitude.val(),
        'maxlongitude': this.$maxLongitude.val(),
        'minlatitude': this.$minLatitude.val(),
        'maxlatitude': this.$maxLatitude.val()
      }
    };
    EQ.eventBus.trigger('getData', params);
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
