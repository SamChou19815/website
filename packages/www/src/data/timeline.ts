const ChunkReader = '/timeline/chunk-reader.webp';
const CritterCompiler = '/timeline/critter-compiler.webp';
const CritterWorld = '/timeline/critter-world.webp';
const FacebookHackerWay = '/timeline/fb-hacker-way.webp';
const FacebookStickerAndPen = '/timeline/fb-sticker-pen.webp';
const GraduationSam = '/graduation-sam.webp';
const MiniReact = '/projects/mini-react.webp';
const SAMFirst = '/timeline/sam-first.webp';
const SAMLater = '/timeline/sam-later.webp';
const SAMPL = '/timeline/sampl.webp';
const SAMLANG = '/projects/samlang.webp';
const Samwise = '/projects/samwise.webp';
const TEN = '/projects/ten.webp';
const WebsiteV2 = '/timeline/website-v2.webp';
const WebsiteV3 = '/timeline/website-v3.webp';
const Wiki = '/projects/wiki.webp';

type NamedLink = { readonly name: string; readonly url: string };

export type TimelineItem = {
  readonly title: string;
  readonly time: string;
  readonly image?: string;
  readonly detail?: string;
  readonly links?: readonly NamedLink[];
};

const DATASET_TIMELINE: readonly TimelineItem[] = [
  {
    title: 'Graduated from Cornell University',
    time: 'May 2021',
    image: GraduationSam,
    detail: 'Graduated as an undergrad, still have an M.Eng to do...',
  },
  {
    title: 'samlang emits LLVM code',
    time: 'January 2021',
    links: [
      { name: 'Blog Post', url: 'https://blog.developersam.com/2021/01/24/samlang-llvm-backend' },
    ],
  },
  {
    title: '💕',
    time: 'October 2020',
    links: [
      { name: 'Megan Yin', url: 'https://meganyin.com' },
      { name: 'dev-megan', url: 'https://github.com/meganyin13' },
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
    title: 'Wiki',
    time: 'July 2020',
    image: Wiki,
    detail: 'Documentation for this monoropo and notes from Developer Sam.',
    links: [{ name: 'Project', url: 'https://wiki.developersam.com/' }],
  },
  {
    title: 'Facebook SWE Intern',
    time: 'June 2020',
    image: FacebookHackerWay,
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
    image: FacebookHackerWay,
  },
  {
    title: 'Xi++ Compiler',
    time: 'May 2019',
    detail:
      'An optimizing compiler that compiles object-oriented Xi code to x86-64 assembly and Cornell CS 2112 critter language.',
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
    links: [
      {
        name: 'Cornell DTI Website',
        url: 'https://www.cornelldti.org',
      },
    ],
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
    title: 'Facebook SWE Intern Final Interview',
    time: 'October 2018',
    image: FacebookStickerAndPen,
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
    title: 'Badges for GCP Cloud Build',
    time: 'August 2018',
    detail: 'Automatically generating badges for build status on GCP Cloud Build.',
    links: [
      { name: 'GitHub Repo', url: 'https://github.com/SamChou19815/badges-4-gcp-cloud-build' },
    ],
  },
  {
    title: 'Website Redesign v2',
    time: 'July 2018',
    image: WebsiteV2,
    links: [
      { name: 'GitHub Repo', url: 'https://github.com/SamChou19815/dev-sam-frontend' },
      {
        name: 'Archive',
        url: 'https://web.archive.org/web/20190102202556/https://developersam.com/',
      },
    ],
  },
  {
    title: 'typed-store',
    time: 'July 2018',
    detail: 'A type-safe wrapper for Google Cloud Datastore.',
    links: [{ name: 'GitHub Repo', url: 'https://github.com/SamChou19815/typed-store' }],
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
  { title: 'ULearn Educational Group SWE Intern', time: 'May 2018' },
  {
    title: 'CS 2112 Critter World',
    image: CritterWorld,
    time: 'December 2017',
    detail:
      "Sam's critter world implementation. Used as course staff reference solution in Fall 2018 and Fall 2019.",
  },
  {
    title: 'First winning hackathon',
    time: 'September 2017',
    image: ChunkReader,
    detail: 'Developed a text analysis app during Cornell BigRedHack. Best use of Google Cloud.',
    links: [
      { name: 'GitHub Repo', url: 'https://github.com/SamChou19815/chunk-reader' },
      { name: 'DevPost Link', url: 'https://devpost.com/software/chunk-reader' },
    ],
  },
  { title: 'Entered Cornell University', time: 'August 2017' },
  {
    title: 'TEN',
    time: 'July 2017',
    image: TEN,
    links: [{ name: 'GitHub Repo', url: 'https://github.com/SamChou19815/ten' }],
  },
  {
    title: 'Graduated from WFLA',
    time: 'June 2016',
    links: [
      {
        name: 'Blog: CS in High Schools',
        url: 'https://blog.developersam.com/2018/12/31/cs-in-high-schools/',
      },
    ],
  },
  { title: 'Computerization Club President', time: 'September 2015', image: SAMLater },
  {
    title: 'SAM First Release',
    time: 'April 2015',
    image: SAMFirst,
    links: [{ name: 'GitHub Repo', url: 'https://github.com/SamChou19815/SAM' }],
  },
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
  { title: 'Entered WFLA', time: 'August 2014' },
  { title: 'Graduated from Huayu Middle School', time: 'June 2014' },
  { title: 'First Non-trivial VB Program Written', time: 'December 2011' },
  {
    title: 'Started Coding',
    time: 'July 2011',
    detail: 'I bought a bad C++ intro book and almost gave up.',
  },
  { title: 'Entered Huayu Middle School', time: 'September 2010' },
  { title: 'Born', time: 'November 1998' },
];

export default DATASET_TIMELINE;
