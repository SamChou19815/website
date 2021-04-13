import React, { ReactElement } from 'react';

type Props = { readonly tile: TileCritter };

const CritterInspectionCard = ({
  tile: { id, species, memory, program, recentRuleID },
}: Props): ReactElement => {
  return (
    <div className="card critter-inspection-card">
      <div className="card__header">
        <h2>
          Critter {id} of species {species}
        </h2>
      </div>
      <div className="card__body">
        <h3>Memory</h3>
        {memory.join(', ')}
      </div>
      {program && (
        <div className="card__body">
          <h3>Program</h3>
          <pre>
            <code>{program}</code>
          </pre>
          <h3>Recent Rule:</h3>
          <pre>
            <code>{program.split(';')[recentRuleID ?? 0]?.trim()}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default CritterInspectionCard;
