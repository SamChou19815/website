import type { WwwSvgIconName } from '../components/Icons';

type AboutSectionFact = { readonly iconName: WwwSvgIconName; readonly text: string };
type AboutSectionLink = { readonly href: string; readonly text: string };

type AboutDataEntry = {
  readonly facts: readonly AboutSectionFact[];
  readonly links: readonly AboutSectionLink[];
};

const DATASET_ABOUT: AboutDataEntry = {
  facts: [
    { iconName: 'facebook', text: 'Facebook SWE Intern' },
    { iconName: 'work', text: 'Cornell DTI Developer' },
    { iconName: 'github', text: 'Open source contributor' },
    { iconName: 'school', text: 'Cornell University' },
    { iconName: 'domain', text: 'Computer Science' },
    { iconName: 'code', text: 'Coding since 13' },
  ],
  links: [
    { href: 'https://blog.developersam.com', text: 'Blog' },
    { href: 'https://github.com/SamChou19815', text: 'GitHub' },
    { href: '/resume.pdf', text: 'Resume' },
  ],
};

export default DATASET_ABOUT;
