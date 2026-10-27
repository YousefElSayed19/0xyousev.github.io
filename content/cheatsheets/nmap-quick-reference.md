---
title: "Nmap quick reference"
date: 2026-10-27
description: "The scans I run first, and the flags that change them."
tags: ["recon", "network", "nmap"]
---
Notes for labs, CTFs and authorized tests. Replace `$IP` with your target.

## First pass

```bash
# Fast: all TCP ports, no DNS, no ping (useful when ICMP is filtered)
nmap -p- -n -Pn --min-rate 2000 -oN all-ports.txt $IP

# Then scan only the open ports in depth
nmap -sC -sV -p 22,80,443 -oN detail.txt $IP
```

`-sC` runs the default NSE scripts and `-sV` probes service versions. Saving output with `-oN` means you never need to rescan to re-read results.

## Flags worth remembering

| Flag | What it does |
| --- | --- |
| `-p-` | scan all 65535 TCP ports |
| `-Pn` | skip host discovery, treat the host as up |
| `-n` | never resolve DNS, faster |
| `-sU --top-ports 20` | quick UDP check of the common ports |
| `--min-rate 2000` | send at least 2000 packets per second (lower it on fragile networks) |
| `-oA name` | write normal, XML and grepable output at once |
| `--script vuln` | run the vulnerability category of NSE scripts |

{{< callout type="warn" title="Keep it quiet when it matters" >}}
`--min-rate` and `-T4` are loud. On a real engagement, follow the rules of engagement for scan speed.
{{< /callout >}}
