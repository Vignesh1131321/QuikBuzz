const port = window.location.port;
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const teamName = document.getElementById('teamName').value;
    const pin = document.getElementById('pin').value;
  
    try {
      const response = await fetch(`https://quikbuzz4all.onrender.com/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamName, pin }),
      });
  
      const result = await response.json();
      if (result.success) {
        // Store both the PIN and team name
        sessionStorage.setItem('roomPin', pin);
        sessionStorage.setItem('teamName', teamName);
        window.location.href = 'buzzer.html'; // Redirect to buzzer page
      } else {
        document.getElementById('status').innerText = `Login failed: ${result.message}`;
      }
    } catch (error) {
      console.error('Error logging in:', error);
      document.getElementById('status').innerText = 'An error occurred.';
    }
  });

