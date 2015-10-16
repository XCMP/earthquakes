var Utils = {

  formattedDate: function(dateObject) {
    return this.pad(dateObject.getDate(), 2)  + '-' + this.pad((dateObject.getMonth()+1), 2) + '-' + dateObject.getFullYear();
  },

  /* TODO
    All times use ISO8601 Date/Time format. Unless a timezone is specified, UTC is assumed. Examples:
      2015-10-14, Implicit UTC timezone, and time at start of the day (00:00:00)
      2015-10-14T19:54:09, Implicit UTC timezone.
      2015-10-14T19:54:09+00:00, Explicit timezone.
  */
  formattedIsoDate: function(dateString) {
    if (dateString.length != 10) {
      return '';
    } else {
      return dateString.slice(6, 10) + '-' + dateString.slice(3, 5) + '-' + dateString.slice(0, 2);
    }
  },

  pad: function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
};