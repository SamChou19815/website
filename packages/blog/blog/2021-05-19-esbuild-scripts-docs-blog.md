# Building a Static Documentation/Blog Generator with esbuild-scripts

In the [last blog post](../../../2021/04/15/esbuild-scripts), I talked about how I rebuild my
website infrastructure to speed up the build time by 20x. However, it is only able to support a
subset of my React websites. I also have some websites that are powered by
[Docusaurus](https://docusaurus.io/) that are unable to migrate to `esbuild-scripts` due to the lack
of customized routing support. In this post, I am going to go over the process of developing
abstractions for this feature.

<!--truncate-->

## Feature Overview

Before we dive into the implementation details, we first need to clearly define what we need to do.
I decided to closely follow the existing Docusaurus behavior, so that all the permalinks are
preserved after migration, so I don't need to set up some redirects to preserve good SEO.

For a documentation site, we should have the ability to write docs in markdown in the `docs` folder.
Each file in the docs folder `foo-bar.md` will be mapped to a permalink `/docs/foo-bar` with
pre-rendered HTML content from markdown. In addition, there is a sidebar and docs paginator to move
around between documents, and each document page should have a table of contents.

![Docs Page Example](/img/2021-05-19-esbuild-scripts-docs-blog/docs-example.png)

Figure 1: Docs Page Example

For a blog site, we should still have the ability to write blog posts in markdown inside the `blog`
folder. Each file in the blog folder `year-month-date-dev-sam-haha.md` should be mapped to a
permalink `/year/month/date/dev-sam-haha`. Similar to a docs site, we need paginators and a table of
contents in every blog post. There should also be an index page that lists all the blog posts with
truncated content.

![Blog Homepage Example](/img/2021-05-19-esbuild-scripts-docs-blog/blog-index-example.png)

Figure 2: Blog Homepage Example

![Blog Post Page Example](/img/2021-05-19-esbuild-scripts-docs-blog/blog-post-example.png)

Figure 3: Blog Page Example

## Naive Approach

Currently, `esbuild-scripts` supports filesystem based routing like Next.js. If you have a source
file `src/pages/foo/bar/index.tsx`, it will be mapped to the permalink `/foo/bar`. Thus, to support
the permalink structure in the above section, we will need to _generate_ a React component in the
right place of `src/pages`, and then the rest of the `esbuild-scripts` infrastructure will take over
and do its job.

Generating React code from markdown is also not a hard problem. There is already a library called
[mdx](https://www.npmjs.com/package/@mdx-js/react) that does exactly that. Therefore, it seems like
all we need to do is:

1. Calling `@mdx-js/react` to generate React components for markdown documents.
1. Generating table of contents from markdown source.
1. Generating some internal sitemap for pagination.
1. Put the generated code in the right place and profit!

There is one slight problem with this approach: it will generate a lot of code inside `src/pages`
that needs to be git ignored one by one if you don't want generated code to be checked in your repo.
Therefore, I added another resolver in `esbuild-scripts` that considers React components in both
`src/pages` and `src/generated-pages` to be a route. In addition, the generated code cannot be
incrementally updated once the file content changes.

In summary, although the naive code generation approach mostly works, it looks like a patch rather
than a scalable solution with clean interfaces. More work needs to be done to support this kind of
workflow with better abstractions.

## Virtual Pages

In the previous section, we are limiting ourselves to physical pages: i.e. the pages where there is
a corresponding React component in the real filesystem. However, it is important to note that this
restriction is completely unnecessary. If filesystem can be virtualized, why can't we virtualize the
pages and routes on a website as well?

Therefore, `esbuild-scripts` could provide an API to the consumers that let them pass in a map of
virtual pages:

```typescript
import esbuildScriptsRunner from 'esbuild-scripts/api';

const VirtualIndexPageContent = `
import React from 'react';
export default () => <div>HomePage</div>;
`;
const VirtualFooBarPageContent = `
import React from 'react';
export default () => <div>I'm on foo/bar</div>;
`;

esbuildScriptsRunner(async () => ({
  index: VirtualIndexPageContent,
  'foo/bar': VirtualFooBarPageContent,
}));
```

Virtual pages are great, but how do we implement them? Concretely speaking, we need to answer the
following questions:

- What happens when a virtual page is imported?
- How are virtual pages resolved?
- How are virtual pages transpiled?
- etc

Fortunately, through the [plugin API](https://esbuild.github.io/plugins/) of esbuild, we can
implement resolvers and loaders for all kinds of non-JS and non-CSS files. Instead of baking the
idea of virtual pages into a plugin, we can make the plugin exposes a slightly lower level concept:
virtual JS modules. Then we can have a much clearer separation of responsibilities:

![Separation of responsibilities](/img/2021-05-19-esbuild-scripts-docs-blog/responsibilities.png)

Figure 4: Separation of responsibilities

Using this architecture, the module graph of the generated docs site would look like:

![Example Module Graph](/img/2021-05-19-esbuild-scripts-docs-blog/graph.png)

Figure 5: Example Module Graph

Note that with this new architecture, we no longer need to write generated entry point components
into the real filesystem. It can use the same virtual JS module system to keep everything in memory
to avoid unnecessary IO.

## Performance

The point to migrate the build system to an esbuild-based one is for performance. Therefore, we
should look at the performance metric after the migration.

![10x performance improvements](/img/2021-05-19-esbuild-scripts-docs-blog/performance.png)

Figure 6: 10x performance improvements

In a single run in the command line, even the heaviest blog build is able to complete within 2
seconds, which is a huge improvement from Docusaurus build that takes at least 20 seconds. Thus, I
can proudly claim that we achieved a 10x speedup.

If you remember from the [last blog post](../../../2021/04/15/esbuild-scripts), I achieved a 20x
speedup, so you might wonder why only 10x this time. It turns out that compiling markdown to React
documents is a much heavier computation. We are relying on the `@mdx-js/react` package, which is
written in JS so it is a huge bottleneck. In the future, I might be able to optimize away this
inefficiency by creating my own markdown compiler in Rust.

## Where is the code?

Development on `esbuild-scripts` is currently done
[here](https://github.com/SamChou19815/website/tree/main/packages/esbuild-scripts). This is a
released [npm pacakge](https://www.npmjs.com/package/esbuild-scripts) and you can use it by
`yarn add esbuild-scripts`.

The blog and docs generator is in its own currently unpublished package
[here](https://github.com/SamChou19815/website/tree/main/packages/lib-react-docs). It has a very
opinionated setup and UI based on Docusaurus classic theme UI. If you want to make it more
customizable to be useful for you without sacrificing performance, then any contribution is
welcomed!
