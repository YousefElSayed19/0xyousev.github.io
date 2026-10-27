# Personal site

Hugo + GitHub Pages. Push to `main` and the site rebuilds by itself (about a minute).

## Where things live

| What | Where |
| --- | --- |
| Site title, links, social profiles, menu | `hugo.toml` |
| Home page text | `content/_index.md` |
| Home page badges and "What I work on" cards | `data/home.yaml` |
| About and Projects pages | `content/about.md`, `content/projects.md` |
| Write-ups and blog posts | `content/writeups/`, `content/blogs/` |
| Look and feel, animations | `static/css/style.css`, `static/js/site.js`, `layouts/` |
| Search (press `/` or Ctrl+K) | `static/js/search.js`, index built from `layouts/index.json` |
| Cheatsheets | `content/cheatsheets/` |

## Add a write-up or blog post

Quickest: `hugo new writeups/<short-name>.md` (uses `archetypes/writeups.md`).

1. Copy the front matter from `content/writeups/example-format.md`.
2. Save it as `content/writeups/<short-name>.md` (or `content/blogs/` for a blog post). The file name becomes the URL.
3. Commit and push. Posts with `draft: true` or a future date stay hidden.

Images: put them in `static/images/` and use `![alt](/images/name.png)`. The leading slash is fixed up automatically, so it also works when the site lives under a sub-path.

Write-ups can set `platform`, `difficulty`, `os`, `category` and `tools` in the front matter. They show up as a facts box on the post and as badges in lists. Tags get their own pages under `/tags/`.

Only publish Hack The Box machines after they retire; HTB does not allow public solutions for active ones.

## Shortcodes

```
{{< chips "Python, Bash, Frida" >}}

{{< cards >}}
{{< project name="Name" url="https://..." tags="Web, Hard" >}}
Short description in Markdown.
{{< /project >}}
{{< /cards >}}
```

```
{{< callout type="tip" title="Optional title" >}}Types: info, tip, warn, danger{{< /callout >}}

{{< spoiler label="Show the flag" >}}hidden until clicked{{< /spoiler >}}

{{< timeline >}}
{{< event date="2026" title="Role" where="Place" >}}Details{{< /event >}}
{{< /timeline >}}
```

## Motion

Scroll reveals, the typing terminal, card glow, page transitions and the avatar ring are all disabled automatically for visitors who ask their system for reduced motion, and the page works without JavaScript.

## CV download

Put the PDF in `static/` and uncomment `cv = "..."` in `hugo.toml`. Check the PDF for a phone number or other private details first, because everything in `static/` is public.

## Local preview

```
hugo server
```
