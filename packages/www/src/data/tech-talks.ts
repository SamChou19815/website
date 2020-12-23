type TechTalkDataEntry = {
  readonly title: string;
  readonly type: string;
  readonly description: string;
  readonly link: string;
};

const DATASET_TECH_TALKS: readonly TechTalkDataEntry[] = [
  {
    title: 'How to scale',
    type: 'Learning Series',
    description:
      "Tips on scaling your codebase and your workload, with lessons learned from Samwise's codebase.",
    link: '/how-to-scale.pdf',
  },
  {
    title: 'Intro to Firebase',
    type: 'DevSesh',
    description: 'Tech stack discussion on Firebase, and why Samwise switched to Firebase.',
    link: '/intro-to-firebase.pdf',
  },
  {
    title: 'Build your programming language',
    type: 'DevSesh',
    description: 'A tutorial of making a simple programming language derived from lambda-calculus.',
    link: '/build-your-own-programming-language.pdf',
  },
  {
    title: 'Build a (simplified) React',
    type: 'DevSesh',
    description:
      'A tutorial of making a simplified React runtime with support for useState and useEffect hooks.',
    link: '/build-simplified-react.pdf',
  },
  {
    title: 'CoursePlan Requirement Computation',
    type: 'DevSesh',
    description:
      'An overview of the challanges and solutions of college requirement fulfillment computation.',
    link: '/courseplan-requirement.pdf',
  },
];

export default DATASET_TECH_TALKS;
