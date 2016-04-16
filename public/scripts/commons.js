var EventEmitter = {
    _events: {},
    dispatch: function (event, data) {
        if (!this._events[event]) return; // no one is listening to this event
        for (var i = 0; i < this._events[event].length; i++)
            this._events[event][i](data);
    },
    subscribe: function (event, callback) {
      if (!this._events[event]) this._events[event] = []; // new event
      this._events[event].push(callback);
    }
};

var DATEFORMAT = 'ddd DD of MMM of YYYY';
var TODAY = moment().format(DATEFORMAT);
var
  Helpers = {
    secondsTosHHMMSS: function ( seconds ) {
      var
        hours = Math.floor( seconds / 3600 ),
        minutes = Math.floor( seconds / 60 ),
        secs = seconds,
        time = '';

      if ( hours ) {
        time += '0' + hours + ':';
        minutes = minutes - hours * 60;
      } else {
        time += '00:';
      }

      if ( minutes ) {
        time += ((minutes < 10 ) ? '0': '') + minutes + ':';
      } else {
        time += '00:';
      }

      secs = secs - 3600 * hours - 60 * minutes;

      time+=  ((secs < 10 ) ? '0': '') + secs;

      return time;
    }
};