/* =========================================================
   CopilotOps — script.js
   Vanilla JS. No dependencies, no build step.
   1) Mobile navigation
   2) Footer year
   3) Guided project chatbot (mock logic, frontend only)
   ========================================================= */

(function () {
  'use strict';

  /* Single source of truth for the company address — used in chat replies,
     and mirrored in the mailto links in index.html. */
  var CONTACT_EMAIL = 'copilotops@gmail.com';

  /* ---------- 1. Mobile navigation ---------- */

  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  function closeNav() {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  navToggle.addEventListener('click', function () {
    var open = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  primaryNav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- 2. Footer year ---------- */

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 3. Chatbot ---------- */

  var launcher = document.getElementById('chatLauncher');
  var panel    = document.getElementById('chatPanel');
  var closeBtn = document.getElementById('chatClose');
  var log      = document.getElementById('chatLog');
  var prompts  = document.getElementById('chatPrompts');
  var form     = document.getElementById('chatForm');
  var input    = document.getElementById('chatText');

  var greeted = false;

  /* --- Knowledge base: every answer is written here, nothing is generated --- */

  var TOPICS = {
    projects: {
      label: 'What projects have you done?',
      keywords: ['project', 'projects', 'work', 'case', 'portfolio', 'client', 'clients', 'example', 'examples'],
      reply: [
        'Six builds are documented on this page, all running in production:',
        '• Support agent for a telecom — 1.2M tickets a year, 61% deflected.<br>' +
        '• GitHub review harness across 340 repositories.<br>' +
        '• Retail inventory agent for 412 grocery stores.<br>' +
        '• HR assistant in Copilot Studio for 14,000 staff.<br>' +
        '• Invoice processing at 82% touchless.<br>' +
        '• Claims triage built with classic AI, no generative step.'
      ],
      target: '#agents',
      cta: 'Open the architecture grid'
    },

    agentic: {
      label: 'Guide me through Agentic AI',
      keywords: ['agentic', 'agent', 'autonomous', 'multi-step', 'tool', 'tools', 'loop', 'planner'],
      reply: [
        'Agentic AI is our pattern for work that takes several steps and touches real systems.',
        'The retail inventory build is the clearest example: it reconciles point-of-sale movement ' +
        'against warehouse stock every hour, forecasts the shortfall per store, and raises the ' +
        'replenishment order in SAP under a value cap. Stockouts fell 34%. Anything above the cap ' +
        'goes to a regional planner instead.',
        'The engineering effort goes into boundaries — scoped credentials, action limits, ' +
        'replayable traces and a defined stopping condition.'
      ],
      target: '#cap-agentic-ai',
      cta: 'Jump to Agentic AI'
    },

    power: {
      label: 'Show me Power Automation',
      keywords: ['power', 'automate', 'automation', 'flow', 'rpa', 'invoice', 'finance', 'erp'],
      reply: [
        'Power Automation is the layer that carries a decision into the systems of record.',
        'For a finance team handling 90,000 invoices a year we extract line items from supplier ' +
        'PDFs, match them against the purchase order and goods receipt, and post clean three-way ' +
        'matches straight through. Cycle time went from three days to about four hours, and ' +
        'exceptions reach an approver with the mismatch already explained.'
      ],
      target: '#cap-power-automation',
      cta: 'Jump to Power Automation'
    },

    copilot: {
      label: 'Tell me about Copilot Studio',
      keywords: ['copilot', 'studio', 'teams', 'microsoft', 'hr', 'chatbot', 'm365', 'sharepoint'],
      reply: [
        'Copilot Studio is where we build conversational agents inside Teams and Microsoft 365.',
        'The HR assistant we shipped for a 14,000-person shared services team answers policy and ' +
        'payroll questions grounded strictly on the current handbook version, and turns leave or ' +
        'expense requests into real transactions through a connector. HR tickets dropped 45%.'
      ],
      target: '#cap-copilot-studio',
      cta: 'Jump to Copilot Studio'
    },

    github: {
      label: 'How does the GitHub harness work?',
      keywords: ['github', 'devops', 'harness', 'repo', 'repository', 'pull request', 'pr', 'code', 'ci', 'pipeline'],
      reply: [
        'The GitHub harness is a governed layer around Copilot and Actions.',
        'A pull request webhook wakes the agent. It analyses the diff, looks for test gaps, and ' +
        'checks the change against the team\'s own standards, then posts review comments and a ' +
        'suggested commit. It never merges on its own — a maintainer approval is always the closing ' +
        'step. Review lead time fell 48% across 340 repositories.'
      ],
      target: '#cap-github-harness',
      cta: 'Jump to GitHub harness'
    },

    classic: {
      label: 'When do you use classic AI?',
      keywords: ['classic', 'machine learning', 'ml', 'model', 'forecast', 'classifier', 'claims', 'regulator'],
      reply: [
        'When the requirement is a reproducible number rather than a conversation.',
        'Our insurance claims triage has no generative step at all: a trained classifier and a rules ' +
        'engine sort claims by severity and fraud signal, because the regulator needs a decision ' +
        'that can be reproduced exactly, twice, a year apart. It runs at 94% triage accuracy for a ' +
        'fraction of the cost of a language model.'
      ],
      target: '#cap-classic-ai',
      cta: 'Jump to Classic AI'
    },

    architecture: {
      label: 'How is a CopilotOps agent built?',
      keywords: ['architecture', 'design', 'diagram', 'runtime', 'stack', 'guardrail', 'guardrails', 'security', 'governance', 'audit'],
      reply: [
        'Every build follows the same three-column shape: channels and sources on the left, the ' +
        'agent runtime in the middle, systems of action on the right.',
        'Underneath all three sits the governance rail — scoped identity, an evaluation suite, trace ' +
        'logging and a human review loop. The runtime is the only place a decision is made, and the ' +
        'rail is what makes that decision defensible a year later.'
      ],
      target: '#top',
      cta: 'See the reference architecture'
    },

    delivery: {
      label: 'How does an engagement run?',
      keywords: ['deliver', 'engagement', 'process', 'timeline', 'how long', 'weeks', 'start', 'onboard'],
      reply: [
        'Four stages, eight to twelve weeks to a governed production agent.',
        'We map the decision by shadowing the work, build one thin loop end to end into a real ' +
        'system, set the guardrails — scoped identity, action limits, evaluation suite, trace ' +
        'logging — then hand over with a runbook and a drift dashboard. Your team owns it afterwards.'
      ],
      target: '#delivery',
      cta: 'See the four stages'
    },

    contact: {
      label: 'How do I get in touch?',
      keywords: ['contact', 'talk', 'email', 'mail', 'reach', 'call', 'quote', 'hire', 'pricing', 'cost', 'budget'],
      reply: [
        'Write to <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.',
        'Send the process name, the systems involved and roughly how many times a week it runs. ' +
        'You will get an architecture sketch back, not a sales deck.'
      ],
      target: '#contact',
      cta: 'Go to contact'
    }
  };

  var STARTER_PROMPTS = ['projects', 'agentic', 'power', 'github'];

  var FALLBACK = {
    reply: [
      'I only know this site, so I can help with our agent builds, the five practices, how an ' +
      'engagement runs, or how to reach us.',
      'Try a suggestion below, or ask about Copilot Studio, GitHub, classic AI, agentic AI or ' +
      'Power Automation. For anything else, email ' +
      '<a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a>.'
    ],
    target: '#capabilities',
    cta: 'Browse all capabilities'
  };

  /* --- Rendering --- */

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
    }, 550);
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

  /* --- Open / close --- */

  function openPanel() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');

    if (!greeted) {
      greeted = true;
      addMessage('bot', [
        'Hello — I am the CopilotOps project guide.',
        'I can summarise the agents we have built, explain any of our five practices, or scroll you ' +
        'straight to the part of the page you need. Pick a question below to start.'
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
