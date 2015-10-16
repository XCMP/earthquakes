var ButtonsView = Backbone.View.extend({

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
    this.initData();
  },

  initData: function() {
    var d = new Date();
    d.setDate(d.getDate()-30);
    this.$startDate.val(Utils.formattedDate(d));
  },

  getData: function() {
    var params = {
      reset: true,
      data: {
       'starttime': Utils.formattedIsoDate(this.$startDate.val()),
        'endtime': Utils.formattedIsoDate(this.$endDate.val())
      }
    }
    eventBus.trigger('getData', params);
  },

  showAllMarkers: function(ev) {
    eventBus.trigger('toggleAllMarkers', true);
  },

  hideAllMarkers: function(ev) {
    eventBus.trigger('toggleAllMarkers', false);
  },

  reset: function(ev) {
    location.reload();
  },

  search: function(ev) {
    eventBus.trigger('search', $(ev.currentTarget).val());
  },

  render: function() {
    this.$el.html(this.template());
  }

});
