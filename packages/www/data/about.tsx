import Code from '@material-ui/icons/Code';
import Domain from '@material-ui/icons/Domain';
import Facebook from '@material-ui/icons/Facebook';
import GitHub from '@material-ui/icons/GitHub';
import School from '@material-ui/icons/School';
import Work from '@material-ui/icons/Work';

type Fact = { readonly icon: typeof Code; readonly text: string };
type Link = { readonly href: string; readonly text: string };
type About = { readonly facts: readonly Fact[]; readonly links: readonly Link[] };

const about: About = {
  facts: [
    { icon: Facebook, text: 'Facebook SWE Intern' },
    { icon: Work, text: 'Cornell DTI Dev Lead' },
    { icon: GitHub, text: 'Open source contributor' },
    { icon: School, text: 'Cornell University' },
    { icon: Domain, text: 'Computer Science' },
    { icon: Code, text: 'Coding since 13' },
  ],
  links: [
    { href: 'https://blog.developersam.com', text: 'Blog' },
    { href: 'https://github.com/SamChou19815', text: 'GitHub' },
  ],
};

export default about;
