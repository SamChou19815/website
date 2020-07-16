import React, { ReactElement } from 'react';

import clsx from 'clsx';
import { connect } from 'react-redux';

import { TimelineItemType, getFilteredTimeline } from '../../data/timeline';
import { State, TimelineState, patchTimeline } from '../../store';
import ConsoleSection from '../Common/ConsoleSection';
import TimelineItemCard from './TimelineItemCard';
import styles from './index.module.css';

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

export const TimelineSection = ({
  workChecked,
  projectsChecked,
  eventsChecked,
}: TimelineState): ReactElement => {
  const workOnChange = (): void => {
    patchTimeline({ workChecked: !workChecked, projectsChecked, eventsChecked });
  };
  const projectsOnChange = (): void => {
    patchTimeline({ workChecked, projectsChecked: !projectsChecked, eventsChecked });
  };
  const eventsOnChange = (): void => {
    patchTimeline({ workChecked, projectsChecked, eventsChecked: !eventsChecked });
  };

  let title = 'dev-sam timeline';
  const types: TimelineItemType[] = [];
  if (workChecked && projectsChecked && eventsChecked) {
    types.push('work', 'project', 'event');
  } else if (!workChecked && !projectsChecked && !eventsChecked) {
    title += ' --none';
  } else {
    title += ' --only';
    if (workChecked) {
      title += ' work';
      types.push('work');
    }
    if (projectsChecked) {
      title += ' projects';
      types.push('project');
    }
    if (eventsChecked) {
      title += ' events';
      types.push('event');
    }
  }

  const filteredItems = getFilteredTimeline(types);

  return (
    <ConsoleSection id="timeline" title={title}>
      <div className={styles.ControlSection}>
        <h3 className={styles.ControlSectionTitle}>Filters:</h3>
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
      <div className={styles.TimelineSection}>
        <div className={styles.VerticalBar} />
        {filteredItems.map((item) => (
          <TimelineItemCard key={`${item.title}-${item.time}`} item={item} />
        ))}
      </div>
    </ConsoleSection>
  );
};

const Connected = connect(({ timeline }: State) => ({ ...timeline }))(TimelineSection);
export default Connected;
