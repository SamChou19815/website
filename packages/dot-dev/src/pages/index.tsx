import React from 'react';

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
const FAN_ART_GRADUATION: FanArtWork = {
  filename: 'graduation-sam.webp',
  author: MEGAN,
  description: '@dev-sam/fan-art Graduation Edition',
};

function FanArtWorkCard({
  filename,
  author: { authorName, authorWebsite },
  description,
}: FanArtWork): JSX.Element {
  return (
    <div className="bg-white flex flex-col filter drop-shadow-sm mx-auto my-4 w-11/12 md:w-96 lg:mx-4">
      <div>
        <img
          src={`https://developersam.com/fan-arts/${filename}`}
          alt={description}
          title={description}
          loading="lazy"
        />
      </div>
      <h2 className="p-4 pb-0 text-lg font-bold">{description}</h2>
      <div className="p-4">Author: {authorName}</div>
      <div className="p-4 pt-0">
        <a
          className="p-2 rounded-md flex justify-center font-bold text-blue-500 hover:bg-blue-500 hover:bg-opacity-10"
          href={authorWebsite}
        >
          {`${authorName}'s website`}
        </a>
      </div>
    </div>
  );
}

export default function ArtsPage(): JSX.Element {
  return (
    <div>
      <nav className="flex bg-white filter drop-shadow-sm px-4 py-2 h-16">
        <div className="flex flex-wrap justify-between w-full">
          <div className="flex items-center flex-auto min-w-0">
            <a className="flex mr-8 items-center text-gray-900 min-w-0 font-bold" href="/">
              Fan Arts | Random@dev-sam
            </a>
          </div>
          <div className="flex items-center min-w-0 flex-initial justify-end">
            <a
              className="px-3 py-1 text-gray-900 font-medium hover:text-blue-500"
              href="https://developersam.com"
            >
              Home
            </a>
          </div>
        </div>
      </nav>
      <div className="lg:flex lg:flex-row lg:flex-wrap lg:justify-center">
        <FanArtWorkCard {...FAN_ART_GRADUATION} />
        <FanArtWorkCard {...FAN_ART_BIRTHDAY_EDITION} />
        <FanArtWorkCard {...FAN_ART_ITERATION_3} />
        <FanArtWorkCard {...FAN_ART_ITERATION_2} />
        <FanArtWorkCard {...FAN_ART_ITERATION_1} />
        <FanArtWorkCard {...FAN_ART_ITERATION_0} />
      </div>
    </div>
  );
}

ArtsPage.noJS = true;
