import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useRef } from 'react';

export default function Settings({ onSendData }: any) {

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        onSendData(dialogRef);
    }, [])


    return (
        <>
            <SettingsIcon />

            <dialog ref={dialogRef}>

                <p>...</p>

            </dialog>
        </>




    )
}