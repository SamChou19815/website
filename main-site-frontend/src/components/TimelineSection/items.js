// @flow strict

export type TimelineItem = {|
  +title: string;
  +type: 'work' | 'project' | 'event';
  +time: string;
  +detail?: string;
  +links?: {| +name: string; url: string; |}[];
|};

const items: TimelineItem[] = [
  {
    title: 'Facebook SWE Intern',
    type: 'work',
    time: '2019-05',
  },
  {
    title: 'Cornell DTI TPM',
    type: 'work',
    time: '2019-01',
    detail: 'Technical product manager of the Samwise subteam.',
  },
  {
    title: 'SAMLANG',
    type: 'project',
    time: '2019-01',
    detail: 'Sam\'s new programming language with full type-inference.',
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
    title: 'Cornell DTI Software Developer',
    type: 'work',
    time: '2018-09',
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
    title: 'SAMPL',
    type: 'project',
    time: '2018-06',
    detail: 'Sam\'s first programming language. Archived in favor of SAMLANG.',
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
    title: 'First winning hackathon',
    type: 'event',
    time: '2017-09',
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
  },
  {
    title: 'SAM First Release',
    type: 'project',
    time: '2015-04',
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
