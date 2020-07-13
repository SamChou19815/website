import { ReactElement } from 'react';

import {
  CodeIcon,
  DomainIcon,
  FacebookIcon,
  GitHubIcon,
  SchoolIcon,
  WorkIcon,
} from '../components/Common/Icons';

type Fact = { readonly icon: () => ReactElement; readonly text: string };
type Link = { readonly href: string; readonly text: string };
type About = { readonly facts: readonly Fact[]; readonly links: readonly Link[] };

const about: About = {
  facts: [
    { icon: FacebookIcon, text: 'Facebook SWE Intern' },
    { icon: WorkIcon, text: 'Cornell DTI Developer' },
    { icon: GitHubIcon, text: 'Open source contributor' },
    { icon: SchoolIcon, text: 'Cornell University' },
    { icon: DomainIcon, text: 'Computer Science' },
    { icon: CodeIcon, text: 'Coding since 13' },
  ],
  links: [
    { href: 'https://blog.developersam.com', text: 'Blog' },
    { href: 'https://github.com/SamChou19815', text: 'GitHub' },
  ],
};

export default about;
