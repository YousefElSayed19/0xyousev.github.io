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
| Look and feel | `static/css/style.css`, `layouts/` |

## Add a write-up or blog post

1. Copy the front matter from `content/writeups/example-format.md`.
2. Save it as `content/writeups/<short-name>.md` (or `content/blogs/` for a blog post). The file name becomes the URL.
3. Commit and push. Posts with `draft: true` or a future date stay hidden.

Images: put them in `static/images/` and use `![alt](/images/name.png)`. The leading slash is fixed up automatically, so it also works when the site lives under a sub-path.

## Shortcodes

```
{{< chips "Python, Bash, Frida" >}}

{{< cards >}}
{{< project name="Name" url="https://..." tags="Web, Hard" >}}
Short description in Markdown.
{{< /project >}}
{{< /cards >}}
```

## CV download

Put the PDF in `static/` and uncomment `cv = "..."` in `hugo.toml`. Check the PDF for a phone number or other private details first, because everything in `static/` is public.

## Local preview

```
hugo server
```
