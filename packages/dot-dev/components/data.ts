export type Author = { readonly authorName: string; readonly authorWebsite?: string };

export type FanArtWork = {
  readonly link: string;
  readonly author: Author;
  readonly description: string;
  readonly pageLink: string;
};

export const MEGAN: Author = { authorName: 'Megan Yin', authorWebsite: 'https://meganyin.com/' };
export const PETER: Author = { authorName: 'Peter Wu', authorWebsite: 'https://peterwu.dev/' };

export const FAN_ART_ITERATION_0: FanArtWork = {
  link: '/fan-arts/dev-sam-fan-art-0.webp',
  author: PETER,
  description: '@dev-sam/fan-art Iteration 0',
  pageLink: '/fan-art-iteration-0',
};

export const FAN_ART_ITERATION_1: FanArtWork = {
  link: '/fan-arts/dev-sam-fan-art-1.webp',
  author: MEGAN,
  description: '@dev-sam/fan-art Iteration 1',
  pageLink: '/fan-art-iteration-1',
};

export const FAN_ART_ITERATION_2: FanArtWork = {
  link: '/fan-arts/dev-sam-fan-art-2.webp',
  author: MEGAN,
  description: '@dev-sam/fan-art Iteration 2',
  pageLink: '/fan-art-iteration-2',
};

export const FAN_ART_ITERATION_3: FanArtWork = {
  link: '/fan-arts/dev-sam-fan-art-3.webp',
  author: MEGAN,
  description: '@dev-sam/fan-art Iteration 3',
  pageLink: '/fan-art-iteration-3',
};

export const FAN_ART_BIRTHDAY_EDITION: FanArtWork = {
  link: '/fan-arts/dev-sam-birthday-edition.webp',
  author: MEGAN,
  description: '@dev-sam/fan-art Birthday Edition',
  pageLink: '/fan-art-birthday-edition',
};
