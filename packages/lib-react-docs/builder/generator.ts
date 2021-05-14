import generateBlogPages from './blog-generator';
import generateDocumentation, { DocsSiteConfiguration } from './docs-generator';

import mainRunner, { utils } from 'esbuild-scripts/api';

type Configuration =
  | ({ readonly type: 'docs' } & DocsSiteConfiguration)
  | { readonly type: 'blog'; readonly siteTitle: string };

mainRunner(async () => {
  const configuration: Configuration = JSON.parse(await utils.readFile('package.json')).reactDocs;
  switch (configuration.type) {
    case 'docs':
      return await generateDocumentation(configuration);
    case 'blog':
      return await generateBlogPages(configuration.siteTitle);
    default:
      // eslint-disable-next-line no-console
      console.error(`Unknown type: "${configuration['type']}"`);
      process.exit(1);
  }
});
