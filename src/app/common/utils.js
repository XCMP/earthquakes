EQ.utils = {

  formattedDate: function(dateObject) {
    return this.pad(dateObject.getDate(), 2)  + '-' + this.pad((dateObject.getMonth()+1), 2) + '-' + dateObject.getFullYear();
  },

  formattedIsoDate: function(dateString) {
    if (dateString.length != 10) {
      return '';
    } else {
      return dateString.slice(6, 10) + '-' + dateString.slice(3, 5) + '-' + dateString.slice(0, 2) + 'T00:00:00' + this.timezoneOffset();
    }
  },

  getInitStarttime: function() {
    var d = new Date();
    d.setDate(d.getDate() - 30);
    return this.formattedDate(d);
  },

  timezoneOffset: function() {
    var timezoneOffsetInMinutes = new Date().getTimezoneOffset();
    var sign = timezoneOffsetInMinutes > 0 ? '-' : '+';
    timezoneOffsetInMinutes = Math.abs(timezoneOffsetInMinutes);
    var hours = Math.floor(timezoneOffsetInMinutes / 60);
    var minutes = timezoneOffsetInMinutes % 60;
    return sign + this.pad(hours, 2) + ':' + this.pad(minutes, 2);
  },

  pad: function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

};