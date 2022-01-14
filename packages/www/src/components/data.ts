import type { WwwSvgIconName } from './Icons';

type AboutSectionFact = { readonly iconName: WwwSvgIconName; readonly text: string };
type AboutSectionLink = { readonly href: string; readonly text: string };

type AboutDataEntry = {
  readonly facts: readonly AboutSectionFact[];
  readonly links: readonly AboutSectionLink[];
};

type ProjectDataEntry = {
  readonly name: string;
  readonly type: string;
  readonly media: string;
  readonly description: string;
  readonly links: readonly { readonly text: string; readonly href: string }[];
};

type TechTalkDataEntry = {
  readonly title: string;
  readonly description: string;
  readonly link: string;
};

type NamedLink = { readonly name: string; readonly url: string };
type TimelineItem = {
  readonly title: string;
  readonly time: string;
  readonly image?: string;
  readonly detail?: string;
  readonly links?: readonly NamedLink[];
};

export const DATASET_ABOUT: AboutDataEntry = {
  facts: [
    { iconName: 'work', text: 'Facebook SWE' },
    { iconName: 'github', text: 'OSS Contributor' },
    { iconName: 'school', text: 'Cornell University' },
    { iconName: 'code', text: 'Coding since 13' },
  ],
  links: [
    { href: 'https://blog.developersam.com', text: 'Blog' },
    { href: 'https://github.com/SamChou19815', text: 'GitHub' },
    { href: '/resume.pdf', text: 'Resume' },
    { href: '/terminal', text: '>_' },
  ],
};

