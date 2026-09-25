(function() {
  'use strict';
  
  // Theme Toggle
  const toggleBtn = document.getElementById('themeToggle');
  const root = document.documentElement;
  toggleBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  });

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Architecture Card Expander
  document.querySelectorAll('.arch-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.agent-card');
      const expanded = card.classList.toggle('is-expanded');
      btn.textContent = expanded ? 'Hide architecture' : 'Show architecture';
    });
  });

  // Chatbot
  const launcher = document.getElementById('chatLauncher');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const log = document.getElementById('chatLog');
  const prompts = document.getElementById('chatPrompts');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatText');

  launcher.addEventListener('click', () => {
    panel.hidden = false;
    launcher.style.display = 'none';
    if (!log.children.length) {
      appendMsg('bot', 'Welcome to CopilotOps. How can we help you structure your enterprise AI agents?');
      renderPrompts();
    }
  });

  closeBtn.addEventListener('click', () => {
    panel.hidden = true;
    launcher.style.display = 'inline-flex';
  });

  function appendMsg(role, text) {
    const div = document.createElement('div');
    div.className = `msg msg--${role}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function renderPrompts() {
    prompts.innerHTML = '';
    const qList = ['What agents have you built?', 'Tell me about Governance', 'How do you work with Copilot Studio?'];
    qList.forEach(q => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = q;
      b.onclick = () => {
        appendMsg('user', q);
        setTimeout(() => appendMsg('bot', 'CopilotOps delivers governed Copilot Studio solutions, DevOps harnesses, and M365 declarative agents designed for zero drift and enterprise compliance.'), 400);
      };
      prompts.appendChild(b);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    appendMsg('user', val);
    input.value = '';
    setTimeout(() => {
      appendMsg('bot', 'Thank you for reaching out. Please email copilotops@gmail.com with your project specifications.');
    }, 500);
  });
})();
