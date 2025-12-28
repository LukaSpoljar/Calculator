
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SettingsIcon from '@mui/icons-material/Settings';
import Settings from './Settings Dialog/Settings';
import './App.scss';
import { CalcResult, calcResult, ERROR_TEXT } from './Result/CalcResult';

export default function App() {

    const userInputRef = useRef<HTMLInputElement>(null);
    const resultTextRef = useRef<HTMLParagraphElement>(null);

    const buttonsPadRef = useRef<HTMLDivElement>(null)
    const clearButtonRef = useRef<HTMLButtonElement>(null);

    const resultButtonRef = useRef<HTMLButtonElement>(null);
    const settingsButtonRef = useRef<any>(null);

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const vibrateDevice = (time: number) => 'vibrate' in window.navigator ? window.navigator.vibrate(time) : null;

    const mathOperationsSpecialSymbols = ['×', '+', '−', '÷'];
    const mathOperationsNormalSymbols = ['*', '+', '-', '/'];
    const mathOperations = [...mathOperationsNormalSymbols, ...mathOperationsSpecialSymbols];

    const shortVibationMs = 50;
    const longerVibrrationMs = 150;

    const ANSOrEqual = (lastChar: string): boolean => {
        return mathOperations.includes(lastChar) && typeof calcResult.previous === 'number' && calcResult.previous !== 0;
    }

    useEffect(() => {

        let userInput = userInputRef.current as HTMLInputElement;
        let resultText = resultTextRef.current as HTMLParagraphElement;

        let buttonsPad = buttonsPadRef.current as HTMLDivElement;
        let clearButton = clearButtonRef.current as HTMLButtonElement;
        let resultButton = resultButtonRef.current as HTMLButtonElement;

        let settingsButton = settingsButtonRef.current as any;

        if ((userInput && resultButton && clearButton && resultText && buttonsPad) instanceof HTMLElement) {

            userInput.addEventListener('keyup', (event: any) => {
                resultText.innerHTML = `&nbsp;`;
                resultButton.innerText = "=";

                userInput.value = userInput.value.toString().replaceAll('-', '−');

                const lastChar: string = userInput.value.toString().slice(-1).replaceAll('-', '−');
                resultButton.innerText = ANSOrEqual(lastChar) && calcResult.current !== ERROR_TEXT ? "ANS" : "=";

                if (event.key == 'Enter') {

                    if (lastChar) {
                        calcResult.setCurrent(userInput.value);
                    }

                    if (typeof calcResult.current === 'number') {
                        resultText.innerText = calcResult.current.toString().replaceAll('-', '−');
                        if (calcResult.previous === calcResult.current) {
                            userInput.value = resultText.innerText;

                        } else {
                            calcResult.setPrevEqCurrent();
                        }
                        resultButton.innerText = "=";

                    }
                    else if (typeof (calcResult.current) === 'string') {

                        if (typeof calcResult.previous === 'number' && calcResult.previous != 0 && calcResult.current !== ERROR_TEXT) {
                            userInput.value += calcResult.previous.toString().replaceAll('-', '−');
                            calcResult.setCurrent(userInput.value);
                            resultButton.innerText = "=";
                        } else {
                            resultText.innerText = calcResult.current as string;
                            calcResult.setErrorValues();
                        }
                    }
                }
            });

            //All numpad buttons -> symbols & digits
            document.querySelectorAll('#down-section-wrapper button').forEach((htmlElement: any, index: number) => {

                if (clearButton && htmlElement == clearButton) {

                    //Pointer on CLEAR BUTTON (when deleting)
                    if (window.PointerEvent) {
                        let intervalID: any = undefined;
                        let onlyOnceShort: boolean = true;

                        clearButton.addEventListener('pointerdown', (event: any) => {
                            resultText.innerHTML = `&nbsp;`;
                            let startTime = Date.now();

                            userInput.value = userInput.value.toString().slice(0, -1);

                            const repeatFn = () => {
                                let timeDifference = Date.now() - startTime;
                                let inputValue = userInput.value.toString();

                                if (timeDifference >= 2000) {
                                    userInput.value = inputValue.slice(0, -inputValue.length);
                                    onlyOnceShort = false;
                                    clearInterval(intervalID);
                                }
                                else if (timeDifference >= 1500) {
                                    userInput.value = inputValue.slice(0, -2);
                                    onlyOnceShort = false;
                                }
                                else { userInput.value = inputValue.slice(0, -1); }
                            }
                            intervalID = window.setInterval(repeatFn, (shortVibationMs + longerVibrrationMs));
                        });
                        clearButton.addEventListener('pointerup', () => {

                            const lastChar: string = userInput.value.toString().slice(-1);
                            resultButton.innerText = ANSOrEqual(lastChar) || (!lastChar && calcResult.current !== 0) ? "ANS" : "=";

                            clearInterval(intervalID);

                            onlyOnceShort ? vibrateDevice(shortVibationMs) : vibrateDevice(longerVibrrationMs);
                            onlyOnceShort = true;
                            userInput.focus();
                        });
                        clearButton.addEventListener('pointercancel', () => {
                            clearInterval(intervalID);
                            onlyOnceShort = true;
                            userInput.focus();
                        });
                    } else {
                        clearButton.addEventListener('click', (event: any) => {

                            const lastChar: string = userInput.value.toString().slice(-1);
                            resultButton.innerText = ANSOrEqual(lastChar) || (!lastChar && calcResult.current !== 0) ? "ANS" : "=";

                            userInput.focus();
                            vibrateDevice(shortVibationMs);
                        });
                    }
                }

                else if (resultButton && htmlElement == resultButton) {

                    resultButton?.addEventListener('click', (event: any) => {

                        const lastChar: string = userInput.value.toString().slice(-1);
                        if (ANSOrEqual(lastChar)) {
                            userInput.value += calcResult.previous.toString().replaceAll('-', '−');
                        }
                        if (lastChar) {
                            calcResult.setCurrent(userInput.value);
                        }
                        if (typeof calcResult.current === 'number') {
                            resultText.innerText = calcResult.current.toString().replaceAll('-', '−');
                            if (calcResult.previous === calcResult.current) {
                                userInput.value = resultText.innerText;
                            } else {
                                calcResult.setPrevEqCurrent();
                            }
                            resultButton.innerText = "=";
                        }
                        else if (typeof calcResult.current === 'string') {
                            if (typeof calcResult.previous === 'number' && calcResult.previous != 0 && calcResult.current !== ERROR_TEXT) {
                                userInput.value += calcResult.previous.toString().replaceAll('-', '−');
                                calcResult.setCurrent(userInput.value);
                                resultButton.innerText = "=";
                            } else {
                                resultText.innerText = calcResult.current;
                                calcResult.setErrorValues();
                            }
                        }

                        vibrateDevice(shortVibationMs);
                        userInput.focus();
                    });
                }
                else if (settingsButton && htmlElement == settingsButton) {

                    //THIS BLOCK IS UNNECCESSARY
                }
                else {

                    //Other buttons including math operation buttons except settings button
                    htmlElement.addEventListener('click', (event: any) => {

                        let buttonSymbol: string = event.target.textContent;

                        resultText.innerHTML = `&nbsp;`;
                        userInput.value += buttonSymbol;

                        if (ANSOrEqual(buttonSymbol)) {
                            vibrateDevice(shortVibationMs);
                            resultButton.innerText = "ANS";
                        } else {
                            resultButton.innerText = "=";
                        }

                        userInput?.focus();
                    });
                };
            });
        }
    }, []);

    return (
        <div id='app-wrapper'>
            <div id='up-section-wrapper'>
                <div>
                    <input id='user_input' placeholder='0' autoFocus type='text' inputMode='none' ref={userInputRef} />
                </div>
                <div>
                    <p id='result_text' ref={resultTextRef}>&nbsp;</p>
                </div>
            </div>
            <div id='down-section-wrapper' ref={buttonsPadRef}>
                <div id='side-operations'>
                    <Button variant='contained' size="large"><p>&times;</p></Button>
                    <Button variant='contained' size="large"><p>&divide;</p></Button>
                    <Button variant='contained' size="large"><p>&#43;</p></Button>
                    <Button variant='contained' size="large"><p>&minus;</p></Button>
                    <Button variant='contained' size="large" ref={settingsButtonRef} onClick={handleOpen}><p><SettingsIcon /></p></Button>
                </div>

                <div id='symbols-and-digits-wrapper'>

                    <div className='one-row'>
                        <Button variant='contained' size="large" id='clear_button' ref={clearButtonRef}>
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
                        <Button id='result_button' variant='contained' size="large" ref={resultButtonRef}>=</Button>
                    </div>
                </div>


                <Settings open={open} handleClose={handleClose} onSendMessage={(data: any) => {
                    let userInput = userInputRef.current as HTMLInputElement;
                    userInput.value += data;
                    userInput.focus();
                }} />
            </div>
        </div>
    )
}
