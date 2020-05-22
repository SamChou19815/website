import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import useFormManager from '../hooks/useFormManager';
import styles from './MaterialFormDialog.module.css';

export type FormProps<T extends Record<string, unknown>> = {
  readonly values: T;
  readonly onChange: (updatedValues: Partial<T>) => void;
};

type Props<T extends Record<string, unknown>> = {
  readonly formTitle: string;
  readonly initialFormValues: T;
  readonly onFormSubmit: (validatedValues: T) => void;
  readonly formValidator: (values: T) => boolean;
  readonly formComponent: (props: FormProps<T>) => ReactElement;
  readonly children: (trigger: () => void) => ReactElement;
};

export default <T extends Record<string, unknown>>({
  formTitle,
  initialFormValues,
  onFormSubmit,
  formValidator,
  formComponent: FormComponent,
  children: dialogTrigger,
}: Props<T>): ReactElement => {
  const [open, setOpen] = useState(false);
  const [formValues, setPartialFormValues] = useFormManager(initialFormValues);

  const onClose = () => setOpen(false);

  return (
    <>
      {dialogTrigger(() => setOpen(true))}
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
        classes={{ paper: styles.Dialog }}
      >
        <DialogTitle id="form-dialog-title">{formTitle}</DialogTitle>
        <DialogContent>
          <FormComponent values={formValues} onChange={setPartialFormValues} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              onFormSubmit(formValues);
            }}
            color="primary"
            disabled={!formValidator(formValues)}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
