var ButtonsView = Backbone.View.extend({

  el: '#eq-actions',
  
  events : {
    'click button.showAllMarkers' : 'showAllMarkers',
    'click button.hideAllMarkers' : 'hideAllMarkers'
   },

  initialize: function() {
  },

  showAllMarkers: function(ev) {
    eventBus.trigger("toggleAllMarkers", true);
  },

  hideAllMarkers: function(ev) {
    eventBus.trigger("toggleAllMarkers", false);
  },

});
