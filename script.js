/* =========================================================
   CopilotOps — script.js
   Vanilla JS. No dependencies, no build step.
   1) Mobile navigation & Card expander
   2) Footer year & Theme toggle
   3) Guided project chatbot (frontend only)
   ========================================================= */

(function () {
  'use strict';

  var CONTACT_EMAIL = 'copilotops@gmail.com';

  /* ---------- 1. Architecture Card Expander ---------- */
  var archToggles = document.querySelectorAll('.arch-toggle');
  archToggles.forEach(function (button) {
    button.addEventListener('click', function () {
      var card = button.closest('.agent-card');
      if (!card) return;
      var isExpanded = card.classList.toggle('is-expanded');
      button.textContent = isExpanded ? 'Hide architecture' : 'Show architecture';
    });
  });

  /* ---------- 2. Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2b. Theme toggle (light / dark) ---------- */
  var THEME_KEY = 'copilotops-theme';
  var themeToggle = document.getElementById('themeToggle');
  var rootEl = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark' || theme === 'light') {
      rootEl.setAttribute('data-theme', theme);
    } else {
      rootEl.removeAttribute('data-theme');
    }
    if (themeToggle) {
      var isDark = theme === 'dark' ||
        (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  (function initTheme() {
    var saved = null;
    try { saved = window.localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(saved);
  })();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = rootEl.getAttribute('data-theme');
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      var currentlyDark = current === 'dark' || (!current && prefersDark);
      var next = currentlyDark ? 'light' : 'dark';
      applyTheme(next);
      try { window.localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------- 3. Chatbot ---------- */
  var launcher = document.getElementById('chatLauncher');
  var panel    = document.getElementById('chatPanel');
  var closeBtn = document.getElementById('chatClose');
  var log      = document.getElementById('chatLog');
  var prompts  = document.getElementById('chatPrompts');
  var form     = document.getElementById('chatForm');
  var input    = document.getElementById('chatText');

  var greeted = false;

  var TOPICS = {
    projects: {
      label: 'What agent patterns have you built?',
      keywords: ['project', 'projects', 'work', 'case', 'portfolio', 'example', 'examples', 'summary'],
      reply: [
        'Production patterns documented on this page include:',
        '• Support agent for telecom — 1.2M tickets, 61% deflected.<br>' +
        '• DevOps GitHub harness across 340 repositories.<br>' +
        '• Retail inventory agent for 412 stores.<br>' +
        '• HR assistant in Copilot Studio for 14,000 staff.<br>' +
        '• Invoice processing with Power Automate.<br>' +
        '• Claims triage model with deterministic decision rules.'
      ],
      target: '#agents',
      cta: 'View Agent Architectures'
    },

    cowork: {
      label: 'What is Cowork?',
      keywords: ['cowork', 'skill', 'skills', 'plugin', 'plugins', 'app building'],
      reply: [
        'Cowork is the workspace where enterprise skills, plugins, and custom internal apps are built and shared.',
        'Teams deploy and consume from a governed catalog with unified versioning and access control.'
      ],
      target: '#cap-cowork',
      cta: 'Explore Cowork'
    },

    governance: {
      label: 'How do you handle governance?',
      keywords: ['governance', 'purview', 'sensitivity', 'label', 'dlp', 'compliance', 'audit'],
      reply: [
        'Microsoft Purview, sensitivity labels, and Data Loss Prevention (DLP) are integrated directly into our agent runtimes.',
        'Access controls and data boundaries are enforced by enterprise policy rather than prompt guidance.'
      ],
      target: '#cap-governance',
      cta: 'Explore Governance'
    },

    declarative: {
      label: 'What are Declarative Agents?',
      keywords: ['declarative', 'declarative agent', 'm365', 'application connection'],
      reply: [
        'Declarative agents connect directly into Microsoft 365 applications and Graph connectors.',
        'They inherit tenant-level security boundaries and permissions natively.'
      ],
      target: '#cap-declarative-agents',
      cta: 'Explore Declarative Agents'
    },

    specialized: {
      label: 'What are Specialized Agents?',
      keywords: ['specialized', 'scout', 'voice', 'autonomous', 'telephony', 'phone'],
      reply: [
        'Specialized agents encompass Scout research bots, telephony voice agents, and autonomous workers designed for complex background processes.'
      ],
      target: '#cap-specialized-agents',
      cta: 'Explore Specialized Agents'
    },

    copilot: {
      label: 'Tell me about Copilot Studio & GitHub Harness',
      keywords: ['copilot', 'studio', 'github', 'harness', 'devops'],
      reply: [
        'We deliver Copilot Studio solutions paired with GitHub Harness integration to establish CI/CD, prompt evaluation suites, and automated PR review guards.'
      ],
      target: '#cap-copilot-studio',
      cta: 'Explore Copilot Studio'
    },

    contact: {
      label: 'How do I contact CopilotOps?',
      keywords: ['contact', 'email', 'talk', 'hire'],
      reply: [
        'Contact us at <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> with your workflows and requirements.'
      ],
      target: '#contact',
      cta: 'Get in Touch'
    }
  };

  var STARTER_PROMPTS = ['projects', 'cowork', 'governance', 'copilot'];

  var FALLBACK = {
    reply: [
      'I can guide you through our agent capabilities, enterprise governance, or implementation methods.',
      'Ask about Copilot Studio, Cowork, Governance, Declarative Agents, or reach us at <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.'
    ],
    target: '#capabilities',
    cta: 'Browse Capabilities'
  };

  function scrollToTarget(selector) {
    var el = document.querySelector(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    var flash = el.closest('.agent-card') || (el.classList.contains('cap') ? el : null);
    if (flash) {
      flash.classList.add('is-highlighted');
      setTimeout(function () { flash.classList.remove('is-highlighted'); }, 2600);
    }
    if (window.matchMedia('(max-width: 639px)').matches) closePanel();
  }

  function addMessage(role, paragraphs, action) {
    var wrap = document.createElement('div');
    wrap.className = 'msg msg--' + role;

    (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).forEach(function (text) {
      var p = document.createElement('p');
      if (role === 'user') { p.textContent = text; } else { p.innerHTML = text; }
      wrap.appendChild(p);
    });

    if (action && action.target) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'msg__link';
      btn.textContent = action.cta || 'Show me';
      btn.addEventListener('click', function () { scrollToTarget(action.target); });
      wrap.appendChild(btn);
    }

    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  function addTyping() {
    var wrap = document.createElement('div');
    wrap.className = 'msg msg--bot';
    wrap.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  function respond(topic) {
    var typing = addTyping();
    setTimeout(function () {
      typing.remove();
      addMessage('bot', topic.reply, { target: topic.target, cta: topic.cta });
    }, 450);
  }

  function renderPrompts(keys) {
    prompts.innerHTML = '';
    keys.forEach(function (key) {
      var topic = TOPICS[key];
      if (!topic) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = topic.label;
      btn.addEventListener('click', function () {
        addMessage('user', topic.label);
        respond(topic);
        rotatePrompts(key);
      });
      prompts.appendChild(btn);
    });
  }

  function rotatePrompts(usedKey) {
    var remaining = Object.keys(TOPICS).filter(function (k) { return k !== usedKey; });
    renderPrompts(remaining.slice(0, 4));
  }

  function matchTopic(text) {
    var q = text.toLowerCase();
    var best = null, bestScore = 0;

    Object.keys(TOPICS).forEach(function (key) {
      var score = TOPICS[key].keywords.reduce(function (acc, word) {
        return acc + (q.indexOf(word) !== -1 ? word.length : 0);
      }, 0);
      if (score > bestScore) { bestScore = score; best = TOPICS[key]; }
    });

    return bestScore > 0 ? best : FALLBACK;
  }

  function openPanel() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');

    if (!greeted) {
      greeted = true;
      addMessage('bot', [
        'Hello — I am your CopilotOps guide.',
        'Ask about our architecture patterns, enterprise governance, or services.'
      ]);
      renderPrompts(STARTER_PROMPTS);
    }
    setTimeout(function () { input.focus(); }, 60);
  }

  function closePanel() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }

  launcher.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) closePanel();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';
    respond(matchTopic(text));
  });
})();
