(function (_events) {

  EQ.Views.EarthQuakesView = Backbone.View.extend({

    el: '#eq-list',

    template: Handlebars.templates['earthquake-list.hbs'],

    filteredCollection: null,

    events : {
      'click button.toggleMarker' : 'toggleMarker'
     },

    initialize: function(){
      _events.bus.on(_events.EQ_SELECTED, this.scrollToSelectedEarthquake, this);
      _events.bus.on(_events.SEARCH, this.search, this);
      _events.bus.on(_events.FETCH_DATA, this.fetchData, this);
      
      this.collection.on('sync', this.render, this);
      this.init();
    },

    init: function() {
      this.filteredCollection = this.collection;
    },

    fetchData: function(params) {
      this.$el.html('<img src="images/loading.gif"/>');
      var self = this;
      this.filteredCollection.fetch(params).done(
        function() {
          self.render();
        }
      );
      _events.bus.trigger(_events.FILTERED, this.filteredCollection);
    },

    toggleMarker: function(event) {
      var $el = $(event.currentTarget);
      var selectedEqId = $el.data('eq-id');
      this.clearSelected();
      $('#'+selectedEqId).addClass('eq-selected');
      _events.bus.trigger(_events.TOGGLE_MARKER, selectedEqId);
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

})(EQ.Events);
