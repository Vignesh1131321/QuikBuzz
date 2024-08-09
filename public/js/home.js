document.getElementById('createRoomBtn').addEventListener('click', () => {
    window.location.href = 'createRoom.html';
});

document.getElementById('buzzerBtn').addEventListener('click', () => {
    window.location.href = 'login.html';
});
// home.js
document.addEventListener('DOMContentLoaded', () => {
    const emojiContainer = document.querySelector('.emoji-container');

    const emojis = ['😊', '🎉', '💡', '📚', '🏆', '✨', '🔥', '🚀', '🤓', '👏', '🌞','🌟','💯','🎓','👑'];

    setInterval(() => {
        emojiContainer.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    }, 300);
});
