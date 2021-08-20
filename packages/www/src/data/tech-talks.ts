type TechTalkDataEntry = {
  readonly title: string;
  readonly description: string;
  readonly link: string;
};

const DATASET_TECH_TALKS: readonly TechTalkDataEntry[] = [
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

export default DATASET_TECH_TALKS;
