const assign = Object.assign;

const AppDispatcher = new Flux.Dispatcher();

const keyMirror = function (obj) {
  let ret = {};

  if (typeof obj === 'object') {
    for (let key in obj) {
      if ( obj.hasOwnProperty( key ) ) {
        ret[key] = key;
      }
    }
  }

  return ret;
}

const ActionTypes = keyMirror({
  LOADED_RAW_WORKOUTS: 0,
  SELECT_WORKOUT: 0,
  LOADED_RAW_WORKOUT: 0
});

const WorkoutActionsCreators = {
  loadedWorkouts ( rawData ) {
    AppDispatcher.dispatch({
      type: ActionTypes.LOADED_RAW_WORKOUTS,
      rawData: rawData
    });
  },
  selectWorkoutByInd ( ind ) {
    AppDispatcher.dispatch({
      type: ActionTypes.SELECT_WORKOUT,
      rawData: {ind: ind}
    });
  },
  loadedWorkout ( rawData ) {
    AppDispatcher.dispatch({
      type: ActionTypes.LOADED_RAW_WORKOUT,
      rawData: rawData
    });
  }
}

const CHANGE_EVENT = "change";

const _WorkoutsState = {
  raceShift: null, // NOTE: this is a derived data, depends on LASTWORKOUTTARGETDATE and last workout in workoutDates in its.
  LASTWORKOUTTARGETDATE: moment("2016-06-19T00:00:00"), //TODO: select with a day picker
  workoutsDates: [],
  selectedWorkoutInd: null,
  selectedWorkout: null
};

var WorkoutsStore = assign({}, EventEmitter.prototype, {
  emitChange () {
    this.emit( CHANGE_EVENT );
  },
  addChangeListener ( callback ) {
    this.on( CHANGE_EVENT, callback );
  },
  removeChangeListener ( callback ) {
    this.removeListener( CHANGE_EVENT, callback );
  },
  getWorkoutsDates () {
    return _WorkoutsState.workoutsDates;
  },
  getSelectedWorkoutInd () {
    return _WorkoutsState.selectedWorkoutInd;
  },
  getSelectedWorkout () {
    return _WorkoutsState.selectedWorkout;
  },
  selectTodayOrNextWorkout () {
    let today = moment(moment().format('YYYY-MM-DD')).format('x');
    let workoutsDates = _WorkoutsState.workoutsDates;
    let i = workoutsDates.length - 1;
    let workoutDate, nearestWorkout;

    while ( i >= 0 && !nearestWorkout ) {
      workoutDate = workoutsDates[i];
      if ( moment(workoutDate.scheduledDate).format('x') >= today ) {
        nearestWorkout = workoutDate;
      }
      i--;
    }

    WorkoutActionsCreators.selectWorkoutByInd( nearestWorkout && nearestWorkout.workoutInd || 0 );
  }
});

WorkoutsStore.dispatchToken = AppDispatcher.register( function ( action ) {
  let data = action.rawData;
  let lastWorkout;

  switch ( action.type ) {
    case ActionTypes.LOADED_RAW_WORKOUTS:
      let workoutsDates = data.workoutsDates;
      let loadnext = data.loadnext;

      lastWorkout = workoutsDates[0];
      _WorkoutsState.raceShift = moment(_WorkoutsState.LASTWORKOUTTARGETDATE).diff(lastWorkout.scheduledDate);

      _.each(workoutsDates, function(workoutDate) {
        workoutDate.scheduledDate = moment(moment(workoutDate.scheduledDate).toDate().getTime() + _WorkoutsState.raceShift, 'x');
      });

      _WorkoutsState.workoutsDates = workoutsDates;
      WorkoutsStore.emitChange();

      if ( data.loadnext ) {
        _.defer( () =>  WorkoutsStore.selectTodayOrNextWorkout() );
      }
      break;

    case ActionTypes.LOADED_RAW_WORKOUT:
      data.scheduledDate = moment(moment(data.scheduledDate).toDate().getTime() + _WorkoutsState.raceShift, 'x');
      _WorkoutsState.selectedWorkout = data;
      WorkoutsStore.emitChange();
      break;

    case ActionTypes.SELECT_WORKOUT:
      _WorkoutsState.selectedWorkoutInd = data.ind;
      WebApiUtils.getWorkout( data.ind );
      WorkoutsStore.emitChange();
      break;
    default:
      // do nothing
  }
});


const  WebApiUtils = {
  urls: {
    workouts: "/api/workouts"
  },
  getAllWorkouts ( loadnext = false ) {
    $.ajax({
      url: this.urls.workouts,
      dataType: 'json',
      cache: false,
      success: function ( data ) {
        WorkoutActionsCreators.loadedWorkouts( { workoutsDates: data, loadnext: loadnext } );
      },
      error: function(xhr, status, err) {
        // TODO: trigger error action
      }
    });
  },
  getWorkout ( workoutInd ) {
    $.ajax({
      url: `${this.urls.workouts}/${workoutInd}`,
      dataType: 'json',
      cache: false,
      success: function(data) {
        WorkoutActionsCreators.loadedWorkout( data );
      },
      error: function(xhr, status, err) {
        // TODO: trigger error action
      }
    });
  }
}


const DATEFORMAT = 'ddd DD of MMM of YYYY';
const TODAY = moment().format (DATEFORMAT );
const
  Helpers = {
    secondsTosHHMMSS ( seconds ) {
      let
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
};console.log('D: GULP TEST *******************************');
