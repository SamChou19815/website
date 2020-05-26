type ProjectLink = { readonly text: string; readonly href: string };

type Project = {
  readonly name: string;
  readonly type: string;
  readonly media: string;
  readonly description: string;
  readonly links: readonly ProjectLink[];
};

const projects: readonly Project[] = [
  {
    name: 'SAMLANG',
    type: 'Programming Language',
    media: '/projects/samlang.png',
    description:
      'A statically-typed functional programming language with full type inference. A research programming language developed by Sam.',
    links: [
      { text: 'Docs', href: 'https://samlang.developersam.com' },
      { text: 'Demo', href: 'https://samlang.developersam.com/demo' },
      { text: 'GitHub', href: 'https://github.com/SamChou19815/samlang' },
    ],
  },
  {
    name: 'Docusaurus',
    type: 'Open source contributions',
    media: '/projects/docusaurus.png',
    description:
      'A static documentation site generator developed by Facebook open source. I am one of the top 20 contributors.',
    links: [
      { text: 'Docs', href: 'https://v2.docusaurus.io' },
      { text: 'GitHub', href: 'https://github.com/facebook/docusaurus' },
    ],
  },
  {
    name: 'mini-react',
    type: 'Framework',
    media: '/projects/mini-react.png',
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
    media: '/projects/samwise.png',
    description:
      'A Student Planner for Everyone. Designed, developed and maintained by Cornell DTI.',
    links: [
      { text: 'App', href: 'https://samwise.today' },
      { text: 'GitHub', href: 'https://github.com/cornell-dti/samwise' },
    ],
  },
  {
    name: 'Tasks',
    type: 'Web App',
    media: '/projects/tasks.png',
    description: 'A planner with drag and drop and dependency analysis.',
    links: [
      { text: 'App', href: 'https://tasks.developersam.com' },
      {
        text: 'GitHub',
        href: 'https://github.com/SamChou19815/website/tree/master/packages/tasks',
      },
    ],
  },
  {
    name: 'TEN',
    type: 'Game AI',
    media: '/projects/ten.png',
    description: 'Interesting board game with simple rules. Powered by an MCTS AI.',
    links: [
      { text: 'Demo', href: 'https://ten.developersam.com' },
      { text: 'GitHub', href: 'https://github.com/SamChou19815/ten-golang' },
    ],
  },
];

export default projects;
