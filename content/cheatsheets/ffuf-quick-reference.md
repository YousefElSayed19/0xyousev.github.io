---
title: "ffuf quick reference"
date: 2026-10-27
description: "Directory, file and virtual host fuzzing with ffuf."
tags: ["recon", "web", "ffuf"]
---
Notes for labs, CTFs and authorized tests. The word `FUZZ` marks where ffuf substitutes each wordlist entry.

## Directories and files

```bash
ffuf -u http://$IP/FUZZ -w /usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt

# add extensions
ffuf -u http://$IP/FUZZ -w wordlist.txt -e .php,.txt,.bak
```

## Virtual hosts

```bash
ffuf -u http://$IP/ -H "Host: FUZZ.target.htb" -w subdomains.txt -fs 1234
```

Run it once without `-fs`, note the response size that appears for every wrong guess, then filter that size out.

## Filters

| Flag | Meaning |
| --- | --- |
| `-mc 200,301` | only show these status codes |
| `-fc 404` | hide this status code |
| `-fs N` | hide responses of N bytes |
| `-fw N` / `-fl N` | hide by word or line count |
| `-t 40` | number of threads |
| `-recursion` | follow discovered directories |
