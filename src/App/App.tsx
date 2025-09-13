import { evaluate } from 'mathjs';
import './App.scss';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import BackspaceIcon from '@mui/icons-material/Backspace';

export default function App() {

    function vibrateDevice(time: number) {
        if ('vibrate' in navigator) navigator.vibrate(time);
    }


    useEffect(() => {

        let userInput = document.getElementById('user_input');
        let resultText = document.getElementById('result_text');

        let buttonsPad = document.getElementById('down-section-wrapper');
        let clearButton = document.getElementById('clear_button');
        let resultButton = document.getElementById('result_button');

        const calculate = (vibrationTime = 100) => {
            if (userInput) {
                let inputValue = (userInput as HTMLInputElement).value.replaceAll('÷', '/').replaceAll('×', '*').replaceAll('−', '-');
                try {
                    let result = evaluate(inputValue);
                    if (Number(result) || result == 0) {
                        (resultText as HTMLParagraphElement).innerText = result;
                        vibrateDevice(vibrationTime);
                        return 1;
                    }
                } catch (error: any) {
                    (resultText as HTMLParagraphElement).innerText = (userInput as HTMLInputElement).value == '' ? '' : 'error'.toUpperCase();
                    return 0;
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

            //All numpad buttons -> symbols & digits
            document.querySelectorAll('#down-section-wrapper button').forEach((htmlElement: any, index: number) => {

                if (htmlElement == clearButton) {

                    //Pointer on CLEAR BUTTON (when deleting)
                    let intervalID = 0;
                    let pointerIsDown = false;
                    const timeLimitMs = 200;

                    clearButton?.addEventListener('pointerdown', (event: any) => {
                        pointerIsDown = true;
                        (resultText as HTMLParagraphElement).innerHTML = `&nbsp;`;
                        let startTime = Date.now();

                        const repeatFn = () => {
                            let timeDifference = Date.now() - startTime;
                            if (timeDifference <= 1200) (userInput as HTMLInputElement).value = (userInput as HTMLInputElement).value.toString().slice(0, -1);
                            else if (timeDifference <= 2000) (userInput as HTMLInputElement).value = (userInput as HTMLInputElement).value.toString().slice(0, -2);
                            else {
                                let stringValue = (userInput as HTMLInputElement).value.toString();
                                (userInput as HTMLInputElement).value = stringValue.slice(0, -stringValue.length);
                            }
                        }
                        intervalID = window.setInterval(repeatFn, timeLimitMs);
                    });
                    clearButton?.addEventListener('pointerup', () => {
                        pointerIsDown = false
                        clearInterval(intervalID);
                        setTimeout(() => { userInput?.focus(); }, timeLimitMs);
                    });
                    clearButton?.addEventListener('pointercancel', () => {
                        pointerIsDown = false
                        clearInterval(intervalID);
                        setTimeout(() => { userInput?.focus(); }, timeLimitMs);
                    });
                    clearButton?.addEventListener('click', () => {
                        if (pointerIsDown == false) {
                            userInput?.focus();
                            (userInput as HTMLInputElement).value = (userInput as HTMLInputElement).value.toString().slice(0, -1);
                        }
                    });
                }
                else if (htmlElement == resultButton) {

                    //When result button clicked or pressed for longer time

                    let startTime = 0;
                    let pointerIsDown = false;
                    const timeLimitMS = 200;

                    resultButton?.addEventListener('pointerdown', (event: any) => {
                        pointerIsDown = true;
                        startTime = Date.now();
                    });

                    resultButton?.addEventListener('pointerup', (event: any) => {
                        const wrtittenResultText = (resultText as HTMLParagraphElement).textContent;

                        if (calculate(0) && pointerIsDown) {
                            if ((Date.now() - startTime) >= 1200 && (userInput as HTMLInputElement).value != wrtittenResultText) {
                                (userInput as HTMLInputElement).value = (resultText as HTMLParagraphElement).innerText;
                                vibrateDevice(300);
                            }
                        }

                        userInput?.focus();
                        setTimeout(() => pointerIsDown = false, timeLimitMS)
                    });

                    resultButton?.addEventListener('pointercancel', (event: any) => {
                        const wrtittenResultText = (resultText as HTMLParagraphElement).textContent;

                        if (calculate() && pointerIsDown) {
                            if ((Date.now() - startTime) >= 1200 && (userInput as HTMLInputElement).value != wrtittenResultText) {
                                (userInput as HTMLInputElement).value = (resultText as HTMLParagraphElement).innerText;
                            }
                        }

                        userInput?.focus();
                        setTimeout(() => pointerIsDown = false, timeLimitMS)
                    });

                    resultButton?.addEventListener('click', (event: any) => {
                        calculate();
                    });

                } else {

                    let buttonSymbol = htmlElement.textContent;
                    let pointerIsDown = false;

                    // Math Operations when pressed for longer time
                    if (buttonSymbol == '×' || buttonSymbol == '+' || buttonSymbol == '−' || buttonSymbol == '÷') {

                        let startTime = 0;
                        const timeLimitMS = 200;

                        htmlElement?.addEventListener('pointerdown', (event: any) => {
                            pointerIsDown = true;
                            startTime = Date.now();
                        });
                        htmlElement?.addEventListener('pointerup', (event: any) => {
                            const wrtittenResultText = (resultText as HTMLParagraphElement).textContent;

                            if ((Date.now() - startTime) <= 600 || !Number(wrtittenResultText)) (userInput as HTMLInputElement).value += buttonSymbol;
                            else { (userInput as HTMLInputElement).value = wrtittenResultText + buttonSymbol; vibrateDevice(200) }
                            userInput?.focus();
                            (resultText as HTMLParagraphElement).innerHTML = `&nbsp;`;

                            setTimeout(() => pointerIsDown = false, timeLimitMS)
                        });
                        htmlElement?.addEventListener('pointercancel', (event: any) => {
                            const wrtittenResultText = (resultText as HTMLParagraphElement).textContent;

                            if ((Date.now() - startTime) <= 600 || !Number(wrtittenResultText)) (userInput as HTMLInputElement).value += buttonSymbol;
                            else (userInput as HTMLInputElement).value = wrtittenResultText + buttonSymbol;
                            userInput?.focus();
                            (resultText as HTMLParagraphElement).innerHTML = `&nbsp;`;

                            setTimeout(() => pointerIsDown = false, timeLimitMS)
                        });
                    }

                    //Other buttons including buttons for math operations when only click triggers
                    htmlElement.addEventListener('click', (event: any) => {
                        if (pointerIsDown == false) {

                            vibrateDevice(100);

                            userInput?.focus();
                            (resultText as HTMLParagraphElement).innerHTML = `&nbsp;`;
                            (userInput as HTMLInputElement).value += buttonSymbol;
                        }
                    });
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