# CopilotOps — Enterprise Agent Architecture & Automation

A static, mobile-first marketing site. No build step, no dependencies, no framework —
three files and a README, ready to drop into a repository and serve from GitHub Pages.

```
index.html     structure and content
style.css      mobile-first styles (breakpoints at 640px / 700px / 900px / 1024px / 1100px)
script.js      mobile nav + guided project chatbot
README.md      this file
```

## What's in the page

- **Header** — navigation on the left, logo on the right, collapsing to a menu button under 900px.
- **Hero** — the reference agent loop drawn as a CSS schematic (Input → Agent → Action, with a
  feedback path back to the agent).
- **Agent summary & architecture** — six real-world agent patterns in a responsive grid
  (1 column on mobile, 2 on tablet, 3 on desktop). Each card carries its own flow diagram, which
  stacks vertically on narrow screens and runs horizontally from 640px up.
- **Core capabilities** — Copilot Studio, GitHub Harness, Classic AI, Agentic AI, Power Automation.
- **How we deliver** — four delivery stages.
- **Footer** — `PEOPLE | AGENTS | AUTOMATION | A SECURE TOMORROW`.
- **Project guide chatbot** — floating bottom-right, with suggested prompt buttons, free-text
  keyword matching, and buttons that scroll to and briefly highlight the matching section.

## Run it locally

Open `index.html` in a browser. That's it. If you prefer a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

### Option A — through the web interface

1. Create a new repository on GitHub (public, no README — you already have one).
2. On the empty repository page choose **uploading an existing file**.
3. Drag `index.html`, `style.css`, `script.js` and `README.md` in, then commit to `main`.
   Keep all four files at the repository root so `index.html` is the entry point.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to *Deploy from a branch*, then pick
   branch `main` and folder `/ (root)`. Save.
6. Wait about a minute and reload the Pages settings screen. Your site is at
   `https://<your-username>.github.io/<repository-name>/`.

### Option B — from the command line

```bash
cd copilotops-site
git init
git add .
git commit -m "Add CopilotOps site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repository-name>.git
git push -u origin main
```

Then follow steps 4–6 above.

## Customising

| What to change | Where |
| --- | --- |
| Colours, spacing, type scale | the `:root` block at the top of `style.css` |
| Logo | the `<img>` inside `.brand` in `index.html` |
| Agent cards | the `<article class="agent-card">` blocks in `index.html` |
| Chatbot answers | the `TOPICS` object in `script.js` |
| Which prompts appear first | the `STARTER_PROMPTS` array in `script.js` |

To add a chatbot topic, add one entry to `TOPICS`:

```js
security: {
  label: 'How do you handle security?',
  keywords: ['security', 'compliance', 'audit', 'soc2'],
  reply: ['First paragraph.', 'Second paragraph.'],
  target: '#delivery',        // any element id on the page
  cta: 'See the guardrails'
}
```

The prompt button, keyword matching and scroll link are all wired up from that object.

## Notes

- The logo is loaded from an external URL. For a fully self-contained site, download the image
  into an `assets/` folder and change the `src` to `assets/logo.jpg`.
- The chatbot is frontend-only: answers are written in `script.js`, nothing is sent anywhere.
  To connect a real model later, replace the body of `respond()` with a `fetch` call to your own
  backend — never put an API key in this file, since everything here is public.
- Accessibility: skip link, visible keyboard focus, `aria-expanded` on both toggles, a live region
  on the chat log, and `prefers-reduced-motion` respected.
- Tested layout widths: 320px, 375px, 768px, 1024px, 1440px.

## Licence

Content and copy are sample material. Replace the client figures with your own before publishing.
