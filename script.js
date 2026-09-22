/* =========================================================
   CopilotOps — script.js
   1) Theme toggle (dark/light) with local persistence
   2) Use cases dropdown interaction
   3) Mobile menu navigation
   4) Guided project chatbot
   ========================================================= */

(function () {
  'use strict';

  var CONTACT_EMAIL = 'copilotops@gmail.com';

  /* ---------- 1. Dark/Light Theme Toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var currentTheme = localStorage.getItem('copilotops_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('copilotops_theme', nextTheme);
    });
  }

  /* ---------- 2. Dropdown Menu (Use Cases) ---------- */
  var dropdownBtn = document.getElementById('useCaseDropdownBtn');
  var dropdownMenu = document.getElementById('useCaseMenu');

  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var expanded = dropdownBtn.getAttribute('aria-expanded') === 'true';
      dropdownBtn.setAttribute('aria-expanded', String(!expanded));
      dropdownMenu.classList.toggle('is-active', !expanded);
    });

    document.addEventListener('click', function (e) {
      if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownBtn.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('is-active');
      }
    });
  }

  /* ---------- 3. Mobile Navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  function closeNav() {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var open = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });

    primaryNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        closeNav();
        if (dropdownMenu) dropdownMenu.classList.remove('is-active');
      }
    });
  }

  /* ---------- 4. Dynamic Year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 5. Project Guide Chatbot ---------- */
  var launcher = document.getElementById('chatLauncher');
  var panel    = document.getElementById('chatPanel');
  var closeBtn = document.getElementById('chatClose');
  var log      = document.getElementById('chatLog');
  var prompts  = document.getElementById('chatPrompts');
  var form     = document.getElementById('chatForm');
  var input    = document.getElementById('chatText');

  var greeted = false;

  var TOPICS = {
    copilot: {
      label: 'Copilot Studio (Standard + Harness)',
      keywords: ['copilot', 'studio', 'harness', 'github harness', 'standard'],
      reply: 'We build enterprise copilots using Microsoft Copilot Studio backed by automated GitHub CI/CD evaluation harnesses for safe prompt engineering and release gating.',
      target: '#cap-copilot-studio'
    },
    governance: {
      label: 'Governance (Purview & DLP)',
      keywords: ['governance', 'purview', 'dlp', 'sensitivity', 'policy', 'labels'],
      reply: 'Our architecture enforces Microsoft Purview sensitivity labels, role-scoped tenant access, and strict DLP rules across all agent I/O streams.',
      target: '#cap-governance'
    },
    cowork: {
      label: 'Cowork, Skills & Plugins',
      keywords: ['cowork', 'skill', 'skills', 'plugin', 'plugins', 'app building'],
      reply: 'We develop custom action plugins, M365 skills, and low-code app integrations to turn conversational inputs into verified enterprise operations.',
      target: '#cap-cowork'
    },
    declarative: {
      label: 'Declarative & Scout Agents',
      keywords: ['declarative', 'scout', 'm365', 'application connection', 'scout agent'],
      reply: 'We build custom Microsoft declarative agents that query SharePoint and M365 systems safely, paired with Scout Agents monitoring systems for process bottlenecks.',
      target: '#cap-declarative'
    },
    voice: {
      label: 'Voice Agents',
      keywords: ['voice', 'telephony', 'call', 'speech'],
      reply: 'Our low-latency voice agents handle spoken calls, self-service transactions, and warm handoffs with real-time redaction.',
      target: '#cap-voice'
    }
  };

  var STARTER_KEYS = ['copilot', 'governance', 'cowork', 'declarative'];

  function addMsg(role, text) {
    var d = document.createElement('div');
    d.className = 'msg msg--' + role;
    d.innerHTML = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function renderPrompts() {
    prompts.innerHTML = '';
    STARTER_KEYS.forEach(function (k) {
      var item = TOPICS[k];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = item.label;
      btn.addEventListener('click', function () {
        addMsg('user', item.label);
        setTimeout(function () {
          addMsg('bot', item.reply);
        }, 300);
      });
      prompts.appendChild(btn);
    });
  }

  if (launcher && panel) {
    launcher.addEventListener('click', function () {
      panel.hidden = false;
      if (!greeted) {
        greeted = true;
        addMsg('bot', 'Welcome to CopilotOps. Ask us about Copilot Studio, Purview Governance, Cowork skills, or Voice Agents.');
        renderPrompts();
      }
    });

    closeBtn.addEventListener('click', function () {
      panel.hidden = true;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = input.value.trim().toLowerCase();
      if (!val) return;
      addMsg('user', input.value);
      input.value = '';

      var matched = null;
      Object.keys(TOPICS).forEach(function (key) {
        TOPICS[key].keywords.forEach(function (kw) {
          if (val.indexOf(kw) !== -1) matched = TOPICS[key];
        });
      });

      setTimeout(function () {
        if (matched) {
          addMsg('bot', matched.reply);
        } else {
          addMsg('bot', 'Reach out directly at <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> for dedicated architectural reviews.');
        }
      }, 350);
    });
  }
})();
