---
title: "VaultCorp: a six-stage SaaS exploit chain"
short: "VaultCorp"
date: 2026-10-21
weight: 1
description: "A hard web challenge that chains six real vulnerabilities, from a leaked client-side secret to SSRF-driven remote code execution."
tags: ["web", "ssrf", "rce", "ctf-design"]
track: "Web"
difficulty: "Hard"
stack: ["ASP.NET Core 8", "Razor Pages", "SQLite", "Hangfire", "Docker"]
delivery: "Single container, one docker compose up"
repo: "https://github.com/YousefElSayed19/CTF-Web---Expert--"
---
VaultCorp is a fictional cloud backup service for small businesses. Anyone can sign up for a free trial and get a private workspace, and a red team has been asked to assess the platform. The player gets one thing: the URL.

## Why I built it

I wanted a web challenge where every step is something that really happens in the wild, with nothing contrived. Each vulnerability in the chain has a published CVE, an OWASP entry or a documented bug bounty report, and no stage can be skipped, because each one produces what the next one needs.

Every registration provisions an isolated tenant with its own admin credentials and a handful of decoy employee accounts, so players can't interfere with each other.

## What it tests

- Why encoding a secret in client-side JavaScript is not a control
- Why an unlinked endpoint is still reachable
- Why a blacklist-style SSRF filter fails against alternate IP forms, and what the correct fix looks like
- Why "the request came from loopback" is not an identity check
- How a code execution primitive becomes a one-request data exfiltration path

{{< spoiler label="Show the vulnerability classes in the chain" >}}
1. A client-side credential leak behind simple XOR and Base64 obfuscation
2. A hidden support login found by directory brute-forcing
3. SSRF with a filter bypass using alternate IP notation
4. An internal Hangfire dashboard trusted because the request comes from loopback (the CVE-2021-41238 pattern)
5. Job injection that leads to remote code execution
6. Reading the flag through static file serving
{{< /spoiler >}}

## What ships with it

A player briefing with no spoilers, a design document, a security report with root cause analysis, remediation advice, a validation report and an official solution with screenshots. Technique pages for the four main skills are included too. I submitted it to Duckurity's OpenLabs catalog as a pull request.

{{< callout type="info" title="Want to play it blind?" >}}
The repository contains the full official solution under `docs/`. If you want to attempt it, read only the player briefing first.
{{< /callout >}}
