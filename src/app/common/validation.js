EQ.validation = {

    /*
      errors is expected to be an array of error messages.
      returning empty array means no errors.
    */
    validateCoordinates: function(coordinates, errors) {
      if (coordinates.minlongitude < -180 || coordinates.minlongitude > 180) {
        errors.messages.push('Min longitude must be  between -180 and 180');
        errors.fields.minlongitude = true;
      }
      if (coordinates.maxlongitude < -180 || coordinates.maxlongitude > 180) {
        errors.messages.push('Max longitude must be  between -180 and 180');
        errors.fields.maxlongitude = true;
      }
      if (coordinates.minlatitude < -85 || coordinates.minlatitude > 85) {
        errors.messages.push('Min latitude must be  between -85 and 85');
        errors.fields.minlatitude = true;
      }
      if (coordinates.maxlatitude < -85 || coordinates.maxlatitude > 85) {
        errors.messages.push('Max latitude must be  between -85 and 85');
        errors.fields.maxlatitude = true;
      }
      if (coordinates.minlongitude > coordinates.maxlongitude) {
        errors.messages.push('Min longitude must be less than max longitude');
        errors.fields.minlongitude = true;
        errors.fields.maxlongitude = true;
      }
      if (coordinates.minlatitude > coordinates.maxlatitude) {
        errors.messages.push('Max latitude must be less than max latitude');
        errors.fields.minlatitude = true;
        errors.fields.maxlatitude = true;
      }
      return errors;
    },

    validateTimes: function(times, errors) {
      if (new Date(times.starttime).toString() === 'Invalid Date') {
        errors.messages.push('Start date not a valid date');
        errors.fields.starttime = true;
      }
      if (times.endtime && new Date(times.endtime).toString() === 'Invalid Date') {
        errors.messages.push('End date not a valid date');
        errors.fields.endtime = true;
      }
      if (!times.starttime && !times.endtime ) {
        errors.messages.push('Start date and end date cannot both be empty');
        errors.fields.starttime = true;
        errors.fields.endtime = true;
      }
      if (times.starttime > times.endtime && times.endtime) {
        errors.messages.push('Start date cannot be later than end date');
        errors.fields.starttime = true;
        errors.fields.endtime = true;
      }
      return errors;
    }

};