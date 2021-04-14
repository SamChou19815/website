type TechTalkDataEntry = {
  readonly title: string;
  readonly description: string;
  readonly link: string;
};

const DATASET_TECH_TALKS: readonly TechTalkDataEntry[] = [
  {
    title: 'How to scale',
    description:
      "Tips on scaling your codebase and your workload, with lessons learned from Samwise's codebase.",
    link: '/how-to-scale.pdf',
  },
  {
    title: 'Intro to Firebase',
    description: 'Tech stack discussion on Firebase, and why Samwise switched to Firebase.',
    link: '/intro-to-firebase.pdf',
  },
  {
    title: 'Build your programming language',
    description: 'A tutorial of making a simple programming language derived from lambda-calculus.',
    link: '/build-your-own-programming-language.pdf',
  },
  {
    title: 'Build a (simplified) React',
    description:
      'A tutorial of making a simplified React runtime with support for useState and useEffect hooks.',
    link: '/build-simplified-react.pdf',
  },
  {
    title: 'CoursePlan Requirement Computation',
    description:
      'An overview of the challanges and solutions of college requirement fulfillment computation.',
    link: '/courseplan-requirement.pdf',
  },
];

export default DATASET_TECH_TALKS;
