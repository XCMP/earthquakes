EQ.validation = {

    /*
      errors is expected to be an array of error messages.
      returning empty array means no errors.
    */
    validateCoordinates: function(coordinates, errors) {
      if (coordinates.minlongitude < -180 || coordinates.minlongitude > 180) {
        errors.push('Min longitude must be  between -180 and 180');
      }
      if (coordinates.maxlongitude < -180 || coordinates.maxlongitude > 180) {
        errors.push('Max longitude must be  between -180 and 180');
      }
      if (coordinates.minlatitude < -85 || coordinates.minlatitude > 85) {
        errors.push('Min latitude must be  between -85 and 85');
      }
      if (coordinates.maxlatitude < -85 || coordinates.maxlatitude > 85) {
        errors.push('Max latitude must be  between -85 and 85');
      }
      if (coordinates.minlongitude > coordinates.maxlongitude) {
        errors.push('Min longitude must be less than max longitude');
      }
      if (coordinates.minlatitude > coordinates.maxlatitude) {
        errors.push('Max latitude must be less than max latitude');
      }
      return errors;
    },

    validateTimes: function(times, errors) {
      if (new Date(times.starttime).toString() === 'Invalid Date') {
        errors.push('Start date not a valid date');
      }
      if (times.endtime && new Date(times.endtime).toString() === 'Invalid Date') {
        errors.push('End date not a valid date');
      }
      if (!times.starttime && !times.endtime ) {
        errors.push('Start date and end date cannot both be empty');
      }
      if (times.starttime > times.endtime && times.endtime) {
        errors.push('Start date cannot be later than end date');
      }
      return errors;
    }

};