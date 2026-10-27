---
title: "Stabilising a shell in a lab"
date: 2026-10-27
description: "Turn a bare shell into a usable terminal with history, arrows and Ctrl+C."
tags: ["post-exploitation", "linux"]
---
You already have a basic shell on a lab machine you're allowed to be on, and it has no tab completion, arrow keys or job control. These steps give you a proper TTY.

## On the target

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
export TERM=xterm
```

## On your machine

Press `Ctrl+Z` to background the shell, then:

```bash
stty raw -echo; fg
```

Press Enter twice. If the window size is wrong, check yours with `stty size` on your own terminal and set it on the target:

```bash
stty rows 40 columns 160
```

{{< callout type="tip" >}}
If Python isn't installed, `script -qc /bin/bash /dev/null` gives a similar result on most Linux targets.
{{< /callout >}}
