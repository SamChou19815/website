# website

[![Build Status](https://action-badges.now.sh/SamChou19815/website)](https://github.com/SamChou19815/website)
![GitHub](https://img.shields.io/github/license/SamChou19815/website.svg)

This is a monorepo of Sam's [website](https://developersam.com).

## Included Sites

- [blog](https://blog.developersam.com)
- [main-site](https://developersam.com)
- [samlang-demo](https://samlang-demo.developersam.com)
- [ten-web](https://ten.developersam.com)

## Technology Stack

- Frontend
  - Build System: Yarn
  - Language: TypeScript
  - Library: React
  - UI: Material-UI
  - Hosting: Firebase
- Backend
  - Languages
    - Go
    - Kotlin
  - Hosting
    - Google Cloud Functions
    - Google Cloud Run
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
