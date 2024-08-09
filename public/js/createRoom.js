document.addEventListener('DOMContentLoaded', function () {
  const createRoomButton = document.getElementById('create-room');
  const buzzed = document.getElementById('buzzed');
  const leaderboard = document.getElementById('leaderboard');
  const scoreUpdatesDiv = document.getElementById('score-updates');
  const updateScoresButton = document.getElementById('update-scores-button');
  const startTimerButton = document.getElementById('start-timer-button');
/*   const timerDisplay = document.getElementById('timer-display'); */
  const timerMinutesInput = document.getElementById('timer-minutes');
  const timerBlink = document.getElementById('timer-blink');
const timerTime = document.getElementById('timer-time');
  const roomPinDisplay = document.getElementById('room-pin');
  const answersList = document.getElementById('answers-list');
  const teamsList = document.getElementById('teams-list');
  const tabSwitchList = document.getElementById('tab-switch-list'); // Added element to display teams that switched tabs
  const statsContainer = document.getElementById('stats-container');
  const scoreChartCanvas = document.getElementById('scoreChart');
  const teamStatsDiv = document.getElementById('teamStats');
  const reset = document.getElementById('reset');

  
  let roomPin = localStorage.getItem('roomPin');
  let timerInterval;
  let timerDuration;
  let timerEndTime;
  let scoreChart;
  reset.addEventListener('click',() => {
    answersList.innerHTML = '';
    buzzed.innerHTML = '';
    tabSwitchList.innerHTML = '';
    clearBuzzes();
    clearAnswers();
    clearTabSwitches(); // Clear tab switch data on timer start
  })
  function scrollToElement(elementSelector, instance = 0) {
    // Select all elements that match the given selector
    const elements = document.querySelectorAll(elementSelector);
    // Check if there are elements matching the selector and if the requested instance exists
    if (elements.length > instance) {
        // Scroll to the specified instance of the element
        elements[instance].scrollIntoView({ behavior: 'smooth' });
    }
}

const link1 = document.getElementById("link1");
const link2 = document.getElementById("link2");
const link3 = document.getElementById("link3");

link1.addEventListener('click', () => {
    scrollToElement('.header');
});

link2.addEventListener('click', () => {
    // Scroll to the second element with "header" class
    scrollToElement('.header', 1);
});



  startTimerButton.addEventListener('click', () => {
 // Clear tab switch list on timer start
    fetchTabSwitches(); // Fetch tab switches after timer ends

    const timerDuration = parseInt(timerMinutesInput.value) * 60 * 1000; // convert minutes to milliseconds
    timerEndTime = Date.now() + timerDuration;

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const remainingTime = timerEndTime - Date.now();
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            /* timerDisplay.textContent = "Time's up!"; */
            /* fetchAnswers(); */
            fetchBuzzesAndAnswers();
            
        } else {
          setInterval(fetchTabSwitches,1000);
            const minutes = Math.floor(remainingTime / 60000);
            const seconds = Math.floor((remainingTime % 60000) / 1000);
            /* timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; */
            
            if(remainingTime === 0){
              timerTime.textContent = "Time's up";
            }
            else{
              timerTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
            if (remainingTime <= 10000) { // Change to red blink when less than 10 seconds
                timerBlink.style.animation = 'blink-red 1s infinite';
            } else {
                timerBlink.style.animation = 'blink-green 1s infinite';
            }
        }
    }, 1000);
});

  const fetchTeams = async () => {
    try {
      console.log('Fetching teams for pin:', roomPin); // Log the pin being used
      const response = await fetch(`http://localhost:5000/teams/${roomPin}`);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      roomPinDisplay.textContent = 'Pin: ' + roomPin;
      //Update teams list
      teamsList.innerHTML = '';
      data.teams.forEach(team => {
        const listItem = document.createElement('li');
        listItem.textContent = team.name;
        teamsList.appendChild(listItem);
      });

      buzzed.innerHTML = '';
      data.buzzes.forEach(buzz => {
        const buzzItem = document.createElement('li');
        buzzItem.textContent = `Team: ${buzz.team} buzzed at ${buzz.time}`;
        buzzed.appendChild(buzzItem);
      });


      // Update leaderboard
      leaderboard.innerHTML = '';
      data.teams.sort((a, b) => b.score - a.score); // Sort teams by score
      data.teams.forEach(team => {
        const listItem = document.createElement('li');
        listItem.textContent = `Team: ${team.name} - Score: ${team.score}`;
        leaderboard.appendChild(listItem);
      });

      // Update score inputs
      scoreUpdatesDiv.innerHTML = '';
      data.teams.forEach(team => {
        const inputDiv = document.createElement('div');
        inputDiv.innerHTML = `
          <label>${team.name}</label>
          <input type="number" style="color:white" id="score-${team.name}" value="${team.score}">
        `;
        scoreUpdatesDiv.appendChild(inputDiv);
        displayStatistics(data.teams);
/*         updateCommentators(data.teams); */
      });
    } catch (error) {
      console.error('Error fetching teams:', error);

    }
  };
