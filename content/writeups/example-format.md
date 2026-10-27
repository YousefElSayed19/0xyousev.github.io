---
title: "Example write-up"
date: 2026-10-16
description: "Copy this file to start a new write-up."
tags: ["web", "htb"]
platform: "Hack The Box"
difficulty: "Easy"
os: "Linux"
category: "Web"
tools: ["nmap", "ffuf", "Burp Suite"]
draft: true
---

{{< callout type="warn" title="Only retired machines" >}}
Hack The Box does not allow public solutions for active machines. Publish a machine only after it retires.
{{< /callout >}}

## Recon

```bash
nmap -sC -sV -oN scan.txt 10.10.10.10
```

Write your steps here, including the dead ends. Delete `draft: true` (or set it to `false`) to publish.

## Foothold

## Privilege escalation

{{< spoiler label="Show the flag format" >}}
Put anything spoiler-worthy in here.
{{< /spoiler >}}

## Lessons learned
