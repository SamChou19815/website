import clsx from 'clsx';
import React, { ReactElement } from 'react';

import { TimelineItemType, getFilteredTimeline } from '../../data/timeline';
import { useTimelinePillsState } from '../global-states';
import TimelineItemCard from './TimelineItemCard';

type CheckboxProps = {
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: () => void;
};

const ControlledCheckbox = ({ checked, onChange, label }: CheckboxProps): ReactElement => {
  const className = clsx('button', 'pills__item', checked && 'pills__item--active');
  return (
    <button type="button" className={className} onClick={onChange}>
      {label}
    </button>
  );
};

export const TimelineSection = (): ReactElement => {
  const [{ workChecked, projectsChecked, eventsChecked }, patchTimeline] = useTimelinePillsState();

  const workOnChange = (): void => {
    patchTimeline({ workChecked: !workChecked, projectsChecked, eventsChecked });
  };
  const projectsOnChange = (): void => {
    patchTimeline({ workChecked, projectsChecked: !projectsChecked, eventsChecked });
  };
  const eventsOnChange = (): void => {
    patchTimeline({ workChecked, projectsChecked, eventsChecked: !eventsChecked });
  };

  const types: TimelineItemType[] = [];
  if (workChecked) types.push('work');
  if (projectsChecked) types.push('project');
  if (eventsChecked) types.push('event');

  const filteredItems = getFilteredTimeline(types);

  return (
    <>
      <div className="timeline-controls">
        <h3 className="timeline-controls-title">Filters:</h3>
        <ul className="pills">
          <ControlledCheckbox
            label="Work & Interns"
            checked={workChecked}
            onChange={workOnChange}
          />
          <ControlledCheckbox
            label="Projects"
            checked={projectsChecked}
            onChange={projectsOnChange}
          />
          <ControlledCheckbox label="Events" checked={eventsChecked} onChange={eventsOnChange} />
        </ul>
      </div>
      <div className="timeline-section">
        <div className="timeline-section-vertical-bar" />
        {filteredItems.map((item) => (
          <TimelineItemCard key={`${item.title}-${item.time}`} item={item} />
        ))}
      </div>
    </>
  );
};

export default TimelineSection;