/*   const fetchAnswers = async () => {
    try {
      
      const response = await fetch(`http://localhost:5000/answers/${roomPin}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch answers: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Error fetching answers: ${data.message}`);
      }

      answersList.innerHTML = '';
      data.answers.forEach(answer => {
        const listItem = document.createElement('li');
        console.log(`${answer.team.name}`);
        listItem.textContent = `Team: ${answer.team} - Answer: ${answer.answer}`;
        answersList.appendChild(listItem);
      });
      // Clear answers after fetching them
      clearAnswers();

    } catch (error) {
      console.error('Error fetching answers:', error);
      alert(`Error fetching answers: ${error.message}`);
    }
  }; */
  // Fetch function for teams that switched tabs
/*   const updateCommentators = async (teams) => {
    const leadingTeam = teams[0];
    const trailingTeam = teams[teams.length - 1];

    await generateComment(leadingTeam.name, 'leading', commentatorMale);
    await generateComment(trailingTeam.name, 'trailing', commentatorFemale);
  };
  const generateComment = async (teamName, context, element) => {
    try {
      const response = await fetch('http://localhost:5000/generate-comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName, context }),
      });

      const data = await response.json();
      if (data.success) {
        element.textContent = data.comment;
      } else {
        element.textContent = 'Error generating comment';
      }
    } catch (error) {
      console.error('Error generating comment:', error);
      element.textContent = 'Error generating comment';
    }
  }; */
  const fetchTabSwitches = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tab-switches/${roomPin}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tab switches: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      tabSwitchList.innerHTML = '';
      data.tabSwitches.forEach(switchInfo => {
        const listItem = document.createElement('li');
        listItem.textContent = `Team: ${switchInfo.teamName} switched tab at ${switchInfo.time}`;
        tabSwitchList.appendChild(listItem);
      });
    } catch (error) {
      console.error('Error fetching tab switches:', error);
      alert(`Error fetching tab switches: ${error.message}`);
    }
  };
  const clearTabSwitches = async () => {
    try {
      const response = await fetch(`http://localhost:5000/clear-tab-switches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: roomPin })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error clearing tab switches:', error);
      alert(`Error clearing tab switches: ${error.message}`);
    }
  };
  const fetchBuzzesAndAnswers = async () => {
    try {
      const buzzesResponse = await fetch(`http://localhost:5000/teams/${roomPin}`);
      
      if (!buzzesResponse.ok) {
        throw new Error(`Failed to fetch buzzes: ${buzzesResponse.statusText}`);
      }
      
      const buzzesData = await buzzesResponse.json();
      if (!buzzesData.success) {
        throw new Error(buzzesData.message);
      }
  
      const answersResponse = await fetch(`http://localhost:5000/answers/${roomPin}`);
      
      if (!answersResponse.ok) {
        throw new Error(`Failed to fetch answers: ${answersResponse.statusText}`);
      }
  
      const answersData = await answersResponse.json();
      if (!answersData.success) {
        throw new Error(answersData.message);
      }
  
      answersList.innerHTML = '';
      const combinedData = buzzesData.buzzes.map(buzz => {
        const answer = answersData.answers.find(ans => ans.team === buzz.team);
        return {
          team: buzz.team,
          time: buzz.time,
          answer: answer ? answer.answer : 'No answer given'
        };
      });
  
      combinedData.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `Team: ${item.team} buzzed at ${item.time} and the answer is: ${item.answer}`;
        answersList.appendChild(listItem);
      });
  
      // Clear answers after fetching them
      clearAnswers();
    } catch (error) {
      console.error('Error fetching buzzes and answers:', error);
      alert(`Error fetching buzzes and answers: ${error.message}`);
    }
  };
  
  const clearBuzzes = async () => {
    try {
      const response = await fetch(`http://localhost:5000/clear-buzzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: roomPin })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error clearing answers:', error);
      alert(`Error clearing answers: ${error.message}`);
    }
  };

  const clearAnswers = async () => {
    try {
      const response = await fetch(`http://localhost:5000/clear-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin: roomPin })
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error clearing answers:', error);
      alert(`Error clearing answers: ${error.message}`);
    }
  };
  createRoomButton.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:5000/create-room', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        roomPin = data.pin;
        localStorage.setItem('roomPin', roomPin);
        fetchTeams(); // Fetch teams right after creating the room
      } else {
        alert('Failed to create room');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating room');
    }
  });

  updateScoresButton.addEventListener('click', async () => {
    try {
      const updates = [];
      const inputs = scoreUpdatesDiv.querySelectorAll('input');
      inputs.forEach(input => {
        const teamName = input.id.replace('score-', '');
        const score = input.value;
        updates.push({ teamName, score });
      });

      for (const update of updates) {
        const response = await fetch('http://localhost:5000/update-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pin: roomPin, teamName: update.teamName, score: update.score })
        });

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
      }

      fetchTeams(); // Refresh leaderboard
    } catch (error) {
      console.error('Error updating scores:', error);
      alert(`Error updating scores: ${error.message}`);
    }
  });
  const displayStatistics = (teams) => {
    const labels = teams.map(team => team.name);
    const scores = teams.map(team => team.score);
    
    // Generate an array of colors, one for each team
    const colors = teams.map((_, index) => {
      const hue = (index * 360 / teams.length) % 360; // Spread hues evenly
      return `hsl(${hue}, 75%, 50%)`; // HSL format with 75% saturation and 50% lightness
    });
  
    if (scoreChart) {
      scoreChart.destroy();
    }
  
    const ctx = scoreChartCanvas.getContext('2d');
    scoreChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Scores',
          data: scores,
          backgroundColor: colors,
          borderColor: colors, 
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            ticks: {
              color: 'white', // Set X-axis labels to white
              font: {
                size: 18,
              },
            }
          },
          y: {
            ticks: {
              color: 'white',
              font: {
                size: 24
              },
            },
            beginAtZero: true
          }
        }
      }
    });
    const totalScore = scores.reduce((a, b) => a + b, 0);
    const averageScore = scores.length > 0 ? (totalScore / scores.length).toFixed(2) : 0;
    teamStatsDiv.innerHTML = `
      <p>Total Teams: ${teams.length}</p>
      <p>Highest Score: ${Math.max(...scores)}</p>
      <p>Lowest Score: ${Math.min(...scores)}</p>

    `;
  };
  if (roomPin) {
    fetchTeams();
    setInterval(fetchTeams, 10000); // Update leaderboard every 10 seconds
    
  } else {
    console.log('No room pin found in local storage');
  }
});
