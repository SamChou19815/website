---
id: oss-roadmap-2021
title: Open Source Roadmap 2021
---

## samlang

### Pretty Print with Comments

samlang AST should keep track of comments and pretty print them, so that the pretty printing step
does not cause the user to lose any information.

At the base line level, all the documents comment for samlang classes and functions should be kept
and be shown in the hover LSP command.

### Supporing More LSP Features

samlang LSP should support some refactoring capabilities, including renaming variables and
functions. Autocompletion should be extended to support more cases, like variable completion.

### Optimization

Some basic form of interprocedural analysis should be explored and implemented to help other
optimizations to become more powerful.

## website

### Wide-screen Support

[developersam.com](https://developersam.com) should still look good on big monitors.

### Web Terminal

The web terminal should have an account system, so that the user can read and write files on their
own.

## Random

- Keep `mini-react` up-to-date with current React (fiber reconciler).
- Improve critter compiler to make it more useful.
