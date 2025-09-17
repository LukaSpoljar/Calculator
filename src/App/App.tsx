import { evaluate } from 'mathjs';
import './App.scss';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import BackspaceIcon from '@mui/icons-material/Backspace';

export default function App() {

    function vibrateDevice(time: number) {
        if ('vibrate' in window.navigator) window.navigator.vibrate(time);
    }
    const mathOperations = ['×', '+', '−', '÷'];

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
                    if (result == Number(result) || result == 0) {

                        let positiveOrNegativeSymbol = result < 0 ? '−' : '';
                        result = Math.abs(result);

                        (resultText as HTMLParagraphElement).textContent = positiveOrNegativeSymbol + parseFloat(result.toFixed(4)).toString();
                        return (positiveOrNegativeSymbol + parseFloat(result.toFixed(4)).toString());
                    } else return null;
                } catch (error: any) {
                    (resultText as HTMLParagraphElement).textContent = (userInput as HTMLInputElement).value == '' ? '' : 'error'.toUpperCase();
                    return null;
                }
            }
        }

        if ((userInput && resultButton && clearButton && resultText && buttonsPad) instanceof HTMLElement) {

            userInput?.addEventListener('keydown', (event: any) => {
                (resultText as HTMLParagraphElement).innerHTML = `&nbsp;`;
                if (event.key == 'Enter') { calculate(); }
            });

            //All numpad buttons -> symbols & digits
            document.querySelectorAll('#down-section-wrapper button').forEach((htmlElement: any, index: number) => {
                if (htmlElement == clearButton) {
                    //Pointer on CLEAR BUTTON (when deleting)
                    if (window.PointerEvent) {
                        let intervalID: any = undefined;
                        let onlyOnce: boolean = true;

                        clearButton?.addEventListener('pointerdown', (event: any) => {
                            (resultText as HTMLParagraphElement).innerHTML = `&nbsp;`;
                            let startTime = Date.now();

                            const repeatFn = () => {
                                let timeDifference = Date.now() - startTime;
                                let inputValue = (userInput as HTMLInputElement).value.toString();

                                onlyOnce = true;

                                if (timeDifference <= 2000) {
                                    onlyOnce = false;
                                    (userInput as HTMLInputElement).value = inputValue.slice(0, -2);
                                    vibrateDevice(200);
                                }
                                else if (timeDifference > 2000) {
                                    onlyOnce = false;
                                    (userInput as HTMLInputElement).value = inputValue.slice(0, -inputValue.length);
                                    vibrateDevice(300);
                                }
                            }
                            intervalID = window.setInterval(repeatFn, 300);
                        });
                        clearButton?.addEventListener('pointerup', () => {
                            clearInterval(intervalID);
                            if (onlyOnce) {
                                let inputValue = (userInput as HTMLInputElement).value.toString();
                                (userInput as HTMLInputElement).value = inputValue.slice(0, -1);
                                vibrateDevice(100);
                            }
                            onlyOnce = true;
                            userInput?.focus();
                        });
                        clearButton?.addEventListener('pointercancel', () => {
                            clearInterval(intervalID);
                            onlyOnce = true;
                            userInput?.focus();
                        });
                    } else {
                        clearButton?.addEventListener('click', (event: any) => {
                            let inputValue = (userInput as HTMLInputElement).value.toString();
                            (userInput as HTMLInputElement).value = inputValue.slice(0, -1);
                            userInput?.focus();
                            vibrateDevice(100);
                        });
                    }
                }
                else if (htmlElement == resultButton) {
                    //When result button clicked or pressed for longer time
                    let intervalID: any = undefined;
                    let shortOne: boolean = true;

                    if (window.PointerEvent) {

                        let previousResultText: any = '';

                        resultButton?.addEventListener('pointerdown', (event: any) => {
                            calculate();
                            let startTime = Date.now();

                            if (previousResultText == document.getElementById("result_text")?.innerText) {
                                (userInput as HTMLInputElement).value = previousResultText;
                            } else {
                                const repeatFn = () => {
                                    let resultTextText = document.getElementById("result_text")?.innerText;
                                    let userInputText = (userInput as HTMLInputElement).value.toString();

                                    let timeDifference = Date.now() - startTime;

                                    if (timeDifference > 1000 && resultTextText != userInputText && Number(resultTextText?.replaceAll('−', '-'))) {
                                        shortOne = false;
                                        (userInput as HTMLInputElement).value = resultTextText as string;
                                        vibrateDevice(200);
                                        clearInterval(intervalID);
                                    }
                                }
                                intervalID = window.setInterval(repeatFn, 300);
                            }
                        });
                        resultButton?.addEventListener('pointerup', (event: any) => {
                            if (shortOne) {
                                vibrateDevice(100);
                                clearInterval(intervalID);
                            }
                            previousResultText = document.getElementById("result_text")?.innerText;
                            shortOne = true;
                            userInput?.focus();
                        });
                        resultButton?.addEventListener('pointercancel', (event: any) => { clearInterval(intervalID); userInput?.focus(); });
                    }
                    else resultButton?.addEventListener('click', (event: any) => {
                        calculate();
                        vibrateDevice(100);
                    });
                } else {
                    //Other buttons including math operation buttons
                    let buttonSymbol = htmlElement.textContent;
                    htmlElement.addEventListener('click', (event: any) => {
                        if (mathOperations.includes(buttonSymbol)) {
                            vibrateDevice(100);
                        }
                        (resultText as HTMLParagraphElement).innerHTML = `&nbsp;`;
                        (userInput as HTMLInputElement).value += buttonSymbol;
                        userInput?.focus();
                    });
                };
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