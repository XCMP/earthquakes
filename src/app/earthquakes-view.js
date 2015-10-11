var EarthQuakesView = Backbone.View.extend({

  el: '#eq-list',

  template: Handlebars.templates['earthquakes.hbs'],

  filteredCollection: null,

  events : {
    'click button.toggleMarker' : 'toggleMarker'
   },

  initialize: function(){
    eventBus.on('scrollToSelectedEarthquake', this.scrollToSelectedEarthquake, this);
    eventBus.on('search', this.search, this);

    this.collection.on('sync', this.render, this);
    this.init();
  },

  init: function() {
    this.collection.fetch();
    this.search('');
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

  search: function(searchValue) {
    this.filteredCollection = this.collection.filterByPlace(searchValue);
    this.render();
  },

  clearSelected: function() {
    $('#eq-list>div').removeClass('eq-selected');
  },

  render: function() {
    var earthquakes = this.filteredCollection;
    this.$el.html(this.template({
      earthquakes: earthquakes.toJSON(),
      filtered: earthquakes.length,
      total: this.collection.length
    }));
    return this;
  }

});
