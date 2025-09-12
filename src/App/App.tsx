import { evaluate } from 'mathjs';
import './App.scss';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import BackspaceIcon from '@mui/icons-material/Backspace';

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
                if (event.target == resultButton) {
                    calculate();
                } else if (event.target instanceof HTMLButtonElement && event.target != clearButton) {
                    let buttonSymbol = event.target.textContent;
                    if (userInput)
                        (userInput as HTMLInputElement).value += buttonSymbol;
                }
            });

            //Pointer on CLEAR BUTTON (when deleting)

            let intervalID = 0;
            clearButton?.addEventListener('pointerdown', (event: any) => {

                if (userInput) {
                    let startTime = Date.now();
                    let timeDifference = 0;

                    const repeatFn = () => {
                        timeDifference = Date.now() - startTime;

                        if (timeDifference <= 1200) (userInput as HTMLInputElement).value = (userInput as HTMLInputElement).value.toString().slice(0, -1);
                        else if (timeDifference <= 2000) (userInput as HTMLInputElement).value = (userInput as HTMLInputElement).value.toString().slice(0, -2);
                        else {
                            let stringValue = (userInput as HTMLInputElement).value.toString();
                            (userInput as HTMLInputElement).value = stringValue.slice(0, -stringValue.length);
                        }
                    }

                    intervalID = window.setInterval(repeatFn, 50);
                }
            });
            clearButton?.addEventListener('pointerup', () => clearInterval(intervalID));
            clearButton?.addEventListener('pointercancel', () => clearInterval(intervalID));
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
                    <Button variant='contained' size="large">&times;</Button>
                    <Button variant='contained' size="large">&#43;</Button>
                    <Button variant='contained' size="large">&minus;</Button>
                    <Button variant='contained' size="large">&divide;</Button>
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