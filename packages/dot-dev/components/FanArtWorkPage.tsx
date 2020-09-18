/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { ReactElement } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import FanArtWorkCard from '../components/FanArtWorkCard';
import type { FanArtWork } from '../components/data';

type Props = {
  readonly title: string;
  readonly works: readonly FanArtWork[];
};

const ArtsPage = ({ title, works }: Props): ReactElement => (
  <div>
    <Head>
      <title>{title} | Random@dev-sam</title>
    </Head>
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__items">
          <Link href="/">
            <a className="navbar__brand">{title} | Random@dev-sam</a>
          </Link>
        </div>
        <div className="navbar__items navbar__items--right">
          <a className="navbar__item navbar__link" href="https://developersam.com">
            Home
          </a>
        </div>
      </div>
    </nav>
    {works.map((work) => (
      <FanArtWorkCard key={work.pageLink} {...work} />
    ))}
  </div>
);

export default ArtsPage;
