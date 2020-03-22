import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Tooltip from '@material-ui/core/Tooltip';
import AccountIcon from '@material-ui/icons/AccountCircle';
import PublicIcon from '@material-ui/icons/Public';
import { useHistory } from 'react-router-dom';

import { ReduxStoreProject } from '../../models/redux-store-types';
import { editProject, deleteProject } from '../../util/firestore-actions';
import MaterialAlertDialog from '../util/MaterialAlertDialog';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import MaterialFormDialog from '../util/MaterialFormDialog';
import styles from './ProjectCard.module.css';
import ProjectCardEditForm from './ProjectCardEditForm';

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

export default ({ project: { projectId, owner, isPublic, name, color } }: Props): ReactElement => {
  const routerHistory = useHistory();

  return (
    <Card variant="outlined" className={styles.ProjectCard}>
      <MaterialColoredCardHeader
        title={name}
        color={color}
        avatar={<PublicOrPrivateIcon isPublic={isPublic} />}
        onClick={() => routerHistory.push(`/project/${projectId}`)}
      />
      <CardActions>
        <MaterialFormDialog
          formTitle="Editing Project"
          initialFormValues={{ isPublic, name, color }}
          onFormSubmit={(change) => editProject({ projectId, owner, ...change })}
          formValidator={({ name: unvalidatedName }) => unvalidatedName.trim().length > 0}
        >
          {(trigger) => (
            <Button size="small" color="primary" onClick={trigger}>
              Edit
            </Button>
          )}
          {ProjectCardEditForm}
        </MaterialFormDialog>
        <MaterialAlertDialog
          alertTitle="Deleting a project?"
          alertDescription="This means that all tasks associated with this project will also be deleted. Data cannot be recovered."
          onConfirm={() => deleteProject(projectId)}
        >
          {(trigger) => (
            <Button size="small" color="primary" onClick={trigger}>
              Delete
            </Button>
          )}
        </MaterialAlertDialog>
      </CardActions>
    </Card>
  );
};
