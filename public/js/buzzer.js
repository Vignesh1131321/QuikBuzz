document.addEventListener('DOMContentLoaded', function () {
    const buzzButton = document.getElementById('buzz-button');
    const buzzedTeamsList = document.getElementById('buzzed-teams');
    const answerInput = document.getElementById('answer-input');
    const submitAnswerButton = document.getElementById('submit-answer-button');
    let buzzed = false;

    const roomPin = localStorage.getItem('roomPin');
    const teamName = localStorage.getItem('teamName');
    const playBuzzerSound = () => {
      const audio = new Audio('buzzer-sound.mp3'); // Ensure this path is correct
      audio.play();
  };
  const addPulsatingEffect = () => {
    buzzButton.classList.add('pulsating');
};

const removePulsatingEffect = () => {
    buzzButton.classList.remove('pulsating');
};

    const resetBuzzState = async () => {
        try {
            const response = await fetch(`http://localhost:5000/reset-buzz/${roomPin}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ team: teamName })
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error resetting buzz state:', error);
            alert(`Error resetting buzz state: ${error.message}`);
        }
    };

    // Reset buzz state on page load
    resetBuzzState();
  
    if (!buzzButton || !buzzedTeamsList || !answerInput || !submitAnswerButton ) {
        console.error("DOM elements not found");
        return;
      }
  

  
    if (!roomPin || !teamName) {
      alert('Room PIN or team name not found in local storage');
      return;
    }

    buzzButton.addEventListener('click', async () => {
      try {
        if (buzzButton.disabled) return;

        // Disable the button to prevent further clicks
        buzzButton.disabled = true;
        
        const response = await fetch('http://localhost:5000/buzz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pin: roomPin, teamName })
        });

        const data = await response.json();
        if (data.success) {
          buzzButton.style.backgroundColor = '#be0606';
          buzzButton.innerText = 'Buzzed!'
          playBuzzerSound();
          removePulsatingEffect();
          addBuzzedTeam(data.team, data.time);
        } else {
          alert('Failed to buzz: ' + data.message);
        }
      } catch (error) {
        console.error('Error buzzing:', error);
        alert('Error buzzing');
      }
    });
    
    submitAnswerButton.addEventListener('click', async () => {
        const answer = answerInput.value;
        if (!answer) {
          alert('Please enter an answer');
          return;
        }
    
        try {
          const response = await fetch('http://localhost:5000/submit-answer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pin: roomPin, teamName, answer })
          });
    
          const data = await response.json();
          if (data.success) {
            alert('Answer submitted successfully');
            answerInput.value = '';
          } else {
            alert('Failed to submit answer: ' + data.message);
          }
        } catch (error) {
          console.error('Error submitting answer:', error);
          alert('Error submitting answer');
        }
      });
    const addBuzzedTeam = (teamName, time) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Team: ${teamName} buzzed at ${time}`;
      buzzedTeamsList.appendChild(listItem);
    };
  // Timer logic

    // Fetch and display buzzed teams on page load
    const fetchBuzzedTeams = async () => {
      try {
        
        const response = await fetch(`http://localhost:5000/teams/${roomPin}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch teams: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.success) {
          throw new Error(`Error fetching teams: ${data.message}`);
        }
  

        if (data.buzzes) {
          data.buzzes.forEach(buzz => {
            addBuzzedTeam(buzz.team, buzz.time);
          });
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
        alert(`Error fetching teams: ${error.message}`);
      }
    };
    const fetchAnswers = async () => {
        try {
          const response = await fetch(`http://localhost:5000/answers/${roomPin}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch answers: ${response.statusText}`);
          }
          const data = await response.json();
          if (!data.success) {
            throw new Error(`Error fetching answers: ${data.message}`);
          }
    
          console.log('Answers:', data.answers); // Log answers, implement UI display in createRoom.js
        } catch (error) {
          console.error('Error fetching answers:', error);
          alert(`Error fetching answers: ${error.message}`);
        }
      };
      document.addEventListener('visibilitychange', async () => {
        if (document.hidden) {
            // Inform the host when the participant switches the tab
            try {
                const response = await fetch('http://localhost:5000/tab-switch', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pin: roomPin, teamName })
                });

                const data = await response.json();
                if (!data.success) {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error notifying tab switch:', error);
            }
        }
    });
    fetchBuzzedTeams();
    setInterval(fetchBuzzedTeams, 5000); // Update the buzzed teams list every 5 seconds
    setInterval(() => {
        buzzedTeamsList.innerHTML = '';
    },5000);
    addPulsatingEffect();
  });
  