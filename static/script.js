// function createMessageElement(sender, message) {
//   const div = document.createElement('div');
//   div.classList.add(sender === 'You' ? 'user-message' : 'bot-message', 'mb-2');

//   const senderEl = document.createElement('strong');
//   senderEl.textContent = sender + ': ';
//   div.appendChild(senderEl);

//   const messageEl = document.createElement('span');

//   if (message.includes('```')) {
//     const parts = message.split('```');
//     parts.forEach((part, index) => {
//       if (index % 2 === 0) {
//         const textSpan = document.createElement('span');
//         textSpan.innerHTML = part.replace(/\n/g, '<br>');
//         messageEl.appendChild(textSpan);
//       } else {
//         const pre = document.createElement('pre');
//         pre.innerHTML = part.trim();
//         messageEl.appendChild(pre);
//       }
//     });
//   } else {
//     messageEl.innerHTML = message.replace(/\n/g, '<br>');
//   }

//   div.appendChild(messageEl);
//   return div;
// }

// async function sendMessage() {
//   const input = document.getElementById('user-input');
//   const message = input.value.trim();
//   if (!message) return;

//   const chatBox = document.getElementById('chat-box');
//   chatBox.appendChild(createMessageElement('You', message));

//   const response = await fetch('/chat', {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({message})
//   });
//   const data = await response.json();
//   chatBox.appendChild(createMessageElement('Bot', data.response));

//   input.value = '';
//   chatBox.scrollTop = chatBox.scrollHeight;
// }
document.addEventListener('DOMContentLoaded', () => {
  loadChatHistoryFromServer();
});

async function loadChatHistoryFromServer() {
  const res = await fetch('/history');
  const data = await res.json();
  const chatBox = document.getElementById('chat-box');
  data.forEach(item => {
    chatBox.appendChild(createMessageElement('You', item.user));
    chatBox.appendChild(createMessageElement('Bot', item.bot));
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createMessageElement(sender, message) {
  const div = document.createElement('div');
  div.classList.add(sender === 'You' ? 'user-message' : 'bot-message', 'mb-2');

  const senderEl = document.createElement('strong');
  senderEl.textContent = sender + ': ';
  div.appendChild(senderEl);

  const messageEl = document.createElement('span');

  if (message.includes('```')) {
    const parts = message.split('```');
    parts.forEach((part, index) => {
      if (index % 2 === 0) {
        const textSpan = document.createElement('span');
        textSpan.innerHTML = part.replace(/\n/g, '<br>');
        messageEl.appendChild(textSpan);
      } else {
        const pre = document.createElement('pre');
        pre.innerHTML = part.trim();
        messageEl.appendChild(pre);
      }
    });
  } else {
    messageEl.innerHTML = message.replace(/\n/g, '<br>');
  }

  div.appendChild(messageEl);
  return div;
}

async function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message) return;

  const chatBox = document.getElementById('chat-box');
  chatBox.appendChild(createMessageElement('You', message));

  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  chatBox.appendChild(createMessageElement('Bot', data.response));

  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function clearChat() {
  await fetch('/clear', { method: 'POST' });
  document.getElementById('chat-box').innerHTML = '';
}
