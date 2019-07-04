---
title: Automation! Migration to CI/CD System for My Open-Source Projects
tags: [tech-journey]
---

Badges:
![Article Good](https://img.shields.io/badge/article-good-brightgreen.svg)
![Style Good](https://img.shields.io/badge/style-good-brightgreen.svg)
![Examples Good](https://img.shields.io/badge/examples-good-brightgreen.svg)
:)

GitHub badges look good. Having them in GitHub README is an indication of a good open source
project. In the
[last blog post](https://blog.developersam.com/design-choices/2018/08/02/website-architecture-update/), I
talked about how I containerized my website. In this post, I will describe how I setup CI/CD for my
open source projects.

<!--truncate-->

### System Choice

I first started with [Circle CI](https://circleci.com/) because I saw their ads very often on
Twitter. The config of Circle CI was relatively easy: the official docs covers most of the usage I
need. However, Circle CI limited free build minutes, even for open source projects. The limit is
1500 minutes per month, so it's 50 minutes per day on average. It may look fine, but it's too little
compared to the recently released [GCP Cloud Build](https://cloud.google.com/cloud-build/), which
gives 120 minutes for free.

Usually, my Kotlin project builds very fast, but my website's frontend is powered by Angular, and
Angular apps in production mode and SSR are notoriously
[slow to build](https://stackoverflow.com/questions/45242553/how-to-speed-up-the-angular-build-process).
I may mess up with the Angular config and push tens of updates in one day, which can easily exceed
the time limit for Circle CI.

Although GCP Cloud Build looks good, it's relatively new and lacks some of the functionality I miss.
For example, caching is not as easy as other CI systems. I could not find any docs regarding how to
reuse build cache for Gradle. I asked the question in GCP Slack but did not get an official
response. In addition, it does not provide those nice GitHub badges. (Even worse, those build info
are not even public, you need to use the REST APIs with OAuth2.) Although I found it's possible to
automatically generate the badges, it will take some time and I want to start early.

[Travis CI](https://travis-ci.org/) is another popular choice. It basically gives you unlimited
service for open source projects. This is ideal for me because all of the projects I want to setup
CI are open-sourced. However, I want the CD aspect for my website repositories. My website runs on
Google Kubernetes Engine so it works best with GCP Cloud Build. (No more complicated secret config,
just some clicks on Service Account.)

With these problems with existing systems and constraints of my own, I decided to split. I chose to
setup Travis CI for my open source libraries. For my website repositories, I chose GCP Cloud Build.

### Travis CI Setup

Many of my open source libraries were written in Kotlin and built with Gradle, so the setup is very
straightforward: Travis CI's
[tutorial](https://docs.travis-ci.com/user/languages/java/#projects-using-gradle) already covers how
to use it with Gradle for JVM projects.

There were still some exceptions. One of my libraries is TypedStore, a client library for GCP
Datastore. The tests require a running Datastore simulator to test against, so I need to run some
scripts before testing to automatically install, configure, and run the simulator. Although it takes
me about ten failed builds to figure out how to do it correctly, it is still relatively easy to use
and the docs are clear.

A lot of failed builds:

![Failed CI Setup](/img/2018-08-11-migration-ci-cd/failed-ci-setup.png)

### GCP Cloud Build Setup

Before setting up Cloud Build (and before Google announced it), I have already been using the
now-deprecated Container Builder. Since I was unfamiliar with Docker and got very confused about the
multi-stage build, I used a little shell script to achieve the same thing and only let the
Dockerfile copy the compiled jar and run it.

Here is the original awkward script:

```bash
#!/usr/bin/env bash

set -x

# Staging

./gradlew build
mkdir -p build/staging
cp build/libs/website-5.0-all.jar build/staging
cp src/main/docker/\* build/staging

# Cloud Build

container_name='gcr.io/dev-sam/backend-container'
container_tag=`date +%s`
full_container_tag="${container_name}:${container_tag}"
echo "The container tag will be: ${full_container_tag}"
cd build/staging; \
gcloud config set project dev-sam; \
gcloud config set compute/zone us-central1-a; \
gcloud container clusters get-credentials web-cluster; \
gcloud container builds submit -t ${full_container_tag} .

# Rolling Update

kubectl set image deployment backend-workload \*=\${full_container_tag}
```

But when more and more badges showed up in my projects' README, I decided to give Docker a try. I
searched on Google and found a nice tutorial. With about ten failed builds, the Docker build
pipeline and its companion Cloud Build config had been properly setup. (It's a little painful
because Angular SSR build is sooooooo slow.)

With a running and testable cloud build example, I thought it's the time to create the automatic
badge generation service. According to Google's Docs, the build event will be sent to GCP Pub/Sub,
so I realized that it can be best consumed by a function, with all the benefits of serverless
computation.

I tried Google Cloud Function first, but I'm very bad at configuring TypeScript and messed up
everything. Firebase Functions support TypeScript very well through its command line tools, so I
switched to Firebase Function immediately. It turned out to be a good choice, because I also need
some storage service to store the generated badge. (I've thought about using database, but simply
replacing the old file is so much easier than managing DB and generating SVG files on the fly.)
Since Firebase Storage can store a remote file by URL, I directly used the existing Shields service
to generate the badge for me. Therefore, badge generation is simply URL composition and it's
beautifully done in a single line of code:

![Single Line](/img/2018-08-11-migration-ci-cd/single-line.png)

The service is now mature and already generating badges for my website repositories. You can check
it [here](https://github.com/SamChou19815/badges-4-gcp-cloud-build), which also
includes an explanation of workflow.

With much more experience with CI, setup for my backend repository only took a single try.

![One time success](/img/2018-08-11-migration-ci-cd/one-time-success.png)

### Future Work

Although CIs have been set up, my open source projects are missing a lot of tests. (That's why I
don't put a test coverage badge. Shhhh!) I'm planning to add more tests, especially my programming
language SAMPL, which I believe have a lot of bugs related to variable shadowing.

Stay tuned for more information!
