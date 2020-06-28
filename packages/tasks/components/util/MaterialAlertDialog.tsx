import React, { ReactElement, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = {
  readonly alertTitle: string;
  readonly alertDescription: string;
  readonly onConfirm: () => void;
  /** Triggering component for alert. */
  readonly children: (trigger: () => void) => ReactElement;
};

const MaterialAlertDialog = ({
  alertTitle,
  alertDescription,
  onConfirm,
  children,
}: Props): ReactElement => {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  return (
    <>
      {children(() => setOpen(true))}
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{alertTitle}</DialogTitle>
        <DialogContent id="alert-dialog-description">
          <DialogContentText>{alertDescription}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              onConfirm();
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MaterialAlertDialog;
