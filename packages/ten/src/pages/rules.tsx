import React, { ReactElement } from 'react';

import RulesContent from '../components/rules.md';

const Rules = (): ReactElement => (
  <div className="card">
    <div className="card__header">Rules</div>
    <div className="card__body">
      <RulesContent />
    </div>
  </div>
);

export default Rules;
