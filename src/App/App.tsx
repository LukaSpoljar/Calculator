import { evaluate } from 'mathjs';
import './App.scss';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import BackspaceIcon from '@mui/icons-material/Backspace';
import IconButton from '@mui/material/IconButton';

export default function App() {

    useEffect(() => {

        let userInput = document.getElementById('user_input');
        let resultText = document.getElementById('result_text');

        let buttonsPad = document.getElementById('down-section-wrapper');
        let clearButton = document.getElementById('clear_button');
        let resultButton = document.getElementById('result_button');

        const calculate = () => {
            if (userInput) {
                let inputValue = (userInput as HTMLInputElement).value.replaceAll('÷', '/').replaceAll('×', '*').replaceAll('−', '-');
                try {
                    let result = evaluate(inputValue);
                    if (Number(result) || result == 0) {
                        (resultText as HTMLParagraphElement).innerText = result;
                    }
                } catch (error: any) {
                    (resultText as HTMLParagraphElement).innerText = (userInput as HTMLInputElement).value == '' ? '' : 'error'.toUpperCase();
                }
            }
        }

        if ((userInput && resultButton && clearButton && resultText && buttonsPad) instanceof HTMLElement) {

            userInput?.addEventListener('keydown', (event: any) => {
                (resultText as HTMLParagraphElement).innerHTML = `&nbsp;`;
                if (event.key == 'Enter') {
                    calculate();
                }
            });

            buttonsPad?.addEventListener('click', (event: any) => {
                userInput?.focus();
                (resultText as HTMLParagraphElement).innerHTML = `&nbsp;`;
                if (event.target == clearButton) {
                    if (userInput) {
                        (userInput as HTMLInputElement).value = (userInput as HTMLInputElement).value.toString().slice(0, -1);;
                    }
                } else if (event.target == resultButton) {
                    calculate();
                } else if (event.target instanceof HTMLButtonElement) {
                    let buttonSymbol = event.target.textContent;

                    if (userInput)
                        (userInput as HTMLInputElement).value += buttonSymbol;
                }
            });
        }
    }, [])


    return (
        <div id='app-wrapper'>
            <div id='up-section-wrapper'>
                <div>
                    <input id='user_input' placeholder='0' autoFocus type='text' inputMode='none' />
                </div>
                <div>
                    <p id='result_text'>&nbsp;</p>
                </div>
            </div>
            <div id='down-section-wrapper'>
                <div id='side-operations'>
                    <Button variant='contained' size="large">&nbsp;&divide;&nbsp;</Button>
                    <Button variant='contained' size="large">&nbsp;&times;&nbsp;</Button>
                    <Button variant='contained' size="large">&nbsp;&minus;&nbsp;</Button>
                    <Button variant='contained' size="large">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#43;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>

                    {
                        //                    <Button variant='contained' size="large">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                    }
                </div>
                <div id='symbols-and-digits-wrapper'>
                    <div className='one-row'>
                        <Button variant='contained' size="large" id='clear_button'>
                            &nbsp;<BackspaceIcon />&nbsp;
                        </Button>
                    </div>

                    <div className='one-row'>
                        <Button variant='contained' size="large" >1</Button>
                        <Button variant='contained' size="large" >2</Button>
                        <Button variant='contained' size="large" >3</Button>
                    </div>

                    <div className='one-row'>
                        <Button variant='contained' size="large" >4</Button>
                        <Button variant='contained' size="large" >5</Button>
                        <Button variant='contained' size="large" >6</Button>
                    </div>

                    <div className='one-row'>
                        <Button variant='contained' size="large" >7</Button>
                        <Button variant='contained' size="large" >8</Button>
                        <Button variant='contained' size="large" >9</Button>
                    </div>

                    <div className='one-row'>
                        <Button variant='contained' size="large" >.</Button>
                        <Button variant='contained' size="large" >0</Button>
                        <Button id='result_button' variant='contained' size="large">=</Button>
                    </div>
                </div>

            </div>
        </div>
    )
}