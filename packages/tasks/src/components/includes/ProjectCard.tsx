import React, { ReactElement } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import PublicIcon from '@material-ui/icons/Public';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { ReduxStoreProject } from '../../models/redux-store-types';
import styles from './ProjectCard.module.css';

const PublicOrPrivateIcon = ({ isPublic }: { readonly isPublic: boolean }): ReactElement => (
  <Tooltip title={isPublic ? 'public' : 'private'}>
    {isPublic ? (
      <PublicIcon titleAccess="public" fontSize="large" />
    ) : (
      <AccountIcon titleAccess="private" fontSize="large" />
    )}
  </Tooltip>
);

type Props = {
  readonly project: ReduxStoreProject;
  readonly onEnterClicked?: () => void;
  readonly onEditClicked?: () => void;
  readonly onDeleteClicked?: () => void;
};

export default ({
  project: { isPublic, name },
  onEnterClicked,
  onEditClicked,
  onDeleteClicked
}: Props): ReactElement => (
  <Card variant="outlined" className={styles.ProjectCard}>
    <CardHeader
      avatar={<PublicOrPrivateIcon isPublic={isPublic} />}
      classes={{
        root: isPublic
          ? `${styles.ProjectCardHeader} ${styles.ProjectCardColorPublic}`
          : `${styles.ProjectCardHeader} ${styles.ProjectCardColorPrivate}`
      }}
      title={name}
      titleTypographyProps={{ variant: 'h4' }}
    />
    <CardActions>
      <Button size="small" color="primary" onClick={onEnterClicked}>
        Project Dashboard
      </Button>
      <Button size="small" color="primary" onClick={onEditClicked}>
        Edit
      </Button>
      <Button size="small" color="primary" onClick={onDeleteClicked}>
        Delete
      </Button>
    </CardActions>
  </Card>
);
