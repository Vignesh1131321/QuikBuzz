document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const teamName = document.getElementById('teamName').value;
    const pin = document.getElementById('pin').value;
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName, pin }),
      });
  
      const result = await response.json();
      if (result.success) {
        // Store both the PIN and team name
        localStorage.setItem('roomPin', pin);
        localStorage.setItem('teamName', teamName);
        window.location.href = 'buzzer.html'; // Redirect to buzzer page
      } else {
        document.getElementById('status').innerText = `Login failed: ${result.message}`;
      }
    } catch (error) {
      console.error('Error logging in:', error);
      document.getElementById('status').innerText = 'An error occurred.';
    }
  });

