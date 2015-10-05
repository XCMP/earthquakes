var EarthQuakesView = Backbone.View.extend({

  el: '#eq-list',

  template: Handlebars.templates['earthquakes.hbs'],

  events : {
    'click button.toggleMarker' : 'toggleMarker'
   },

  initialize: function(){
    eventBus.on('scrollToSelectedEarthquake', this.scrollToSelectedEarthquake, this);

    this.collection.on('sync', this.render, this);

    this.collection.fetch();
  },

  toggleMarker: function(event) {
    var $el = $(event.currentTarget);
    var selectedEqId = $el.data('eq-id');
    this.clearSelected();
    $('#'+selectedEqId).addClass('eq-selected');
    eventBus.trigger('toggleMarker', selectedEqId);
  },

  scrollToSelectedEarthquake: function(eqId) {
    var $el = $("#"+eqId);
    $('body').animate({
        scrollTop: $el.offset().top - 3
      }, 'slow');
    this.clearSelected();
    $el.addClass('eq-selected');
  },

  clearSelected: function() {
    $('#eq-list>div').removeClass('eq-selected');
  },

  render: function() {
    this.$el.html(this.template({earthQuakes: this.collection.toJSON()}));
    return this;
  }

});
