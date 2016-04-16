(function () {
var
  EventEmitter = window.EventEmitter,
  DATEFORMAT = window.DATEFORMAT,
  TODAY = window.TODAY,
  Helpers = window.Helpers,
  LASTWORKOUTTARGETDATE = moment("2016-04-09T00:00:00");


var WorkoutsPage = React.createClass({
  getInitialState: function() {
    return {
      workoutsDates: [],
      selectedWorkout: null,
      selectedWorkoutInd: null
    };
  },
  loadWorkoutDetail: function (workoutInd) {
    this.setState({selectedWorkoutInd: workoutInd});

    $.ajax({
      url: this.props.url + '/' + workoutInd,
      dataType: 'json',
      cache: false,
      success: function(data) {
        data.scheduledDate = moment(moment(data.scheduledDate).toDate().getTime() + this.state.raceShift, 'x');
        this.setState({selectedWorkout: data})
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.detailUrl, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    EventEmitter.subscribe( 'onSelectWorkout', this.loadWorkoutDetail );

    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        var lastWorkout = data[0];
        var raceShift = moment(LASTWORKOUTTARGETDATE).diff(lastWorkout.scheduledDate);
        _.each(data, function(workoutDate) {
          workoutDate.scheduledDate = moment(moment(workoutDate.scheduledDate).toDate().getTime() + raceShift, 'x');
        });

        this.setState({workoutsDates: data, raceShift: raceShift});
        var nearestWorkoutInd = this.findTodayOrNextWorkout()
        this.loadWorkoutDetail(nearestWorkoutInd);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  findTodayOrNextWorkout: function () {
    var today = moment(moment().format('YYYY-MM-DD')).format('x');
    var workoutsDates = this.state.workoutsDates;
    var i = workoutsDates.length - 1;
    var workoutDate, nearestWorkout;

    while ( i >= 0 && !nearestWorkout ) {
      workoutDate = workoutsDates[i];
      if ( moment(workoutDate.scheduledDate).format('x') >= today ) {
        nearestWorkout = workoutDate;
      }
      i--;
    }

    return nearestWorkout && nearestWorkout.workoutInd || 0;
  },
  render: function () {
    return (
      <div>
        <WorkoutsNavbar />
        <div className="container-fluid">
          <div className="row" >
            <WorkoutsSidebar workoutsDates={this.state.workoutsDates} selectedWorkoutInd={this.state.selectedWorkoutInd}/>
            <MainContent selectedWorkout={this.state.selectedWorkout} />
          </div>
        </div>
      </div>
    );
  }
});

var WorkoutsNavbar = React.createClass({
  render: function () {
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
            <a className="navbar-brand" href="#">Project name</a>
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
});

var WorkoutsSidebar = React.createClass({
  changeWorkoutSelected: function ( top ) {
    var
      el = ReactDOM.findDOMNode(this),
      $el = $(el),
      height = $el.height();

    console.log( "D: changeWorkoutSelected", top)
    $el.scrollTop( top + height/2);
  },
  componentDidMount: function () {
    EventEmitter.subscribe( 'onToDateScroll', this.changeWorkoutSelected );
  },
  render: function () {
    return (
      <div className="col-sm-3 col-md-2 sidebar">
        <WorkoutsList workoutsDates={this.props.workoutsDates} selectedWorkoutInd={this.props.selectedWorkoutInd}/>
      </div>
    );
  }
});

var WorkoutDate = React.createClass({
  onClick: function () {
    this.props.onClick( this.props.ind );
  },
  render: function () {
    return (
      <li className={this.props.active ? "active" : ""}><a onClick={this.onClick} >{moment(this.props.scheduledDate).format(DATEFORMAT)}</a></li>
    );
  }
});

var WorkoutsList = React.createClass({
  getInitialState: function () {
    return {selectedWorkoutInd: ''};
  },
  changeWorkout: function ( ind ) {
    console.log( "D: componentDidUpdate", this.props);
    console.log("changeWorkout", ind, arguments);
    this.setState({ selectedWorkoutInd: ind });
    EventEmitter.dispatch( 'onSelectWorkout', ind);
  },
  componentDidUpdate: function () {
    var
      dateRef = this.refs[ "date15"],
      dateNode = ReactDOM.findDOMNode(dateRef),
      $current = $(dateNode);

    EventEmitter.dispatch( 'onToDateScroll', $current.offset().top );
  },
  render: function () {
    var
      selectedWorkoutInd = this.props.selectedWorkoutInd,
      workoutsDates = this.props.workoutsDates.map( function ( workoutDate, ind ) {
        return (
          <WorkoutDate
            ref={"date" + ind}
            scheduledDate={workoutDate.scheduledDate}
            key={ind}
            active={selectedWorkoutInd === ind}
            ind={ind}
            onClick={this.changeWorkout}
          />
        );
      }.bind(this));

    return (
      <ul className="nav nav-sidebar">
        {workoutsDates}
      </ul>
    );
  }
});


var MainContent = React.createClass({
  render: function () {
    var
      detail = null;

    if (this.props.selectedWorkout != null) {
      detail = <WorkoutDetail selectedWorkout={this.props.selectedWorkout} />
    } else {
      detail = <EmptyWorkoutDetail />
    }

    return (
      <div>
        {detail}
      </div>
    );
  }
});

var EmptyWorkoutDetail = React.createClass({
  render: function () {
    return (
      <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        Empty
      </div>
    );
  }
});

var WorkoutDetail = React.createClass({
  render: function () {
    var
      workoutIntervals = this.props.selectedWorkout.intervals,
      totalTime = workoutIntervals.reduce( function (memo, wi) { return wi.totalTimeInZone + memo;}, 0 ),
      titleDate = moment(this.props.selectedWorkout.scheduledDate).format(DATEFORMAT),
      titleTime = totalTime,
      title = titleDate + ' , duration: ' + Helpers.secondsTosHHMMSS( titleTime );

    return (
      <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <WorkoutTitle workoutTitle={title} />
        <WorkoutIntervals workoutIntervals={workoutIntervals} />
      </div>
    );
  }
});

var WorkoutTitle = React.createClass({
  render: function () {
    return (
      <h1 className="page-header">{this.props.workoutTitle}</h1>
    );
  }
});

var WorkoutIntervals = React.createClass({
  render: function () {
    var
      firstOfTypes = {},
      totalTime = this.props.workoutIntervals.reduce( function (memo, wi) { return wi.totalTimeInZone + memo;}, 0 ),
      workoutIntervals = this.props.workoutIntervals.map( function (workoutInterval, ind) {
        var
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

});


var WorkoutInterval = React.createClass({
  render: function () {
    var
      workoutInterval = this.props.workoutInterval,
      intervalType = workoutInterval.intervalType,
      miCoachZone = workoutInterval.miCoachZone,
      time = Helpers.secondsTosHHMMSS(workoutInterval.totalTimeInZone);

    return (
      <div className={'workout-interval type-' + intervalType} style={{width: this.props.proportionalWidth + '%'}}>
          <div className={'zone zone-' + miCoachZone} title={time}><span>{this.props.workoutInterval.firstOfType && time}</span></div>
      </div>
    );
  }
});

$(document).ready(function(){
  ReactDOM.render(<WorkoutsPage  url="/api/workouts" />, document.getElementById('container'));
});

}());