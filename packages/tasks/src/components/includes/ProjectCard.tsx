import React, { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import PublicIcon from '@material-ui/icons/Public';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { SanctionedColor } from '../../models/common-types';
import { ReduxStoreProject } from '../../models/redux-store-types';
import ProjectCardEditForm from './ProjectCardEditForm';
import MaterialAlertDialog from '../util/MaterialAlertDialog';
import MaterialFormDialog from '../util/MaterialFormDialog';
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
};

const getHeaderClassname = (color: SanctionedColor): string => {
  switch (color) {
    case 'Red':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorRed}`;
    case 'Pink':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorPink}`;
    case 'Purple':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorPurple}`;
    case 'Indigo':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorIndigo}`;
    case 'Blue':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorBlue}`;
    case 'Teal':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorTeal}`;
    case 'Green':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorGreen}`;
    case 'Light Green':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorLightGreen}`;
    case 'Orange':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorOrange}`;
    case 'Gray':
      return `${styles.ProjectCardHeader} ${styles.ProjectCardColorGray}`;
    default:
      throw new Error(`Unknown sanctioned color: ${color}`);
  }
};
export default ({ project: { projectId, isPublic, name, color } }: Props): ReactElement => {
  const routerHistory = useHistory();

  const onEdit = (): void => {
    // eslint-disable-next-line no-alert
    alert('Project editing backend support has not been implemented yet...');
  };
  const onDelete = (): void => {
    // eslint-disable-next-line no-alert
    alert('Data removal backend support has not been implemented yet...');
  };

  return (
    <Card variant="outlined" className={styles.ProjectCard}>
      <CardHeader
        avatar={<PublicOrPrivateIcon isPublic={isPublic} />}
        classes={{ root: getHeaderClassname(color), title: styles.ProjectCardHeaderText }}
        title={name}
        titleTypographyProps={{ variant: 'h4' }}
        onClick={() => routerHistory.push(`/project/${projectId}`)}
      />
      <CardActions>
        <MaterialFormDialog
          formTitle="Editing Project"
          initialFormValues={{ isPublic, name, color }}
          onFormSubmit={onEdit}
          formValidator={() => true}
        >
          {trigger => (
            <Button size="small" color="primary" onClick={trigger}>
              Edit
            </Button>
          )}
          {ProjectCardEditForm}
        </MaterialFormDialog>
        <MaterialAlertDialog
          alertTitle="Deleting a project?"
          alertDescription="This means that all tasks associated with this project will also be deleted. Data cannot be recovered."
          onConfirm={onDelete}
        >
          {trigger => (
            <Button size="small" color="primary" onClick={trigger}>
              Delete
            </Button>
          )}
        </MaterialAlertDialog>
      </CardActions>
    </Card>
  );
};
