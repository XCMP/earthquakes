var EarthQuakesView = Backbone.View.extend({

  el: '#eq-list',

  template: Handlebars.templates['earthquakes.hbs'],

  events : {
    'click a.toggleMarker' : 'toggleMarker'
   },

  initialize: function(){
    this.collection.on('sync', this.render, this);

    this.collection.fetch();
  },

  toggleMarker: function(event) {
    var selectedEqId = $(event.currentTarget).data('eq-id');
    eventBus.trigger("toggleMarker", selectedEqId);
  },

  render: function() {
    this.$el.html(this.template({earthQuakes: this.collection.toJSON()}));
    return this;
  }

});
