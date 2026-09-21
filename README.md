# CopilotOps — Enterprise Agent Architecture & Automation

A static, mobile-first marketing site. No build step, no dependencies, no framework — ready to
drop into a repository and serve from GitHub Pages.

```
index.html                       structure and content
style.css                        mobile-first styles
script.js                        mobile nav + guided project chatbot
assets/
  copilotops-lockup.png          horizontal logo for the header (transparent PNG)
  copilotops-lockup-light.png    reversed lockup for dark backgrounds
  copilotops-logo.png            full stacked logo with tagline
  copilotops-logo-light.png      reversed stacked logo — used in the footer
  copilotops-mark.png            the C mark on its own (chat bubble, touch icon)
  favicon.png                    64px favicon
README.md                        this file
```

All logo files were cut from the supplied brand artwork and keyed to transparency, so they sit
correctly on both the light page background and the navy footer.

**Official contact address: copilotops@gmail.com** — used in the contact section, the footer and
the chatbot. It appears in exactly three places: two `mailto:` links in `index.html` and the
`CONTACT_EMAIL` constant at the top of `script.js`.

## What's in the page

- **Header** — navigation on the left, logo on the right, collapsing to a menu button below 900px.
- **Hero** — the CopilotOps reference architecture: channels and sources → agent runtime →
  systems of action, over a governance rail.
- **Agent summary & architecture** — six production patterns in a responsive grid (1 column on
  mobile, 2 on tablet, 3 on desktop). Each card carries its own three-column architecture diagram
  with a per-build governance rail underneath.
- **Core capabilities** — Copilot Studio, GitHub Harness, Classic AI, Agentic AI, Power Automation.
- **How we deliver** — four delivery stages.
- **Footer** — reversed logo, `PEOPLE | AGENTS | AUTOMATION | A SECURE TOMORROW`, and the contact
  address.
- **Project guide chatbot** — floating bottom-right, branded with the C mark, with suggested prompt
  buttons, free-text keyword matching, and buttons that scroll to and briefly highlight the
  matching section.

## Design system

Colours are sampled from the logo gradient and declared once in `:root`:

| Token | Value | Used for |
| --- | --- | --- |
| `--navy` | `#0A1633` | wordmark ink, body text, dark sections, footer |
| `--blue` | `#2563EB` | links, action stage, primary hover |
| `--violet` | `#7C3AED` | the agent runtime stage — the decision point |
| `--cyan` | `#22D3EE` | input/source stage, footer contact link |
| `--paper` | `#F4F6FB` | page background |

In every diagram the colour carries meaning: cyan is what comes in, violet is where the decision is
made, blue is what changes in a system of record. The classic-AI card deliberately uses neutral
navy for its middle column, because nothing generative happens there.

Typefaces are Space Grotesk (headings, diagram labels) and IBM Plex Sans (body), loaded from
Google Fonts.

## Run it locally

Open `index.html` in a browser. Or, with a local server:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deploy to GitHub Pages

### Option A — through the web interface

1. Create a new repository on GitHub (public).
2. On the empty repository page choose **uploading an existing file**.
3. Drag in `index.html`, `style.css`, `script.js`, `README.md` **and the whole `assets` folder**.
   Keep the file structure exactly as above — `index.html` must sit at the repository root and the
   images must stay inside `assets/`. Commit to `main`.
4. Go to **Settings → Pages**.
5. Under **Build and deployment** set **Source** to *Deploy from a branch*, then pick branch `main`
   and folder `/ (root)`. Save.
6. Wait about a minute, then reload. Your site is at
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
| Logo files | `assets/` — keep the filenames or update the `src` attributes |
| Contact address | two `mailto:` links in `index.html`, `CONTACT_EMAIL` in `script.js` |
| Agent cards and their diagrams | the `<article class="agent-card">` blocks in `index.html` |
| Chatbot answers | the `TOPICS` object in `script.js` |
| Which prompts appear first | the `STARTER_PROMPTS` array in `script.js` |

### Adding an architecture diagram

The diagram is plain markup — three stages, two connectors and a rail:

```html
<figure class="arch">
  <div class="arch__row">
    <div class="arch__stage stage--source">
      <h4>Input</h4>
      <ul><li>First source</li><li>Second source</li></ul>
    </div>
    <div class="arch__conn" aria-hidden="true"><span></span></div>
    <div class="arch__stage stage--agent">
      <h4>Agent</h4>
      <ul><li>Step one</li><li>Step two</li></ul>
    </div>
    <div class="arch__conn" aria-hidden="true"><span></span></div>
    <div class="arch__stage stage--action">
      <h4>Action</h4>
      <ul><li>What changes</li></ul>
    </div>
  </div>
  <p class="arch__rail">Controls that apply to the whole flow</p>
</figure>
```

Swap `stage--agent` for `stage--classic` when the middle column is a trained model rather than a
generative runtime. The row stacks vertically below 640px and runs horizontally above it, with the
connector arrows rotating automatically.

### Adding a chatbot topic

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

- The chatbot is frontend-only: answers live in `script.js` and nothing is sent anywhere. To connect
  a real model later, replace the body of `respond()` with a `fetch` call to your own backend —
  never put an API key in this file, since everything here is public.
- Accessibility: skip link, visible keyboard focus, `aria-expanded` on both toggles, a live region
  on the chat log, and `prefers-reduced-motion` respected.
- Tested layout widths: 320px, 375px, 768px, 1024px, 1440px.
- The client figures in the agent cards are sample material. Replace them with your own before
  publishing.
