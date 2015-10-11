var ButtonsView = Backbone.View.extend({

  el: '#eq-actions',
  
  template: Handlebars.templates['earthquakes-actions.hbs'],

  events : {
    'click button.showAllMarkers' : 'showAllMarkers',
    'click button.hideAllMarkers' : 'hideAllMarkers',
    'keyup input.searchField'     : 'search'
   },

  initialize: function() {
    this.render();
  },

  showAllMarkers: function(ev) {
    eventBus.trigger("toggleAllMarkers", true);
  },

  hideAllMarkers: function(ev) {
    eventBus.trigger("toggleAllMarkers", false);
  },

  search: function(ev) {
    eventBus.trigger("search", $(ev.currentTarget).val());
  },

  render: function() {
    this.$el.html(this.template());
  }

});
