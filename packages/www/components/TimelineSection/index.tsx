import React, { ReactElement } from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { connect } from 'react-redux';

import timelineItems, { TimelineItem } from '../../data/timeline';
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
  if (!(workChecked && projectsChecked && eventsChecked)) {
    if (!workChecked && !projectsChecked && !eventsChecked) {
      title += ' --none';
    } else {
      title += ' --only';
      if (workChecked) {
        title += ' work';
      }
      if (projectsChecked) {
        title += ' projects';
      }
      if (eventsChecked) {
        title += ' events';
      }
    }
  }

  const filteredItems = timelineItems.filter(({ type }: TimelineItem): boolean => {
    if (type === 'work' && workChecked) {
      return true;
    }
    if (type === 'project' && projectsChecked) {
      return true;
    }
    return type === 'event' && eventsChecked;
  });

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