export const DATASET_PROJECTS: readonly ProjectDataEntry[] = [
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

export const DATASET_TECH_TALKS: readonly TechTalkDataEntry[] = [
  {
    title: 'Extraction Refactor Code Actions',
    description: 'Challenges in building a correct refactor action with nice user experiences.',
    link: '/flow-ide-presentation.pdf',
  },
  {
    title: 'CoursePlan Requirement Computation',
    description:
      'An overview of the challanges and solutions of college requirement fulfillment computation.',
    link: '/courseplan-requirement.pdf',
  },
  {
    title: 'Build a (simplified) React',
    description:
      'A tutorial of making a simplified React runtime with support for useState and useEffect hooks.',
    link: '/build-simplified-react.pdf',
  },
  {
    title: 'Build your programming language',
    description: 'A tutorial of making a simple programming language derived from lambda-calculus.',
    link: '/build-your-own-programming-language.pdf',
  },
];

const CritterCompiler = '/timeline/critter-compiler.webp';
const CritterWorld = '/timeline/critter-world.webp';
const FacebookStickerAndPen = '/timeline/fb-sticker-pen.webp';
const Flow = '/timeline/flow.webp';
const GraduationSam = '/fan-arts/graduation-sam.webp';
const MiniReact = '/projects/mini-react.webp';
const Pyre = '/timeline/pyre-check.webp';
const SAMLater = '/timeline/sam-later.webp';
const SAMPL = '/timeline/sampl.webp';
const SAMLANG = '/projects/samlang.webp';
const Samwise = '/projects/samwise.webp';
const TEN = '/projects/ten.webp';
const WebsiteV2 = '/timeline/website-v2.webp';
const WebsiteV3 = '/timeline/website-v3.webp';

export const DATASET_TIMELINE: readonly TimelineItem[] = [
  {
    title: 'Graduated from Cornell University, Again',
    time: 'December 2021',
    image: GraduationSam,
    detail: 'Graduated as an M.Eng student. 👋',
  },
  {
    title: 'Facebook SWE Intern',
    time: 'June 2021',
    image: Flow,
    detail: 'Working on the Flow team.',
    links: [
      { name: 'Website', url: 'https://flow.org' },
      { name: 'GitHub', url: 'https://github.com/facebook/flow' },
    ],
  },
  {
    title: 'Graduated from Cornell University',
    time: 'May 2021',
    image: GraduationSam,
    detail: 'Graduated as an undergrad.',
  },
  {
    title: 'samlang emits LLVM code',
    time: 'January 2021',
    links: [
      { name: 'Blog Post', url: 'https://blog.developersam.com/2021/01/24/samlang-llvm-backend' },
    ],
  },
  {
    title: 'Turn samzhou.dev into a fan-art site',
    time: 'September 2020',
    links: [{ name: 'samzhou.dev', url: 'https://samzhou.dev' }],
  },
  {
    title: 'samlang rewritten in TypeScript',
    time: 'August 2020',
    links: [
      { name: 'Blog Post', url: 'https://blog.developersam.com/2020/08/30/samlang-ts-rewrite' },
    ],
  },
  {
    title: 'Facebook SWE Intern',
    time: 'June 2020',
    image: FacebookStickerAndPen,
    detail: 'Working on the Feed Expressions team.',
  },
  {
    title: 'mini-react',
    time: 'May 2020',
    image: MiniReact,
    detail: "Sam's implementation of a simplified React.",
    links: [
      { name: 'GitHub Repo', url: 'https://github.com/SamChou19815/mini-react' },
      { name: 'Demo', url: 'https://mini-react.developersam.com/' },
    ],
  },
  {
    title: 'Cornell DTI Developer Lead',
    time: 'June 2019',
    links: [{ name: 'Cornell DTI Website', url: 'https://www.cornelldti.org' }],
  },
  {
    title: 'Facebook SWE Intern',
    time: 'May 2019',
    image: Pyre,
    detail: 'Working on the Pyre team.',
    links: [
      { name: 'Website', url: 'https://pyre-check.org' },
      { name: 'GitHub', url: 'https://github.com/facebook/pyre-check' },
    ],
  },
  {
    title: 'Website Redesign v3.0',
    time: 'March 2019',
    image: WebsiteV3,
    detail: 'This is the first version that includes a samlang program about myself.',
    links: [
      {
        name: 'Archive',
        url: 'https://web.archive.org/web/20200331050322/https://developersam.com/',
      },
    ],
  },
  {
    title: 'Cornell DTI TPM',
    time: 'January 2019',
    detail: 'Technical product manager of the Samwise subteam.',
    links: [{ name: 'Cornell DTI Website', url: 'https://www.cornelldti.org' }],
  },
  {
    title: 'samlang',
    time: 'January 2019',
    image: SAMLANG,
    detail: "Sam's new programming language with full type-inference.",
    links: [
      { name: 'GitHub Repo', url: 'https://github.com/SamChou19815/samlang' },
      { name: 'Docs', url: 'https://samlang.io/' },
    ],
  },
  {
    title: 'Cornell DTI Software Developer',
    time: 'September 2018',
    image: Samwise,
    detail: 'Frontend Developer of Samwise',
    links: [{ name: 'GitHub Repo', url: 'https://github.com/cornell-dti/samwise' }],
  },
  {
    title: 'Critter Compiler',
    time: 'August 2018',
    image: CritterCompiler,
    links: [
      { name: 'GitHub Repo', url: 'https://github.com/SamChou19815/primitivize' },
      { name: 'Blog Post', url: 'https://blog.developersam.com/2018/08/27/cw-turing-complete/' },
    ],
  },
  {
    title: 'Website Redesign v2',
    time: 'July 2018',
    image: WebsiteV2,
    links: [
      {
        name: 'Archive',
        url: 'https://web.archive.org/web/20190102202556/https://developersam.com/',
      },
    ],
  },
  {
    title: 'SAMPL',
    time: 'June 2018',
    image: SAMPL,
    detail: "Sam's first programming language. Archived in favor of samlang.",
    links: [
      { name: 'GitHub Repo', url: 'https://github.com/SamChou19815/sampl' },
      {
        name: 'Blog Post',
        url: 'https://blog.developersam.com/2018/06/15/sampl-alpha-design-choices/',
      },
    ],
  },
  {
    title: 'CS 2112 Critter World',
    image: CritterWorld,
    time: 'December 2017',
    detail:
      "Sam's critter world implementation. Used as course staff reference solution in Fall 2018 and Fall 2019.",
  },
  { title: 'Entered Cornell University', time: 'August 2017' },
  {
    title: 'TEN',
    time: 'July 2017',
    image: TEN,
    links: [{ name: 'GitHub Repo', url: 'https://github.com/SamChou19815/ten-golang' }],
  },
  {
    title: 'Graduated from High School',
    time: 'June 2016',
    links: [
      {
        name: 'Blog: CS in High Schools',
        url: 'https://blog.developersam.com/2018/12/31/cs-in-high-schools/',
      },
    ],
  },
  { title: 'Computerization Club President', time: 'September 2015', image: SAMLater },
  { title: 'Computerization Software Developer', time: 'Feburary 2015' },
  {
    title: 'Bought developersam.com',
    time: 'Feburary 2015',
    detail: 'Check how it looks initially!',
    links: [
      {
        name: 'Initial Version',
        url: 'https://web.archive.org/web/20160506203739/http://www.developersam.com/',
      },
    ],
  },
];
