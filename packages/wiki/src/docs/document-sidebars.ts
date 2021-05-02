import type { SidebarItem } from 'lib-react-docs/DocSidebar';

const documentSideBars: readonly SidebarItem[] = [
  {
    type: 'category',
    label: 'Documentation',
    items: [{ type: 'link', label: 'Introduction', href: '/docs/intro' }],
  },
  {
    type: 'category',
    label: 'Roadmap',
    items: [
      { type: 'link', label: 'Open Source Roadmap 2020 H2', href: '/docs/oss-roadmap-2020-h2' },
      { type: 'link', label: 'Open Source Roadmap 2021', href: '/docs/oss-roadmap-2021' },
    ],
  },
  {
    type: 'category',
    label: 'Resources',
    items: [{ type: 'link', label: 'CS Resources', href: '/docs/resources-cs' }],
  },
];

export default documentSideBars;
