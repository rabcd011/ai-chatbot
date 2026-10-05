const BACKEND_URL = 'https://ai-chatbot-backend-9923.onrender.com/api/chat';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

function appendMessage(sender, text) {
  const container = document.getElementById('chat-messages');
  if (!container) {
    console.error("Could not find element with id 'chat-messages'");
    return null;
  }

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', `${sender}-message`);
  
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('message-content');
  contentDiv.textContent = text;
  
  messageDiv.appendChild(contentDiv);
  container.appendChild(messageDiv);
  container.scrollTop = container.scrollHeight;
  return messageDiv;
}

async function sendMessage() {
  const inputEl = document.getElementById('user-input');
  if (!inputEl) return;

  const messageText = inputEl.value.trim();
  if (!messageText) return;

  appendMessage('user', messageText);
  inputEl.value = '';

  const loadingMessage = appendMessage('bot', 'Typing...');

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText })
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    if (loadingMessage) {
      loadingMessage.querySelector('.message-content').textContent = data.reply || 'No response generated.';
    }
  } catch (error) {
    console.error('Error:', error);
    if (loadingMessage) {
      loadingMessage.querySelector('.message-content').textContent = 
        'Error connecting to backend. If the server was sleeping, please wait 1 minute and try again.';
    }
  }
}

if (sendBtn) {
  sendBtn.addEventListener('click', sendMessage);
}

if (userInput) {
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}
