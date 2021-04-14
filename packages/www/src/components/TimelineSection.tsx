import clsx from 'clsx';
import React, { ReactElement } from 'react';

import { TimelineItem, TimelineItemType, getFilteredTimeline } from '../data/timeline';
import ButtonLink from './Common/ButtonLink';
import CardHeader from './Common/CardHeader';
import LazyCardMedia from './Common/LazyCardMedia';
import { useTimelinePillsState } from './global-states';

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

const TimelineItemCard = ({
  item: { title, time, image, detail, links },
}: {
  readonly item: TimelineItem;
}): ReactElement => {
  return (
    <div className="card-container">
      <div className="content-wrapper">
        <span className="connector-dot" />
        <div className="card">
          {image != null && <LazyCardMedia image={image} title={title} />}
          <CardHeader title={title} subheader={time} />
          {detail != null && <div className="card__body">{detail}</div>}
          {links != null && (
            <div className="card__footer">
              {links.map(
                ({ name, url }, index): ReactElement => (
                  // eslint-disable-next-line react/no-array-index-key
                  <ButtonLink key={index} href={url}>
                    {name}
                  </ButtonLink>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
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
        <h3 className="title">Filters:</h3>
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
        <div className="vertical-bar" />
        {filteredItems.map((item) => (
          <TimelineItemCard key={`${item.title}-${item.time}`} item={item} />
        ))}
      </div>
    </>
  );
};

export default TimelineSection;
