(function () {
  let
    WorkoutsStore = window.WorkoutsStore,
    DATEFORMAT = window.DATEFORMAT,
    TODAY = window.TODAY,
    Helpers = window.Helpers;

  let getStateFromStores = function () {
    return {
      workoutsDates: WorkoutsStore.getWorkoutsDates(),
      selectedWorkoutInd: WorkoutsStore.getSelectedWorkoutInd(),
      selectedWorkout: WorkoutsStore.getSelectedWorkout()
    };
  };

  let WorkoutsPage = React.createClass({
    getInitialState () {
      return getStateFromStores()
    },
    _onChange () {
      this.setState(getStateFromStores());
    },
    componentDidMount () {
      WorkoutsStore.addChangeListener(this._onChange);
    },
    render () {
      return (
        <div>
          <WorkoutsNavbar />
          <div className="container-fluid">
            <div className="row" >
              <WorkoutsSidebarContainer workoutsDates={this.state.workoutsDates} selectedWorkoutInd={this.state.selectedWorkoutInd}/>
              <MainContent selectedWorkout={this.state.selectedWorkout} />
            </div>
          </div>
        </div>
      );
    }
  });

  let WorkoutsNavbar = function () {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Running Traning (React Inside)</a>
          </div>
          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Settings</a></li>
              <li><a href="#">Profile</a></li>
              <li><a href="#">Help</a></li>
            </ul>
            <form className="navbar-form navbar-right">
              <input type="text" className="form-control" placeholder="Search..."/>
            </form>
          </div>
        </div>
      </nav>
    );
  }

  let WorkoutsSidebarContainer = React.createClass({
    _onChange () {
      var selectedWorkoutInd = getStateFromStores().selectedWorkoutInd;
      this.changeWorkoutSelected( selectedWorkoutInd );
    },
    componentDidMount () {
      WorkoutsStore.addChangeListener(this._onChange);
    },
    changeWorkoutSelected (ind) {
      let
        el = ReactDOM.findDOMNode(this),
        $el = $(el),
        $activeDate = $el.find(`.date-${ind}`),
        activeDateEle = $activeDate[0];

      if (activeDateEle) {
        let top = activeDateEle.offsetTop;
        let height = $el.height();

        $el.scrollTop( top - height/2);
      }
    },
    render () {
      let
        props = {
          workoutsDates: this.props.workoutsDates,
          selectedWorkoutInd: this.props.selectedWorkoutInd
        };

      return (<WorkoutsSidebar {...props} />);
    }
  });

  let WorkoutsSidebar =  function (props) {
    return (
      <div className="col-sm-3 col-md-2 sidebar">
        <WorkoutsListContainer workoutsDates={props.workoutsDates} selectedWorkoutInd={props.selectedWorkoutInd}/>
      </div>
    );
  }

  let WorkoutDate = React.createClass({
    onClick () {
      this.props.onClick( this.props.ind );
    },
    render () {
      return (
        <li className={`${this.props.active? "active " : ""}${this.props.classToAdd}`}><a onClick={this.onClick} >{moment(this.props.scheduledDate).format(DATEFORMAT)}</a></li>
      );
    }
  });

  let WorkoutActionsCreators = window.WorkoutActionsCreators;

  let WorkoutsListContainer = React.createClass({
    changeWorkout ( ind ) {
      WorkoutActionsCreators.selectWorkoutByInd(ind);
    },
    render () {
      return (
        <WorkoutsList
          workoutsDates={this.props.workoutsDates}
          selectedWorkoutInd={this.props.selectedWorkoutInd}
          changeWorkout={this.changeWorkout}
          />
        );
      }
  });


  let WorkoutsList = function (props) {
    let
      selectedWorkoutInd = props.selectedWorkoutInd,
      changeWorkout = props.changeWorkout,
      workoutsDates = props.workoutsDates.map( function ( workoutDate ) {
        let
          props = {
            scheduledDate: workoutDate.scheduledDate,
            key: workoutDate.workoutInd,
            active: selectedWorkoutInd === workoutDate.workoutInd,
            ind: workoutDate.workoutInd,
            classToAdd: `date-${workoutDate.workoutInd}`,
            onClick: changeWorkout.bind(null, workoutDate.workoutInd)
          };

        return (
          <WorkoutDate {...props} />
        );
      });

    return (
      <ul className="nav nav-sidebar">
        {workoutsDates}
      </ul>
    );
  };


  let MainContent = function (props) {
    let
      detail;

    if (props.selectedWorkout != null) {
      detail = <WorkoutDetail selectedWorkout={props.selectedWorkout} />
    } else {
      detail = <EmptyWorkoutDetail />
    }

    return (
      <div>
        {detail}
      </div>
    );
  }


  let EmptyWorkoutDetail = function () {
    return (
      <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        Empty
      </div>
    );
  }


  let WorkoutDetail = function (props) {
    let
      workoutIntervals = props.selectedWorkout.intervals,
      totalTime = workoutIntervals.reduce( function (memo, wi) { return wi.totalTimeInZone + memo;}, 0 ),
      titleDate = moment(props.selectedWorkout.scheduledDate).format(DATEFORMAT),
      titleTime = totalTime,
      title = `${titleDate} , duration: ${Helpers.secondsTosHHMMSS(titleTime)}`;

    return (
      <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <WorkoutTitle workoutTitle={title} />
        <WorkoutIntervals workoutIntervals={workoutIntervals} />
      </div>
    );
  }


  let WorkoutTitle = function (props) {
    return (
      <h1 className="page-header">{props.workoutTitle}</h1>
    );
  }


  let WorkoutIntervals = function (props) {
    let
      firstOfTypes = {},
      totalTime = props.workoutIntervals.reduce( function (memo, wi) { return wi.totalTimeInZone + memo;}, 0 ),
      workoutIntervals = props.workoutIntervals.map( function (workoutInterval, ind) {
        let
          type = workoutInterval.intervalType + workoutInterval.totalTimeInZone + workoutInterval.miCoachZone;

        if ( typeof firstOfTypes[type] === 'undefined'  ) {
          firstOfTypes[type] = true;
          workoutInterval.firstOfType = true;
        } else {
          workoutInterval.firstOfType = false;
        }

        return (
          <WorkoutInterval workoutInterval={workoutInterval} proportionalWidth={workoutInterval.totalTimeInZone * 100 / totalTime} key={ind} />
        );
      });

    return (
      <div className="workout-intervals">
        {workoutIntervals}
      </div>
    );
  }


  var WorkoutInterval = function (props) {
    var
      workoutInterval = props.workoutInterval,
      intervalType = workoutInterval.intervalType,
      miCoachZone = workoutInterval.miCoachZone,
      time = Helpers.secondsTosHHMMSS(workoutInterval.totalTimeInZone);

    return (
      <div className={`workout-interval type-${intervalType}`} style={{width: `${props.proportionalWidth}%`}}>
          <div className={`zone zone-${miCoachZone}`} title={time}><span>{props.workoutInterval.firstOfType && time}</span></div>
      </div>
    );
  }

  $(document).ready(function(){
    ReactDOM.render(<WorkoutsPage  url="/api/workouts" />, document.getElementById('container'));
  });

  var WebApiUtils = window.WebApiUtils;
  WebApiUtils.getAllWorkouts( true );
}());
