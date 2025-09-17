const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const users = [];
const logs = [];

// Post and Get usernames
app.route("/api/users").post((req,res) => {
  const newName = req.body.username;
  const user = users.find(({username}) => username === newName);
  if (user) {
    res.json(user);
  } else {
    const userObject = {username: newName, _id: String(users.length)}
    users.push(userObject);
    logs.push([]);
    res.json(userObject);
  }
}).get((req,res) => {
  res.json(users);
});

// Post exercises
app.post("/api/users/:_id/exercises", (req,res) => {
  const userId = Number(req.params._id);
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString();
  if (userId < users.length) {
    const user = users[userId];
    res.json({username: user.username, description: description, duration: duration, date: date, _id: userId});
    const exercise = {description: description, duration: duration, date: date};
    logs[userId].push(exercise);
  } else {
    res.json({error: "invalid user"});
  }
});

// Get exercise logs
app.get("/api/users/:_id/logs", (req,res) => {
  const userId = req.params._id;
  let userLogs = logs[userId];
  const count = userLogs.length;
  const user = users[userId];
  const from = req.query.from;
  const to = req.query.to;
  const limit = Number(req.query.limit);
  userLogs = userLogs.filter(({date}) => {
    return (
      (from ? new Date(date) >= new Date(from) : true)
      && (to ? new Date(date) <= new Date(to) : true)
    )
  });
  if (limit) userLogs = userLogs.slice(0,limit);
  res.json({username: user.username, count: count, _id: userId, log: userLogs});
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
