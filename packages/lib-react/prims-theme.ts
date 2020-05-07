import { PrismTheme } from 'prism-react-renderer';

const theme: PrismTheme = {
  plain: {
    backgroundColor: '#f7f7f7',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: 'rgb(128, 128, 128)',
        fontStyle: 'italic',
      },
    },
    {
      types: ['keyword', 'char', 'tag'],
      style: {
        color: 'rgb(62, 122, 226)',
      },
    },
    {
      types: ['operator', 'variable'],
      style: {
        color: 'rgb(56, 72, 79)',
      },
    },
    {
      types: ['constant', 'builtin', 'class-name', 'attr-name', 'selector', 'changed', 'deleted'],
      style: {
        color: 'rgb(154, 48, 173)',
      },
    },
    {
      types: ['number'],
      style: {
        color: 'rgb(195, 59, 48)',
      },
    },
    {
      types: ['string'],
      style: {
        color: 'rgb(26, 143, 82)',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'rgb(160, 161, 167)',
      },
    },
    {
      types: ['function'],
      style: {
        color: 'rgb(213, 34, 98)',
      },
    },
    {
      types: ['inserted'],
      style: {
        color: 'rgb(80, 161, 79)',
      },
    },
  ],
};

export default theme;
