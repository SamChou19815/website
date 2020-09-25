---
id: website-repo
title: Website Repository Setup
---

## Repository convention

- All configuration that can potentially affect the entire repository must be inside `configuration`
  directory.
- Packages installed and managed by latest Yarn v2 release.
- Must use Yarn v2's workspace feature.
- Root workspace has `format:check`, `lint`, `compile`, `codegen`, `test` command.
- Managed by dev-sam's `monorail` tool.
- Each workspace follows a set of naming conventions.
  - Tooling workspace names must start with a predefined set of prefix.
  - Library workspace names must start with `lib-`
  - The rest workspaces are interpreted as deployable projects.
  - Each workspace must have a `compile` job.
  - Each project workspaces must have a `build` and `deploy` job, which will run in CI stage to
    deploy to production.
  - Each commit to master will be automatically pushed to production. No staging.

## GitHub Actions secrets

- `GH_TOKEN`
- `FIREBASE_TOKEN`

## Infra Tools

- `monorail` for incremental compilation and bundling
- `sam-bundler` as a wrapper for `ncc` to produce self-contained NodeJS code
- `sam-codegen` for handling incremental code generation
- `sam-watcher-server` to report changed files
