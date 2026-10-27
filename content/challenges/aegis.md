---
title: "Project AEGIS: three API styles in one portal"
short: "Project AEGIS"
date: 2026-10-06
weight: 2
description: "A hard API challenge. One fictional employee portal hides three different API architectures, and the flag only assembles after three separate wins."
tags: ["api", "rest", "graphql", "grpc", "ctf-design"]
track: "API"
difficulty: "Hard"
stack: ["Node.js 20", "Express", "GraphQL", "gRPC", "Docker Compose"]
delivery: "Docker Compose, in-memory state, reset with docker compose restart"
repo: "https://github.com/YousefElSayed19/CTF-API---hard---"
---
From the outside, AEGIS is the internal employee portal of a fictional company: a login page, an employee profile and a couple of simple self-service features. Behind it, several backend services share the same underlying data. The player isn't told what those services are, how many there are, or how they connect. Working that out is part of the challenge.

## Why I built it

Most API practice stops at REST. Real systems mix styles, and an attacker who only knows one will miss the weakness that sits in another. AEGIS puts REST, GraphQL and gRPC behind one entry point, so a player has to recognise which kind of service they're talking to and move between them.

The flag only assembles once the player has gathered three separate credential fragments from three separate parts of the system. Partial progress is acknowledged along the way, so nobody is left guessing whether they're on track.

## How it runs

```bash
docker compose up --build
```

The challenge starts at `http://localhost:3000`, which is the only entry point. All state lives in memory, so `docker compose restart` returns it to a clean start.

## What it tests

- Intercepting and modifying HTTP traffic with a proxy such as Burp Suite
- Testing REST, GraphQL and gRPC services, not just one
- Authentication and authorization flaws, and business logic flaws
- Reading every response carefully, because the application gives away more than it first appears to

## Rules for players

Only touch the services the challenge exposes on your own machine. Don't brute-force the login form with generic credential lists, because the starting account is discoverable through the application. Automated scanning and fuzzing are allowed and, in places, expected.
