# Introduction

## Included Sites

- [blog](https://blog.developersam.com)
- [samlang](https://samlang.io)
- [ten](https://ten.developersam.com)
- [wiki](https://wiki.developersam.com)
- [www](https://developersam.com)

## Technology Stack

- Frontend
  - Build System: Yarn V3 with PnP
  - Language: TypeScript
  - Library: React
  - UI: Infima
  - Hosting: Netlify
- Backend
  - Languages
    - Go
  - Hosting
    - Netlify
- CI/CD
  - Provider: GitHub Actions
  - Enforcement
    - Branch protection enabled for `main` branch.
    - Every pull request to be merged into `main` must pass all CI checks
  - Deployment
    - Automatically deploy changes to Netlify for each commit on `main`

## Stability

This repository will be in 'move-fast' mode. i.e. Unstable technologies and libraries can go into
`main` and be deployed on Sam's website.
