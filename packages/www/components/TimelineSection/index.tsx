import React, { ReactElement } from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
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

const ControlledCheckbox = ({ checked, onChange, label }: CheckboxProps): ReactElement => (
  <FormControlLabel
    control={<Checkbox checked={checked} onChange={onChange} color="primary" />}
    label={label}
  />
);

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
      <FormGroup row className={styles.ControlSection}>
        <h3 className={styles.ControlSectionTitle}>Filters:</h3>
        <ControlledCheckbox label="Work & Interns" checked={workChecked} onChange={workOnChange} />
        <ControlledCheckbox
          label="Projects"
          checked={projectsChecked}
          onChange={projectsOnChange}
        />
        <ControlledCheckbox label="Events" checked={eventsChecked} onChange={eventsOnChange} />
      </FormGroup>
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
