# website

![CLA assistant](https://cla-assistant.io/readme/badge/SamChou19815/website)
![GitHub](https://img.shields.io/github/license/SamChou19815/website.svg)
![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

This is a monorepo of Sam's [website](https://developersam.com).

## Included Sites

- [blog](https://blog.developersam.com)
- [samlang](https://samlang.developersam.com)
- [samlang-demo](https://samlang-demo.developersam.com)
- [tasks](https://tasks.developersam.com)
- [ten](https://ten.developersam.com)
- [www](https://developersam.com)

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
    - Firebase
    - Google Cloud Functions
    - Google Cloud Run
- CI/CD
  - Provider: GitHub Actions
  - Enforcement
    - Branch protection enabled for master branch.
    - Every pull request to be merged into master must pass all CI checks
  - Deployment
    - Automatically deploy changes to Firebase Hosting for each commit on master

## Tools

The [`tools/`](tools/) folder contains NodeJS code to compute dependencies between different
Yarn workspaces and use that to generate GitHub Actions workflow files to accurately decide the
order of building steps. In the future, it's expected to handle all build related job, including
local building.

## Stability

This repository will be in 'move-fast' mode. i.e. Unstable technologies and libraries can go into
master and be deployed on Sam's website.
