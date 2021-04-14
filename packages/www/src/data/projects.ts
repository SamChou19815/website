type ProjectDataEntry = {
  readonly name: string;
  readonly type: string;
  readonly media: string;
  readonly description: string;
  readonly links: readonly { readonly text: string; readonly href: string }[];
};

const DATASET_PROJECTS: readonly ProjectDataEntry[] = [
  {
    name: 'samlang',
    type: 'Programming Language',
    media: '/projects/samlang.webp',
    description: 'A statically-typed functional programming language with full type inference.',
    links: [
      { text: 'Docs', href: 'https://samlang.io' },
      { text: 'Demo', href: 'https://samlang.io/demo' },
      { text: 'GitHub', href: 'https://github.com/SamChou19815/samlang' },
    ],
  },
  {
    name: 'Docusaurus',
    type: 'Open source contributions',
    media: '/projects/docusaurus.webp',
    description:
      "A static docs site generator created by FB open source. I'm one of the top 10 contributors.",
    links: [
      { text: 'Docs', href: 'https://v2.docusaurus.io' },
      { text: 'GitHub', href: 'https://github.com/facebook/docusaurus' },
    ],
  },
  {
    name: 'mini-react',
    type: 'Framework',
    media: '/projects/mini-react.webp',
    description:
      'A simplified version of React runtime with useState and useEffect hook, built from Scratch.',
    links: [
      { text: 'Demo', href: 'https://mini-react.developersam.com' },
      { text: 'GitHub', href: 'https://github.com/SamChou19815/mini-react' },
      { text: 'Slides', href: '/build-simplified-react.pdf' },
    ],
  },
  {
    name: 'Samwise',
    type: 'Web App',
    media: '/projects/samwise.webp',
    description:
      'A Student Planner for Everyone. Designed, developed and maintained by Cornell DTI.',
    links: [
      { text: 'App', href: 'https://samwise.today' },
      { text: 'GitHub', href: 'https://github.com/cornell-dti/samwise' },
    ],
  },
  {
    name: 'Wiki',
    type: 'Web App',
    media: '/projects/wiki.webp',
    description: 'Documentation for this monoropo and notes from Developer Sam.',
    links: [
      { text: 'Website', href: 'https://wiki.developersam.com' },
      {
        text: 'GitHub',
        href: 'https://github.com/SamChou19815/website/tree/master/packages/wiki',
      },
    ],
  },
  {
    name: 'TEN',
    type: 'Game AI',
    media: '/projects/ten.webp',
    description: 'Interesting board game with simple rules. Powered by an MCTS AI.',
    links: [
      { text: 'Demo', href: 'https://ten.developersam.com' },
      { text: 'GitHub', href: 'https://github.com/SamChou19815/ten-golang' },
    ],
  },
];

export default DATASET_PROJECTS;
