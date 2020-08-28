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

## `monorail` monorepo tool

<!-- prettier-ignore-start -->
:::caution
This document might not be as updated as latest monorail build. Only documented features
here is guaranteed to be _relatively_ stable.

Currently, it is outdated. TODO for @dev-sam: fix it.
:::
<!-- prettier-ignore-end -->

### Installation

Download the self-contained
[code](https://github.com/SamChou19815/website/blob/master/packages/monorail/bin/monorail) checked
in the repo, and run it directly. You might need to reset the executable bit.

You can add `monorail` to your `PATH` so that you can directly run `monorail`.

### Configuration

Your repo must be managed by Yarn v2 workspaces, so the root `package.json` should contain
`workspaces` field.

### Incremental Compile

TODO
