import mainRunner, { utils } from 'esbuild-scripts/api';

import generateBlogPagesVirtualEntryComponents from './blog-generator';
import generateDocumentationVirtualEntryComponents, {
  DocsSiteConfiguration,
} from './docs-generator';

type Configuration =
  | ({ readonly type: 'docs' } & DocsSiteConfiguration)
  | { readonly type: 'blog'; readonly siteTitle: string };

mainRunner(async () => {
  const configuration: Configuration = JSON.parse(await utils.readFile('package.json')).reactDocs;
  switch (configuration.type) {
    case 'docs':
      return await generateDocumentationVirtualEntryComponents(configuration);
    case 'blog':
      return await generateBlogPagesVirtualEntryComponents(configuration.siteTitle);
    default:
      // eslint-disable-next-line no-console
      console.error(`Unknown type: "${configuration['type']}"`);
      process.exit(1);
  }
});
