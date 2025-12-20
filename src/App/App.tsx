import { evaluate, re } from 'mathjs';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SettingsIcon from '@mui/icons-material/Settings';
import Settings from './Settings Dialog/Settings';
import './App.scss';

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
    const mathOperations = ['×', '+', '−', '÷'];

    const shortVibationMs = 50;
    const longerVibrrationMs = 150;


    let calcResult: { current: number, previous: number } = { current: NaN, previous: NaN };

    useEffect(() => {

        let userInput = userInputRef.current as HTMLInputElement;
        let resultText = resultTextRef.current as HTMLParagraphElement;

        let buttonsPad = buttonsPadRef.current as HTMLDivElement;
        let clearButton = clearButtonRef.current as HTMLButtonElement;
        let resultButton = resultButtonRef.current as HTMLButtonElement;

        let settingsButton = settingsButtonRef.current as any;

        const calculate = (mathExpression: string): number => {
            if (userInput && resultText) {
                mathExpression = mathExpression.replaceAll('÷', '/').replaceAll('×', '*').replaceAll('−', '-');
                try {
                    let result = evaluate(mathExpression);
                    if (result == Number(result) || result == 0) {

                        let positiveOrNegativeSymbol = result < 0 ? '-' : '';
                        result = Math.abs(result);

                        return Number(positiveOrNegativeSymbol + parseFloat(result.toFixed(4)).toString());
                    } else {
                        return NaN;
                    };
                } catch (error: any) {
                    return NaN;
                }
            } else {
                return NaN;
            }
        }

        if ((userInput && resultButton && clearButton && resultText && buttonsPad) instanceof HTMLElement) {

            userInput.addEventListener('keydown', (event: any) => {
                resultText.innerHTML = `&nbsp;`;
                if (event.key == 'Enter') { resultText.innerText = calculate(userInput.value).toString() }
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
                            const lastChar: string = userInput.value.toString().slice(-1)
                            resultButton.innerText = mathOperations.includes(lastChar) && Number(calcResult.current) ? "ANS" : "=";

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
                            userInput.value = userInput.value.toString().slice(0, -1);
                            resultButton.innerText = mathOperations.includes(lastChar) && Number(calcResult.current) ? "ANS" : "=";
                            userInput.focus();
                            vibrateDevice(shortVibationMs);
                        });
                    }
                }
                else if (resultButton && htmlElement == resultButton) {

                    //When result button clicked or pressed for longer time
                    let intervalID: any = undefined;
                    let shortOne: boolean = true;

                    if (window.PointerEvent) {

                        resultButton.addEventListener('pointerdown', (event: any) => {

                            calcResult.current = calculate(userInput.value);
                            let startTime = Date.now();

                            if (calcResult.current.toString() == resultText.innerText.replaceAll('−', '-')) { userInput.value = calcResult.current.toString(); }
                            else {
                                const repeatFn = () => {
                                    let tmpResultText: string = resultText.innerText.toString();
                                    let tmpUserInputText: string = userInput.value.toString();

                                    let timeDifference = Date.now() - startTime;

                                    if (timeDifference > ((shortVibationMs + longerVibrrationMs) * 4) && tmpResultText != tmpUserInputText) {
                                        shortOne = false;

                                        if (Number(tmpResultText?.replaceAll('−', '-')) && resultButton.innerText == "=") {
                                            userInput.value = tmpResultText;
                                        } else if (Number(calcResult.current) && resultButton.innerText == "ANS") {
                                            userInput.value += calcResult.current?.toString().replaceAll('-', '−');
                                            calcResult.current = calculate(userInput.value) as number;
                                        }

                                        vibrateDevice(longerVibrrationMs);
                                        clearInterval(intervalID);
                                    }
                                }
                                intervalID = window.setInterval(repeatFn, shortVibationMs + longerVibrrationMs);
                            }
                        });
                        resultButton?.addEventListener('pointerup', (event: any) => {

                            if (shortOne) {
                                vibrateDevice(shortVibationMs);
                                clearInterval(intervalID);
                            }

                            if (resultButton.innerText == "ANS") {
                                userInput.value += calcResult.previous?.toString().replaceAll('-', '−');
                            } else {
                                calcResult.previous = calcResult.current;
                            }
                            resultText.innerText = calculate(userInput.value).toString().replaceAll('-', '−');
                            resultButton.innerText = "=";


                            shortOne = true;
                            userInput.focus();
                        });
                        resultButton.addEventListener('pointercancel', (event: any) => { clearInterval(intervalID); userInput.focus(); });
                    }
                    else resultButton?.addEventListener('click', (event: any) => {

                        calcResult.current = calculate(userInput.value);

                        if (resultButton.innerText == "ANS") {
                            userInput.value += calcResult.previous.toString().replaceAll('-', '−');
                        } else {
                            calcResult.previous = calcResult.current;
                        }
                        resultText.innerText = calculate(userInput.value).toString().replaceAll('-', '−');
                        resultButton.innerText = "=";


                        vibrateDevice(100);
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

                        if (mathOperations.includes(buttonSymbol) && Number(calcResult.current)) {
                            vibrateDevice(shortVibationMs);
                            resultButton.innerText = "ANS";
                        } else {
                            resultButton.innerText = "=";
                        }

                        resultText.innerHTML = `&nbsp;`;
                        userInput.value += buttonSymbol;
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
                    <Button variant='contained' size="large">&times;</Button>
                    <Button variant='contained' size="large">&divide;</Button>
                    <Button variant='contained' size="large">&#43;</Button>
                    <Button variant='contained' size="large">&minus;</Button>

                    <Button variant='contained' size="large" ref={settingsButtonRef} onClick={handleOpen}><SettingsIcon /></Button>

                    <Settings open={open} handleClose={handleClose} onSendMessage={(data: any) => {
                        let userInput = userInputRef.current as HTMLInputElement;
                        userInput.value += data;
                        userInput.focus();
                    }} />
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
            </div>
        </div>
    )
}
