# CopilotOps — Enterprise Agent Architecture & Automation

A static, mobile-first marketing site. No build step, no dependencies, no framework — three files,
ready to drop into a repository and serve from GitHub Pages.

```
index.html    structure, content, and every logo image (embedded inline — see note below)
style.css     mobile-first styles
script.js     mobile nav + guided project chatbot
README.md     this file
```

**There is no `assets/` folder.** Every logo — the header lockup, the footer mark, the chat bubble
icon, the favicon — is embedded directly inside `index.html` and `style.css` as base64 image data.
This is deliberate: on an earlier upload, GitHub's web "Add file" flow silently dropped the
`assets/` folder and `script.js`, which broke the logo and the chatbot. Inlining the images removes
that failure mode entirely — there is nothing left to lose in transit. The trade-off is larger file
sizes (`index.html` is about 620 KB, `style.css` about 190 KB) — normal for a page with several
embedded PNGs, and still loads instantly over a normal connection.

**Official contact address: copilotops@gmail.com** — used in the contact section, the footer and
the chatbot. It appears in exactly three places: two `mailto:` links in `index.html` and the
`CONTACT_EMAIL` constant at the top of `script.js`.

## What's in the page

- **Header** — logo on the left, nav and a light/dark theme toggle on the right, collapsing to a
  menu button below 900px. The nav's "Use cases" item is a dropdown.
- **Hero** — a tagline ("From automating existing processes to building intelligent agents, we make
  AI work for your enterprise.") over the CopilotOps reference architecture: channels and sources →
  agent runtime → systems of action, over a governance rail.
- **Use cases** — five cards (Cowork, Governance, Declarative agents, Scout agent, Voice agent)
  at the top of the Agent summary section, linked from the header dropdown.
- **Agent summary & architecture** — six production patterns in a responsive grid (1 column on
  mobile, 2 on tablet, 3 on desktop). Each card carries its own three-column architecture diagram
  with a per-build governance rail underneath.
- **Services we are offering** — Copilot Studio, Copilot Studio's GitHub harness, and Power
  Automation.
- **How we deliver** — four delivery stages.
- **Footer** — reversed logo, `PEOPLE | AGENTS | AUTOMATION | A SECURE TOMORROW`, and the contact
  address.
- **Project guide chatbot** — floating bottom-right, branded with the C mark, with suggested prompt
  buttons, free-text keyword matching, and buttons that scroll to and briefly highlight the
  matching section.
- **Theme** — light/dark toggle in the header. Follows the visitor's system preference on first
  visit, remembers their choice in `localStorage`, and is set before first paint to avoid a flash.

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

1. Open your existing repository (`copilotops/r9.github.io-CopilotOps`, or wherever it lives).
2. **Delete the old `index.html`, `style.css`, `copilotops-lockup.png` and `copilotops-mark.png`**
   from the repo first — the old files reference an `assets/` folder that no longer exists, and
   leaving them in place causes exactly the broken-logo problem this version fixes.
3. Choose **Add file → Upload files** and drag in the three files from this folder: `index.html`,
   `style.css`, `script.js`. (`README.md` is optional to upload — it's for your own reference.)
   Commit straight to `main`.
4. Go to **Settings → Pages** and confirm the green "Your site is live at …" banner is still
   showing your correct address. Give the new commit a minute to build, then reload the site with
   a hard refresh (Ctrl/Cmd + Shift + R) so your browser doesn't show a cached, broken version.

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
| Logo images | re-export as base64 and replace the matching `data:image/png;base64,...` string — see "Replacing a logo" below |
| Contact address | two `mailto:` links in `index.html`, `CONTACT_EMAIL` in `script.js` |
| Agent cards and their diagrams | the `<article class="agent-card">` blocks in `index.html` |
| Chatbot answers | the `TOPICS` object in `script.js` |
| Which prompts appear first | the `STARTER_PROMPTS` array in `script.js` |

### Replacing a logo

Every logo is embedded as inline base64 data rather than a linked file, so there's no `assets/`
folder to keep in sync. To swap one out:

```bash
# macOS / Linux
base64 -i new-logo.png | tr -d '\n' > new-logo.b64

# then in index.html or style.css, replace everything between
# data:image/png;base64,  and  the closing " or )
# with the contents of new-logo.b64
```

There are six occurrences in `index.html` (header logo, footer logo, chat launcher icon, chat panel
icon, favicon, apple-touch-icon) and two in `style.css` (the faint background watermarks in the
hero and contact sections) — all of the same three source images repeated.

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
