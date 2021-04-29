import React, { ReactElement } from 'react';

type Author = { readonly authorName: string; readonly authorWebsite: string };

type FanArtWork = {
  readonly filename: string;
  readonly author: Author;
  readonly description: string;
};

const MEGAN: Author = { authorName: 'Megan Yin', authorWebsite: 'https://meganyin.com/' };
const PETER: Author = { authorName: 'Peter Wu', authorWebsite: 'https://peterwu.dev/' };

const FAN_ART_ITERATION_0: FanArtWork = {
  filename: 'dev-sam-fan-art-0.webp',
  author: PETER,
  description: '@dev-sam/fan-art Iteration 0',
};
const FAN_ART_ITERATION_1: FanArtWork = {
  filename: 'dev-sam-fan-art-1.webp',
  author: MEGAN,
  description: '@dev-sam/fan-art Iteration 1',
};
const FAN_ART_ITERATION_2: FanArtWork = {
  filename: 'dev-sam-fan-art-2.webp',
  author: MEGAN,
  description: '@dev-sam/fan-art Iteration 2',
};
const FAN_ART_ITERATION_3: FanArtWork = {
  filename: 'dev-sam-fan-art-3.webp',
  author: MEGAN,
  description: '@dev-sam/fan-art Iteration 3',
};
const FAN_ART_BIRTHDAY_EDITION: FanArtWork = {
  filename: 'dev-sam-birthday-edition.webp',
  author: MEGAN,
  description: '@dev-sam/fan-art Birthday Edition',
};

const FanArtWorkCard = ({
  filename,
  author: { authorName, authorWebsite },
  description,
}: FanArtWork): ReactElement => (
  <div className="card">
    <div className="card__image">
      <img
        src={`https://developersam.com/fan-arts/${filename}`}
        alt={description}
        title={description}
        loading="lazy"
      />
    </div>
    <div className="card__header">
      <h3>{description}</h3>
    </div>
    <div className="card__body">Author: {authorName}</div>
    <div className="card__footer">
      <div className="button-group button-group--block">
        <a className="button button--link" href={authorWebsite}>
          {`${authorName}'s website`}
        </a>
      </div>
    </div>
  </div>
);

const ArtsPage = (): ReactElement => (
  <div>
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__items">
          <a className="navbar__brand" href="/">
            Fan Arts | Random@dev-sam
          </a>
        </div>
        <div className="navbar__items navbar__items--right">
          <a className="navbar__item navbar__link" href="https://developersam.com">
            Home
          </a>
        </div>
      </div>
    </nav>
    <FanArtWorkCard {...FAN_ART_BIRTHDAY_EDITION} />
    <FanArtWorkCard {...FAN_ART_ITERATION_3} />
    <FanArtWorkCard {...FAN_ART_ITERATION_2} />
    <FanArtWorkCard {...FAN_ART_ITERATION_1} />
    <FanArtWorkCard {...FAN_ART_ITERATION_0} />
  </div>
);

ArtsPage.noJS = true;

export default ArtsPage;
