const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const users = [];

// Post and Get usernames
app.route("/api/users").post(bodyParser.urlencoded({extended: false}), (req,res) => {
  const newName = req.body.username;
  console.log(newName);
  const user = users.find(({username}) => username === newName);
  if (user) {
    res.json(user);
  } else {
    userObject = {username: newName, _id: String(users.length)}
    users.push(userObject);
    res.json(userObject);
  }
}).get((req,res) => {
  res.json(users);
  console.log(users);
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
