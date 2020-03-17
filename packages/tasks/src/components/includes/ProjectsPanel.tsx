import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { SanctionedColor } from '../../models/common-types';
import { ReduxStoreState, ReduxStoreProject } from '../../models/redux-store-types';
import ProjectCard from './ProjectCard';
import ProjectCardEditForm from './ProjectCardEditForm';
import MaterialFormDialog from '../util/MaterialFormDialog';
import { createProject } from '../../util/firestore-actions';
import { getAppUser } from '../../util/authentication';
import styles from './ProjectsPanel.module.css';

const initialProjectTemplate: {
  readonly isPublic: boolean;
  readonly name: string;
  readonly color: SanctionedColor;
} = { isPublic: false, name: '', color: 'Blue' };

export default (): ReactElement => {
  const [formCreationKey, setFormCreationKey] = useState(0);
  const projects = useSelector<ReduxStoreState, readonly ReduxStoreProject[]>(state =>
    Object.values(state.projects)
  );

  return (
    <div>
      <section className={styles.CardContainer}>
        {projects.map(project => (
          <ProjectCard key={project.projectId} project={project} />
        ))}
      </section>
      <MaterialFormDialog
        key={formCreationKey}
        formTitle="Creating Project"
        initialFormValues={initialProjectTemplate}
        onFormSubmit={change => {
          createProject({ owner: getAppUser().email, ...change });
          setFormCreationKey(key => key + 1);
        }}
        formValidator={({ name: unvalidatedName }) => unvalidatedName.trim().length > 0}
      >
        {trigger => (
          <Fab color="primary" className={styles.AddProjectFab} onClick={trigger}>
            <AddIcon />
          </Fab>
        )}
        {ProjectCardEditForm}
      </MaterialFormDialog>
    </div>
  );
};
