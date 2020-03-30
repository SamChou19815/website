import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import { getAppUser } from 'lib-firebase/authentication';
import { useSelector } from 'react-redux';

import { SanctionedColor } from '../../models/common-types';
import { ReduxStoreState, ReduxStoreProject } from '../../models/redux-store-types';
import { createProject } from '../../util/firestore-actions';
import MaterialFormDialog from '../util/MaterialFormDialog';
import ProjectCard from './ProjectCard';
import ProjectCardEditForm from './ProjectCardEditForm';
import styles from './ProjectsPanel.module.css';

const initialProjectTemplate: {
  readonly isPublic: boolean;
  readonly name: string;
  readonly color: SanctionedColor;
} = { isPublic: false, name: '', color: 'Blue' };

export default ({ className }: { readonly className?: string }): ReactElement => {
  const [formCreationKey, setFormCreationKey] = useState(0);
  const projects = useSelector<ReduxStoreState, readonly ReduxStoreProject[]>((state) =>
    Object.values(state.projects)
  );

  return (
    <div className={className}>
      <MaterialFormDialog
        key={formCreationKey}
        formTitle="Creating Project"
        initialFormValues={initialProjectTemplate}
        onFormSubmit={(change) => {
          createProject({ owner: getAppUser().email, ...change });
          setFormCreationKey((key) => key + 1);
        }}
        formValidator={({ name: unvalidatedName }) => unvalidatedName.trim().length > 0}
      >
        {(trigger) => (
          <Button
            variant="outlined"
            color="primary"
            className={styles.AddProjectButton}
            onClick={trigger}
            disableElevation
          >
            Create New Project
          </Button>
        )}
        {ProjectCardEditForm}
      </MaterialFormDialog>
      <section className={styles.CardContainer}>
        {projects.map((project) => (
          <ProjectCard key={project.projectId} project={project} />
        ))}
      </section>
    </div>
  );
};
