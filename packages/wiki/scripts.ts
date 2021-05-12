import generate from 'lib-react-docs/generator';

generate({
  siteTitle: 'Wiki',
  sideBarItems: {
    Documentation: ['/intro'],
    Roadmap: ['/oss-roadmap-2020-h2', '/oss-roadmap-2021'],
    Resources: ['/resources-cs'],
  },
});
