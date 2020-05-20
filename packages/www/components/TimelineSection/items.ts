const SAMLANG = '/projects/samlang.png';
const Samwise = '/projects/samwise.png';
const TEN = '/projects/ten.png';
const ChunkReader = '/timeline/chunk-reader.jpg';
const CritterCompiler = '/timeline/critter-compiler.png';
const CritterWorld = '/timeline/critter-world.png';
const FacebookHackerWay = '/timeline/fb-hacker-way.jpg';
const FacebookStickerAndPen = '/timeline/fb-sticker-pen.jpg';
const SAMFirst = '/timeline/sam-first.png';
const SAMLater = '/timeline/sam-later.png';
const SAMPL = '/timeline/sampl.png';

type NamedLink = { readonly name: string; readonly url: string };

export type TimelineItem = {
  readonly title: string;
  readonly type: 'work' | 'project' | 'event';
  readonly time: string;
  readonly image?: string;
  readonly detail?: string;
  readonly links?: readonly NamedLink[];
};

const items: TimelineItem[] = [
  {
    title: 'Cornell DTI Developer Lead',
    type: 'work',
    time: '2019-06',
    links: [
      {
        name: 'Cornell DTI Website',
        url: 'https://www.cornelldti.org',
      },
    ],
  },
  {
    title: 'Facebook SWE Intern',
    type: 'work',
    time: '2019-05',
    image: FacebookHackerWay,
  },
  {
    title: 'Xi++ Compiler',
    type: 'project',
    time: '2019-05',
    detail:
      'An optimizing compiler that compiles object-oriented Xi code to x86-64 assembly and Cornell CS 2112 critter language.',
  },
  {
    title: 'Website Redesign v3',
    type: 'event',
    time: '2019-03',
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/website',
      },
    ],
  },
  {
    title: 'Cornell DTI TPM',
    type: 'work',
    time: '2019-01',
    detail: 'Technical product manager of the Samwise subteam.',
    links: [
      {
        name: 'Cornell DTI Website',
        url: 'https://www.cornelldti.org',
      },
    ],
  },
  {
    title: 'SAMLANG',
    type: 'project',
    time: '2019-01',
    image: SAMLANG,
    detail: "Sam's new programming language with full type-inference.",
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/samlang',
      },
      {
        name: 'Docs',
        url: 'https://samlang.developersam.com/',
      },
    ],
  },
  {
    title: 'Facebook SWE Intern Final Interview',
    type: 'event',
    time: '2018-10',
    image: FacebookStickerAndPen,
  },
  {
    title: 'Cornell DTI Software Developer',
    type: 'work',
    time: '2018-09',
    image: Samwise,
    detail: 'Frontend Developer of Samwise',
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/cornell-dti/samwise',
      },
    ],
  },
  {
    title: 'Critter Compiler',
    type: 'project',
    time: '2018-08',
    image: CritterCompiler,
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/primitivize',
      },
      {
        name: 'Blog Post',
        url: 'https://blog.developersam.com/math/2018/08/27/cw-turing-complete/',
      },
    ],
  },
  {
    title: 'Website Redesign v2',
    type: 'event',
    time: '2018-07',
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/dev-sam-frontend',
      },
      {
        name: 'Archive',
        url: 'https://web.archive.org/web/20190102202556/https://developersam.com/',
      },
    ],
  },
  {
    title: 'Badges for GCP Cloud Build',
    type: 'project',
    time: '2018-08',
    detail: 'Automatically generating badges for build status on GCP Cloud Build.',
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/badges-4-gcp-cloud-build',
      },
    ],
  },
  {
    title: 'typed-store',
    type: 'project',
    time: '2018-07',
    detail: 'A type-safe wrapper for Google Cloud Datastore.',
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/typed-store',
      },
    ],
  },
  {
    title: 'SAMPL',
    type: 'project',
    time: '2018-06',
    image: SAMPL,
    detail: "Sam's first programming language. Archived in favor of SAMLANG.",
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/sampl',
      },
      {
        name: 'Blog Post',
        url: 'https://blog.developersam.com/design-choices/2018/06/15/sampl-alpha-design-choices/',
      },
    ],
  },
  {
    title: 'ULearn Educational Group SWE Intern',
    type: 'work',
    time: '2018-05',
  },
  {
    title: 'CS 2112 Critter World',
    type: 'project',
    image: CritterWorld,
    time: '2017-12',
    detail:
      "Sam's critter world implementation. Used as course staff reference solution in Fall 2018 and Fall 2019.",
  },
  {
    title: 'First winning hackathon',
    type: 'event',
    time: '2017-09',
    image: ChunkReader,
    detail: 'Developed a text analysis app during Cornell BigRedHack. Best use of Google Cloud.',
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/chunk-reader',
      },
      {
        name: 'DevPost Link',
        url: 'https://devpost.com/software/chunk-reader',
      },
    ],
  },
  {
    title: 'Entered Cornell University',
    type: 'event',
    time: '2017-08',
  },
  {
    title: 'TEN',
    type: 'project',
    time: '2017-07',
    image: TEN,
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/ten',
      },
    ],
  },
  {
    title: 'Graduated from WFLA',
    type: 'event',
    time: '2017-06',
    links: [
      {
        name: 'Blog: CS in High Schools',
        url: 'https://blog.developersam.com/tech-journey/2018/12/31/cs-in-high-schools/',
      },
    ],
  },
  {
    title: 'Computerization Club President',
    type: 'work',
    time: '2015-09',
    image: SAMLater,
  },
  {
    title: 'SAM First Release',
    type: 'project',
    time: '2015-04',
    image: SAMFirst,
    links: [
      {
        name: 'GitHub Repo',
        url: 'https://github.com/SamChou19815/SAM',
      },
    ],
  },
  {
    title: 'Computerization Software Developer',
    type: 'work',
    time: '2015-02',
  },
  {
    title: 'Bought developersam.com',
    type: 'event',
    time: '2015-02',
    detail: 'Check how it looks initially!',
    links: [
      {
        name: 'Initial Version',
        url: 'https://web.archive.org/web/20160506203739/http://www.developersam.com/',
      },
    ],
  },
  {
    title: 'Entered WFLA',
    type: 'event',
    time: '2014-08',
  },
  {
    title: 'Graduated from Huayu Middle School',
    type: 'event',
    time: '2014-06',
  },
  {
    title: 'First Non-trivial VB Program Written',
    type: 'project',
    time: '2011-12',
  },
  {
    title: 'Started Coding',
    type: 'event',
    time: '2011-07',
    detail: 'I bought a bad C++ intro book and almost gave up.',
  },
  {
    title: 'Entered Huayu Middle School',
    type: 'event',
    time: '2010-09',
  },
  {
    title: 'Born',
    type: 'event',
    time: '1998-11',
  },
];

export default items;
