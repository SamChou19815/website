import React, { ReactElement } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import AccountIcon from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';

import { ReduxStoreProject } from '../../models/redux-store-types';
import { editProject, deleteProject } from '../../util/firestore-actions';
import MaterialAlertDialog from '../util/MaterialAlertDialog';
import MaterialColoredCardHeader from '../util/MaterialColoredCardHeader';
import MaterialFormDialog from '../util/MaterialFormDialog';
import styles from './ProjectCard.module.css';
import ProjectCardEditForm from './ProjectCardEditForm';

type Props = { readonly project: ReduxStoreProject };

export default ({ project: { projectId, owner, name, color } }: Props): ReactElement => {
  const routerHistory = useHistory();

  const headerIcon = <AccountIcon titleAccess="private" fontSize="large" />;

  return (
    <Card variant="outlined" className={styles.ProjectCard}>
      <MaterialColoredCardHeader title={name} color={color} avatar={headerIcon} />
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => routerHistory.push(`/project/${projectId}`)}
        >
          Enter
        </Button>
        <MaterialFormDialog
          formTitle="Editing Project"
          initialFormValues={{ name, color }}
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
