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
    var selectedEqId = $(event.currentTarget).data('eq-id');
    eventBus.trigger("toggleMarker", selectedEqId);
  },

  scrollToSelectedEarthquake: function(eqId) {
    console.log('scroll to: ' + eqId);
    var $el = $("#"+eqId);
    $('body').animate({
        scrollTop: $el.offset().top - 3
      }, 'slow');
    $('#eq-list>div').removeClass('eq-selected');
    $el.addClass('eq-selected');
  },

  render: function() {
    this.$el.html(this.template({earthQuakes: this.collection.toJSON()}));
    return this;
  }

});
