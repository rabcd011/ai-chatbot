// Placeholder URL for your backend API (we will set up the actual backend in Step 6)
const BACKEND_URL = 'https://ai-chatbot-backend-9923.onrender.com';

async function sendMessage() {
  const inputElement = document.getElementById('user-input');
  const message = inputElement.value.trim();
  
  if (!message) return;

  // Display user's message in the chat UI
  appendMessage(message, 'user-message');
  inputElement.value = '';

  // Show a temporary loading message from the AI
  const loadingId = appendMessage('Thinking...', 'ai-message');

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    
    // Replace thinking indicator with actual response
    updateMessage(loadingId, data.reply || 'No response received.');
  } catch (error) {
    updateMessage(loadingId, 'Error connecting to the backend server.');
  }
}

function appendMessage(text, className) {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  const uniqueId = 'msg-' + Date.now();
  
  messageElement.id = uniqueId;
  messageElement.className = `message ${className}`;
  messageElement.innerText = text;
  
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  return uniqueId;
}

function updateMessage(id, newText) {
  const messageElement = document.getElementById(id);
  if (messageElement) {
    messageElement.innerText = newText;
  }
}
