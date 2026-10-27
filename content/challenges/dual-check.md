---
title: "dual-check: two binaries, one secret"
short: "dual-check"
date: 2026-10-21
weight: 4
description: "A medium reverse engineering challenge. Two Windows executables are cryptographically bound, so neither gives up the flag alone."
tags: ["reverse-engineering", "windows", "ghidra", "crypto", "ctf-design"]
track: "Reverse engineering"
difficulty: "Medium"
stack: ["C", "MinGW", "Windows PE", "AES-128-CBC", "SHA-256"]
delivery: "Two executables and a flag checker, fully offline"
repo: "https://github.com/YousefElSayed19/CTF-Reverse-Engineering---medium--"
---
The player gets two small Windows programs. `game.exe` looks like a password-protected game with a quiz and a number-guessing round. `checker.exe` looks like a standalone flag-verification tool. Neither documents how it works, and neither gives anything away if you just try guesses.

## Why I built it

I wanted a static reverse engineering challenge that rewards understanding over tool-running. A plain `strings` scan reveals nothing, and one of the two values the checker needs is not stored anywhere in the file. The player has to understand an algorithm in the decompiled code and recompute the value themselves.

It went through several rounds of redesign, from a Python prototype to three C versions, before it ended up where it is. The repository keeps those earlier iterations.

## What it tests

- Static analysis in Ghidra: importing, auto-analysis, reading decompiled pseudo-C and raw bytes
- Recognising and reversing common client-side obfuscation such as XOR, Base64 and byte-masking
- Getting past a basic anti-debugging check without debugging at all
- Reading a custom chained transform from decompiled code and reproducing it faithfully in Python or CyberChef
- Using AES-128-CBC correctly by extracting the key material, IV and ciphertext

{{< spoiler label="Show the design details" >}}
Recovering the first password from `game.exe` means unwinding a byte-mask XOR, then Base64, then a repeating four-byte XOR whose key has to be read from the data section. Solving the quiz and mini-game reveals a second password. `checker.exe` then needs that password plus a value derived by re-implementing a chained transform, which produces the AES-128 key that decrypts the embedded flag.
{{< /spoiler >}}

## What I wanted people to take away

Anything embedded in a binary that an attacker can run and disassemble offline can be recovered, and obfuscation only raises the cost. Splitting a secret across two files gives no real protection if both ship to the same untrusted client.

## What ships with it

A player briefing with no spoilers, design document, security report, remediation advice, validation report and an official solution with screenshots. I submitted it to Duckurity's OpenLabs as part of a lab intake proposal.
