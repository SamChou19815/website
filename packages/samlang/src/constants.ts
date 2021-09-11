export const SAMLANG_TITLE = 'samlang';
export const SAMLANG_LOGO = '/img/favicon.png';
export const SAMLANG_URL = 'https://samlang.io';

type SimpleSidebarItems = readonly string[] | { readonly [category: string]: SimpleSidebarItems };

export const SAMLANG_SIDEBAR_ITEMS: SimpleSidebarItems = {
  'Language Basics': ['/introduction', '/classes-types', '/expressions', '/type-inference'],
  'Implementation Notes': ['/architecture', '/intermediate-representation'],
};
