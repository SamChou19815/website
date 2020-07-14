---
id: intro
title: Introduction
---

## Included Sites

- [blog](https://blog.developersam.com)
- [samlang](https://samlang.developersam.com)
- [ten](https://ten.developersam.com)
- [wiki](https://wiki.developersam.com)
- [www](https://developersam.com)

## Technology Stack

- Frontend
  - Build System: Yarn V2 with pnp
  - Monorepo Tool: Sam's [monorail](./website-repo.md#monorail-monorepo-tool).
  - Language: TypeScript
  - Library: React
  - UI: Infima/Material-UI
  - Hosting: Firebase
- Backend
  - Languages
    - Go
  - Hosting
    - Firebase
- CI/CD
  - Provider: GitHub Actions
  - Enforcement
    - Branch protection enabled for master branch.
    - Every pull request to be merged into master must pass all CI checks
  - Deployment
    - Automatically deploy changes to Firebase Hosting for each commit on master

## Stability

This repository will be in 'move-fast' mode. i.e. Unstable technologies and libraries can go into
master and be deployed on Sam's website.
