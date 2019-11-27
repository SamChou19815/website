---
title: Move Fast with Automation Powered Monorepo
tags: [design-choices, tech-journey]
---

In the last article [The Road to Better Engineering](/2019/08/17/the-road-to-better-engineering), I
promised that there will be a new post about my recent website re-architecturing effort. In the past
week, I am working to gradually transform the website monorepo into a repository with latest
technologies and reliable automation. At the time of writing this article, the transformation is
complete and the repository has reached a state that I am mostly satisfied with.

<!--truncate-->

### Background

The last large-scale architecture update happens almost a year ago.
[This blog post](/2018/08/01/website-architecture-update) details the journey of moving the website
into Google Kubernetes Engine.

GKE serves my website well, except that it's too expensive. The minimum cost to setup some running
cluster is $14 per month, since Kubernetes master eats up a lot of resources. Also, I need to spend
$18 per month just to setup a load balancer, which is only used to do some simple URL dispatch work.

Running websites on Kubernetes looks cool. However, my $1500 Google Cloud credit would expire in
mid-March this year. Paying $32 a month for a random personal website without many visitors is not
fun. Therefore, I am actively seeking alternatives since last year.

I swiftly performed a migration mostly during my university's February break. In the process, I
nuked some apps that I no longer use and only kept a TEN game and my programming language
interpreter. I rewrote the frontend with React and Material-UI and completely redesigned my
homepage. To migrate as quickly as possible, I decided to throw everything into the
[`website`](https://github.com/SamChou19815/website) repository, and blatantly copy-pasted my code
here and there.

Later, when Google Cloud Run is released, I moved the entire backend away from Google App Engine. I
also rewrote TEN AI in Golang to move that part into Google Cloud Function. When Docusaurus V2 Alpha
appeared stable enough for me, I migrated my blog to Docusaurus and placed it inside the same
monorepo.

### Problems

By the time I'm seriously thinking about cleaning the repository, it is in a crazy state:

- It has six moving parts: `blog`, `main-site-frontend`, `sam-highlighter`, `samlang-demo-frontend`,
  `samlang-demo-backend`, and `ten-web-frontend`.
- `main-site-frontend`, `samlang-demo-frontend` and `ten-web-frontend` have identical React setup,
  but the configuration file has been duplicated a lot. Performing a React version upgrade across
  all three projects is very painful. I have several different `.eslintrc` and `tsconfig.json` files
  that almost have the same content.
- `blog`, `main-site-frontend`, and `samlang-demo-frontend` share the same `sam-highlighter`, but
  the build script is written in an adhoc way. If the dependency chain gets any more complicated,
  maintainence would be a nightmare.
- Continuous integration is doing a lot of wasted work: we always unconditionally build everything.
- Continuous deployment is using an ad-hoc script that uses some git commands to decide what to
  deploy. The script itself is not very maintainable.
- Even though CI/CD is setup, it's still possible for me to break the build and take another 20
  commits to fix it.

It might appear to you that the repository is just fundamentally broken and there is no way to
rescue it. Nevertheless, after some analysis, I conclude that there are only two fundamental
problems: duplication and lack of good automation. It **can** be fixed.

### Better Engineering Efforts

#### Step 1: Manually Setup GitHub Actions

The ugliest part of the old workflow is this deployment
[script](https://github.com/SamChou19815/website/blob/3796bc4ace83df5851515895e768c89581f00806/ci-deploy).
It doesn't intelligently decide whether we need to build the `sam-highlighter` package and it relies
on using some `git log` command to decide what has changed, and then use bash's `if` statements to
invoke different deployment commands. The approach is not very maintainable since a bash script is
not designed to maintain potentially Turing complete build logic. In addition, it does not provide
good visual signals to CI system since everything has to be merged into a single command.

Luckily, by the time I planned to perform the cleanup, I have received beta access to
[GitHub Actions](https://github.com/features/actions). GitHub Actions support conditional workflows
based on branches and changed path out of the box and I can visually see whether a workflow job is
actually run or skipped. Unfortunately, GitHub Actions are not Turing complete at this point: it
especially bans starting another workflow within a workflow. Therefore, I will need to come up with
my own systems to make GitHub Actions to satisfy my needs.

Nonetheless, GitHub Actions are already much better than the current hacky setup so I decide to
proceed and make it better later. After some experimentation, I decided to completely split CI and
CD workflows:

- CI workflows are used to ensure that the code quality is OK and a commit does not break anything.
- CD workflows are purely used for automatic deployments.

This setup works well with GitHub's conditional workflow running based on events (pull request or
commits) and change paths. To accomodate this change, I setup branch protection for master branch so
that we can enforce CI checks always pass. Since it is _my_ repository, I can enable a much stronger
branch protection:

- Absolutely no force push
- Signed commits
- Status checks must always pass

(The only missing piece is required code review. However, no one would review my code since it's my
website repo.)

After several iterations, I was able to manually setup some workflows to intelligently decide what
do build and deploy. Here are the CI and CD workflow configuration for my main site.

```yml
# Source: https://github.com/SamChou19815/website/blob
# /3d8fbc6f3fbfcc7a0a3e1c40d7c32e2f21a5129
# /.github/workflows/ci-workflow-main-site-frontend.yml

name: ci-main-site-frontend
on:
  pull_request:
    paths:
      - .github/workflows/*
      - sam-highlighter/*
      - main-site-frontend/*

jobs:
  check-lint-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Yarn Install
        run: yarn install
      # Build Dependencies
      - name: Build sam-highlighter
        run: yarn workspace sam-highlighter build
      # Run Checks
      - name: Type Check
        run: yarn workspace main-site-frontend tsc
      - name: Lint
        run: yarn workspace main-site-frontend lint
      - name: Build
        run: yarn workspace main-site-frontend build
```

```yml
# Source: https://github.com/SamChou19815/website/blob
# /03d8fbc6f3fbfcc7a0a3e1c40d7c32e2f21a5129
# /.github/workflows/cd-workflow-main-site-frontend.yml

name: cd-main-site-frontend
on:
  push:
    branches:
      - master
    paths:
      - .github/workflows/*
      - sam-highlighter/*
      - main-site-frontend/*

jobs:
  check-lint-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Set up Node
        uses: actions/setup-node@v1
      - name: Yarn Install
        run: yarn install
      # Build Dependencies
      - name: Build sam-highlighter
        run: yarn workspace sam-highlighter build
      # Build
      - name: Build
        run: yarn workspace main-site-frontend build
      # Deploy
      - name: Deploy
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
        run: |
          ./main-site-frontend/node_modules/.bin/firebase deploy \
          --token=$FIREBASE_TOKEN --non-interactive --only hosting:main-site

```

#### Step 2: Deduplication

I could continue to seek ways to make the entire workflow maintenance process more automated, but
given that I already have a much more robust development process setup, I can first start
_confidently_ clean up the codebase, especially, deduplicating different configurations and
dependencies.

My first step is to fully take advantage of Yarn workspace's feature to hoist all the common
dev-dependencies: it's better to have a way to easily enforce that we only have **one** version of
TypeScript, ESLint, React developer tools, etc.

I started with dependency hoisting since it only requires me to move some lines from one
`package.json` to another and modify the workflow files to also watch for the root `package.json`.
Merging `tscondig.json` is also easy since TypeScript provides `"extends"` field to help these types
of use cases. Merging ESLint configurations is more involved since both `create-react-app` and my
workspace have different versions of ESLint and `@typescript-eslint` configuration. It took me a
while to hack with NodeJS's module resolution algorithm to put the dependency declaration in the
right place.

The efforts pay off. After the deduplication process, the directory layout of a sub-package is much
cleaner:

![Before and after merging](/img/2019-08-24-automation-monorepo/merge-before-after.png)

Unfortunately, I was not able to hoist React version declaration without making linter sad. :(

(`tsconfig.json` only contains `extends` and `include` now.)

#### Step 3: Better Automation

Once most duplications are eliminated, I finally have a better sense of what needs to be done to
better automate workflow maintenance. The problem is a classic one: how to automatically and
accurately decide dependencies, reverse dependencies, and their transitive closure.

You might argue this might not be necessary since my website repository's dependency chain is not
crazily deep. However, I already have headaches maintaining this. To clarify again, this is my
current dependency chain:

```text
tooling (infra)
  ^
  |                                            A <----- B: B depends on A
sam-highlighter
  ^
  |<----- blog
  |<----- main-site-frontend
  |<----- samlang-demo-frontend
  |<----- samlang-docs
```

I already have a two-level dependency chain and manually edit workflow files when I have new
dependencies will be very error-prone. I already have plans to introduce some additional layer of
React standard library for my website group, so it's better to solve this scalability problem sooner
rather than later.

Publishing each package to NPM is not an option for me: it will simply introduce another package
version management hell. Locking down a version will nullify my efforts to move fast and experiment
new things with my website repository.

There are already some open source tools to solve this problem for large monorepos: Google invented
[Bazel](https://bazel.build/) and Facebook invented [Buck](https://buck.build/). However, none of
the existing tools handle NodeJS ecosystem well. While it is possible to use
[Bazel for NodeJS](https://github.com/bazelbuild/rules_nodejs), it is too invasive to the current
setup and it will almost certainly break the opinioned `create-react-app` setup. Switching to Bazel
might also disconnect my repository's toolchain from the larger open source community.

After careful research, I decided to build my own dependency manager to solve this problem. GitHub
Actions (nor does any widely used CI system) will not be Turing complete in the new future, so the
best approach would be _programatically generating_ workflow files. No existing tool can
automatically handle that. Therefore, instead of having huge effort migrating the codebase to an
existing tool and at the end still writing another script to query the tool to generate workflow
files, it's better to start with my own tool that can easily adapt to the existing codebase and
handle workflow generation out of the box.

Yarn workspace already provides a good low-level primitive to handle that. `yarn workspaces info`
already gives us a JSON of all direct dependencies between packages:

```json
{
  "blog": {
    "location": "blog",
    "workspaceDependencies": [
      "sam-highlighter"
    ],
    "mismatchedWorkspaceDependencies": []
  },
  "main-site-frontend": {
    "location": "main-site-frontend",
    "workspaceDependencies": [
      "sam-highlighter"
    ],
    "mismatchedWorkspaceDependencies": []
  },
  "sam-highlighter": {
    "location": "sam-highlighter",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "samlang-demo-frontend": {
    "location": "samlang-demo-frontend",
    "workspaceDependencies": [
      "sam-highlighter"
    ],
    "mismatchedWorkspaceDependencies": []
  },
  "samlang-docs": {
    "location": "samlang-docs",
    "workspaceDependencies": [
      "sam-highlighter"
    ],
    "mismatchedWorkspaceDependencies": []
  },
  "ten-web-frontend": {
    "location": "ten-web-frontend",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "tooling": {
    "location": "tooling",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  }
}
```

Powered with this JSON query, I wrote a simple dependency management tool that can check for cyclic
dependency and automatically computes the transitive closure of reverse dependency for a given
workspace package. Armed with this information, generating workflow files that automatically build
dependencies will be trivial. To ensure that the workflow files do not become out of sync, I write
another CI job to automatically check running workflow generation jobs does not introduce new
changes.

#### Step 4: Profit

Even during the large refactoring time, I already started to notice a large reduction of build
failures in master branch. In general, my website becomes harder to build and it becomes closer to
my goal of "move fast without breaking things". This is critical for students like me who do not
have a lot of time to update my website to confidently upgrade dependency versions without too much
overhead.

It's also visually pleasing to see so many checks passing in a pull request:

![Many checks passing](/img/2019-08-24-automation-monorepo/checks-passing.png)

### Summary

This summarizes my effort in this year to upgrade and modernize my website's tech stack. It mostly
focuses on automation and code quality. I believe these efforts will eventually pay off when I try
to introduce more unstable technology into the codebase in the future.
