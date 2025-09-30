import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './Settings.scss';

import { useEffect, useRef, useState } from 'react';

export default function Settings({ open, handleClose, onSendMessage = null }: any) {

    const settingsButtonsPadRef = useRef<any>(null);
    const buttonIsClicked = (event: any) => {
        onSendMessage(event.target.innerText);
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={false} sx={{ '& .MuiPaper-root': { width: '80%', height: '80%' } }} id='settings-dialog' ref={settingsButtonsPadRef}>
            {

            /*<DialogTitle>My Dialog Title</DialogTitle>
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
            
            */}

            <DialogContent sx={{ '& .MuiDialogContent-root': { width: '100%', height: '100%' } }}>
                <Button variant='contained' size="large" onClick={buttonIsClicked}>!</Button>
                <Button variant='contained' size="large" onClick={buttonIsClicked}>%</Button>
            </DialogContent>
        </Dialog>
    )
}