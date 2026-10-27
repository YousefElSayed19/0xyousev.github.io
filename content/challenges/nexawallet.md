---
title: "NexaWallet: an Android crackme that fights back"
short: "NexaWallet"
date: 2026-10-21
weight: 3
description: "A hard Android reverse engineering challenge. The app detects instrumentation, so a casual Frida hook gets you nowhere."
tags: ["mobile", "android", "frida", "reverse-engineering", "ctf-design"]
track: "Mobile"
difficulty: "Hard"
stack: ["Kotlin", "Android", "Frida", "jadx"]
delivery: "APK only, bring your own emulator or device"
repo: "https://github.com/YousefElSayed19/CTF-Mobile---hard--"
---
NexaWallet is a small digital wallet app. You can register, log in and transfer money, up to EGP 100.00 per transaction. Send more and the app declines it. The goal is to get the app to approve a transfer above that limit and claim what it prints.

The app is not naive about this. It watches for signs of analysis and shuts itself down if it notices, so decompiling and patching, or a careless instrumentation attempt, won't get you far.

## Why I built it

Client-side security checks are everywhere in mobile apps: root detection, Frida detection, hidden screens, local limits. I wanted a challenge that shows what they are good for (slowing down a casual attacker) and what they are not (an access boundary, once someone has code running inside the process).

There is no backend. Everything the player has to defeat lives inside the APK and is enforced at runtime.

## What it tests

- Static analysis of a modern Kotlin app with jadx, including reading the manifest
- Frida fundamentals: attaching, `Java.perform`, `Java.use` and overriding method implementations
- Diagnosing a hook that installs without errors but never fires, and knowing where to hook instead
- The difference between an Android component being present in the code and being reachable
- Driving behaviour from inside the process, not just observing it

{{< spoiler label="Show the design details" >}}
The anti-analysis layer is three deterministic checks: a Frida loopback port probe, a scan of `/proc/self/maps` for injected libraries, and a live thread-name scan. On top of that sits a hidden, non-exported Activity, plus a second authorization condition that must be satisfied before the over-limit path is reachable. A naive hook on a small wrapper function can be silently defeated by ART method inlining, which is the first lesson the challenge teaches.
{{< /spoiler >}}

## What ships with it

A no-spoiler player briefing, design document, security report, remediation advice and a validation report, plus four technique pages (Frida hooking past ART inlining, why `exported="false"` is not an access boundary, launching an Activity from inside the process with Frida, and why client-side authorization decisions can't be trusted). I submitted it to Duckurity's OpenLabs as part of a lab intake proposal.

{{< callout type="info" title="Want to play it blind?" >}}
The repository includes the official solution under `docs/`. Read only the player briefing first if you want to try it.
{{< /callout >}}
