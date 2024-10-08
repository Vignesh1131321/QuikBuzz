const path = require('path'); // Add this line to require the path module
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('cors');
app.use(cors({
  origin: 'https://quikbuzz4all.onrender.com',
}));
app.use(express.json());



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));
const rooms = {};
let tabSwitches = [];
const getIndianTime = () => {
  const options = { 
    timeZone: 'Asia/Kolkata', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false // 24-hour format
  };
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  return formatter.format(new Date());
};


app.post('/create-room', (req, res) => {
  const { teamName } = req.body;
  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  rooms[pin] = { teams: [], buzzes: [], answers: [], timerEndTime: null };
  res.json({ success: true, pin });
});

app.post('/login', (req, res) => {
  const { teamName, pin } = req.body;
  const room = rooms[pin];
  if (rooms[pin]) {
    const existingTeam = room.teams.find(t => t.name === teamName);
    if (existingTeam) {
      // Team name already exists
      res.json({ success: false, message: 'Team name already exists. Please choose a different name.' });
    } else {
      // Add the team to the room
      room.teams.push({ name: teamName, score: 0 });
      res.json({ success: true });
    }
  } else {
    res.json({ success: false, message: 'Invalid PIN' });
  }
});

app.get('/teams/:pin', (req, res) => {
  const roomPin = req.params.pin;
  const room = rooms[roomPin];
  if (room) {
    res.json({ success: true, teams: room.teams, buzzes: room.buzzes });
  } else {
    res.json({ success: false, message: 'Room not found' });
  }
});

app.post('/buzz', (req, res) => {
  const { teamName, pin } = req.body;
  const room = rooms[pin];
  if (room) {
    const buzzTime = getIndianTime();
    room.buzzes.push({ team: teamName, time: buzzTime });
    res.json({ success: true, team: teamName, time: buzzTime });
  } else {
    res.json({ success: false, message: 'Invalid PIN' });
  }
});
app.post('/submit-answer', (req, res) => {
    const { pin, teamName, answer } = req.body;
    if (rooms[pin]) {
        rooms[pin].answers.push({  team: teamName, answer });
        res.json({ success: true });

    } else {
      res.status(404).json({ success: false, message: 'Invalid PIN' });
    }
  });
app.post('/update-score', (req, res) => {
  const { pin, teamName, score } = req.body;
  const room = rooms[pin];
  if (room) {
    const team = room.teams.find(t => t.name === teamName);
    if (team) {
      team.score = score;
      res.json({ success: true, teams: room.teams });
    } else {
      res.json({ success: false, message: 'Team not found' });
    }
  } else {
    res.json({ success: false, message: 'Invalid PIN' });
  }
});
app.get('/answers/:pin', (req, res) => {
    const { pin } = req.params;
    if (rooms[pin]) {
      res.json({ success: true, answers: rooms[pin].answers });
    } else {
      res.json({ success: false, message: 'Room not found' });
    }
  });


app.post('/clear-buzzes', (req, res) => {
    const { pin } = req.body;
    const room = rooms[pin];
    if (room) {
      room.buzzes = [];
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Room not found' });
    }
  });
// Clear answers for a room
app.post('/clear-answers', (req, res) => {
    const { pin } = req.body;
    const room = rooms[pin];
    if (room) {
      room.answers = [];
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Room not found' });
    }
  });

// Endpoint to reset buzz state for a specific room and team
app.post('/reset-buzz/:pin', (req, res) => {
    const pin = req.params.pin;
    const team = req.body.team;
    const room = rooms[pin];
    if (room) {
      room.buzzes = [];
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Room not found' });
    }

});

// Endpoint to handle tab switch notification
app.post('/tab-switch', (req, res) => {
  const { pin, teamName } = req.body;

  // Store the tab switch event
  tabSwitches.push({ pin, teamName, time: new Date().toLocaleTimeString() });

  res.json({ success: true });
});

// Endpoint to fetch tab switches
app.get('/tab-switches/:pin', (req, res) => {
  const pin = req.params.pin;
  const roomTabSwitches = tabSwitches.filter(ts => ts.pin === pin);
  res.json({ success: true, tabSwitches: roomTabSwitches });
});
// Endpoint to clear tab switch data for a room
app.post('/clear-tab-switches', (req, res) => {
  const { pin } = req.body;
  tabSwitches = tabSwitches.filter(ts => ts.pin !== pin);
  res.json({ success: true, message: 'Tab switch data cleared' });
});




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'home.html'));
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
