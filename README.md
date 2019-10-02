# website

![GitHub](https://img.shields.io/github/license/SamChou19815/website.svg)
![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![code style: black](https://img.shields.io/badge/code_style-black-000000.svg)

![Deployment](https://github.com/SamChou19815/website/workflows/CD/badge.svg)

This is a monorepo of Sam's [website](https://developersam.com).

## Included Sites

- [blog](https://blog.developersam.com)
- [main-site](https://developersam.com)
- [samlang-demo](https://samlang-demo.developersam.com)
- [samlang-docs](https://samlang.developersam.com)
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

## Builder

The [`builder/`](builder/) folder contains Python code to compute dependencies between different
Yarn workspaces and use that to generate GitHub Actions workflow files to accurately decide the
order of building steps. In the future, it's expected to handle all build related job, including
local building.

## Stability

This repository will be in 'move-fast' mode. i.e. Unstable technologies and libraries can go into
master and be deployed on Sam's website.
