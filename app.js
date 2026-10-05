// URL of your live Render backend service
const BACKEND_URL = 'https://ai-chatbot-backend-9923.onrender.com/api/chat';

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Function to append a message bubble to the chat container
function appendMessage(sender, text) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', `${sender}-message`);
  
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');
  contentDiv.textContent = text;
  
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return messageDiv;
}

// Function to send message to backend and receive response
async function sendMessage() {
  const messageText = userInput.value.trim();
  if (!messageText) return;

  // Display user message in UI
  appendMessage('user', messageText);
  userInput.value = '';

  // Show temporary "Typing..." message from AI
  const loadingMessage = appendMessage('bot', 'Typing...');

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: messageText })
    });

    if (!response.ok) {
      throw new Error(`Server status: ${response.status}`);
    }

    const data = await response.json();

    // Replace "Typing..." with actual AI response
    if (data.reply) {
      loadingMessage.querySelector('.message-content').textContent = data.reply;
    } else {
      loadingMessage.querySelector('.message-content').textContent = 'Error: Received empty response from server.';
    }
  } catch (error) {
    console.error('Error connecting to backend:', error);
    loadingMessage.querySelector('.message-content').textContent = 
      'Error connecting to the backend server. If the server was sleeping, please wait 1 minute and try again.';
  }
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
