import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './Settings.scss';

import { useEffect, useRef, useState } from 'react';

export default function Settings({ open, handleClose, onSendMessage = null }: any) {

    const dialogRef = useRef<HTMLDialogElement>(null);
    let answer: string | null = null;

    useEffect(() => {




    }, []);

    return (
        <Dialog open={open} onClose={handleClose} id="dialog" maxWidth={false} sx={{ '& .MuiPaper-root': { width: '80%', height: '80%' } }}>
            <DialogTitle>My Dialog Title</DialogTitle>
            <DialogContent>
                This is the content of the dialog.
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={() => {
                    onSendMessage('xvccgczz');
                  
                    handleClose()
                }}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}