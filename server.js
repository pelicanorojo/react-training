var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var planFileName = '42k-02:40-4wobyweek-5months';
var WORKOUTS_FILE = path.join(__dirname, `/public/${planFileName}.json`);
var rawData = null;
var workoutsDates = null;

fs.readFile(WORKOUTS_FILE, function(err, data) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  rawData = JSON.parse(data);

  workoutsDates = rawData.results.map( function ( workout, ind ) {
    return {
      scheduledDate: workout.scheduledDate,
      workoutId: workout.workoutId,
      workoutInd: ind
    }
  });

});

app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/api/workouts', function(req, res) {
  res.setHeader('Cache-Control', 'no-cache');
  res.json(workoutsDates);
});

app.get('/api/workouts/:workoutInd', function(req, res) {
  var
    workout = rawData.results[req.params.workoutInd];

  res.setHeader('Cache-Control', 'no-cache');
  res.json(workout ? workout : null);
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
