/**
* DOCU: This function is used to create a calculator instance. <br>
* It is a factory that encapsulates the calculator's internal state and <br>
* exposes the operations (appendNumber, chooseOperation, compute, clear, <br>
* remove, toggleSign, update) needed to drive the calculator. <br>
* Last Updated Date: September 12, 2026 <br>
* @function createCalculator
* @param {object} previousOperand - the DOM element that displays the previous operand
* @param {object} currentOperand - the DOM element that displays the current operand
* @author Cesar
*/
const createCalculator = (previousOperand, currentOperand) => {
    /**
    * DOCU: This object holds the internal state of the calculator. <br>
    * It stores the current operand, the previous operand, and the <br>
    * pending operation that is about to be performed. <br>
    */
    let state = {
        current: '',
        previous: '',
        operation: undefined
    };

    /**
    * DOCU: This function is used to reset the calculator to its empty state. <br>
    * It clears the current operand, the previous operand, and the <br>
    * pending operation. <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function clear
    * @author Cesar
    */
    const clear = () => {
        state.current = '';
        state.previous = '';
        state.operation = undefined;
    };

    /**
    * DOCU: This function is used to delete the last digit of the current operand. <br>
    * It is triggered when the user presses the delete (DEL) key. It also <br>
    * clears any pending operation that may have been selected. <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function remove
    * @author Cesar
    */
    const remove = () => {
        state.current = state.current.toString().slice(0, -1);
        state.operation = undefined;
    };

    /**
    * DOCU: This function is used to toggle the sign of the current operand. <br>
    * It flips a positive value to negative and a negative value to positive <br>
    * (e.g. "5" becomes "-5" and "-5" becomes "5"). Empty input and zero <br>
    * (including "0", "0.0", etc.) are left unchanged. <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function toggleSign
    * @author Cesar
    */
    const toggleSign = () => {
        const currentStr = state.current.toString();
        if (currentStr === '' || currentStr === '-') return;
        /* Zero has no signed form, so leave "0", "0.0", "-0", etc. untouched. */
        if (currentStr !== '' && !isNaN(parseFloat(currentStr)) && parseFloat(currentStr) === 0) return;
        if (currentStr.startsWith('-')) {
            state.current = currentStr.slice(1);
        } else {
            state.current = '-' + currentStr;
        }
    };

    /**
    * DOCU: This function is used to append a digit or a decimal point to the current operand. <br>
    * It is called when the user presses a number key. Extra logic handles <br>
    * the decimal point so only one "." is allowed and "." is turned into "0.". <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function appendNumber
    * @param {string|number} number - the digit or decimal point to append
    * @author Cesar
    */
    const appendNumber = (number) => {
        const currentStr = state.current.toString();
        if (number === '.' && currentStr.includes('.')) return;
        // If the decimal point is the very first character typed (for example
        // right after clearing or selecting an operation), prepend a leading
        // zero so "." becomes "0." and ".8" becomes "0.8".
        if (number === '.' && currentStr === '') {
            state.current = '0.';
        } else if (currentStr === '0' && number.toString() === '0') {
            // Prevent multiple leading zeros so "0" + "0" stays "0"
            // instead of building "00", "000000000", etc.
            return;
        } else if (currentStr === '0' && number.toString() !== '.' && number.toString() !== '0') {
            // Replace a lone leading zero with a non-zero digit
            // so "0" + "5" becomes "5" instead of "05".
            state.current = number.toString();
        } else {
            state.current = currentStr + number.toString();
        }
    };

    /**
    * DOCU: This function is used to select an arithmetic operation (+, -, *, /). <br>
    * It stores the current operand as the previous operand and sets the <br>
    * operation symbol. If a previous operand and a current operand both <br>
    * exist, it computes the intermediate result first (chained calculations). <br>
    * If an operation is already pending and no new operand has been entered, <br>
    * the previously selected operator is simply replaced without any <br>
    * calculation (e.g. pressing "*" after "3 +" turns it into "3 *"). <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function chooseOperation
    * @param {string} operation - the operation symbol the user selected
    * @author Cesar
    */
    const chooseOperation = (operation) => {
        // Nothing to attach an operator to (empty display), so ignore the press.
        if (state.current === '' && state.previous === '') return;

        // An operator is already pending and the user hasn't typed a new
        // operand yet — they are changing their mind about the operator, so
        // just swap the symbol without computing anything.
        if (state.current === '' && state.operation != null) {
            state.operation = operation;
            return;
        }

        // A previous operand and a new operand both exist, so chain the
        // calculation: compute the running result before applying the new
        // operator (e.g. "3 + 4 *" becomes "7 *").
        if (state.previous !== '' && state.current !== '') {
            compute();
        }

        state.operation = operation;
        state.previous = state.current;
        state.current = '';
    };

    /**
    * DOCU: This function is used to perform the arithmetic calculation. <br>
    * It computes the result between the previous operand and the current <br>
    * operand using the selected operation. The result becomes the new <br>
    * current operand and the operation/store are cleared. <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function compute
    * @author Cesar
    */
    const compute = () => {
        const prev = parseFloat(state.previous);
        const cur = parseFloat(state.current);
        if (isNaN(prev) || isNaN(cur)) return;

        let computation;
        if (state.operation === '+') {
            computation = prev + cur;
        } else if (state.operation === '*') {
            computation = prev * cur;
        } else if (state.operation === '/') {
            computation = prev / cur;
        } else if (state.operation === '-') {
            computation = prev - cur;
        } else {
            return;
        }

        state.current = computation;
        state.operation = undefined;
        state.previous = '';
    };

    /**
    * DOCU: This function is used to format a number for display. <br>
    * It adds thousands separators to the integer part while keeping the <br>
    * decimal part intact, so the value on screen stays readable. <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function getDisplay
    * @param {number|string} number - the raw value to be formatted
    * @returns {string} the formatted string to show in the display
    * @author Cesar
    */
    const getDisplay = (number) => {
        const stringNumber = number.toString();
        if (stringNumber === '') return '';
        /* Values in exponential notation (e.g. "1e+21" from a huge computed
           result) have no plain integer part to group, so show them as-is
           instead of mangling them through a Number conversion. */
        if (/e/i.test(stringNumber)) return stringNumber;
        const [rawInteger = '', ...rest] = stringNumber.split('.');
        const decimalDigits = rest.length > 0 ? rest.join('.') : undefined;
        /* Pull off a leading minus sign so grouping only sees plain digits. */
        let sign = '';
        let integerPart = rawInteger;
        if (integerPart.startsWith('-')) {
            sign = '-';
            integerPart = integerPart.slice(1);
        }
        /* Group the integer digits with commas using pure string logic.
           The old code ran parseFloat + toLocaleString, which converts to a
           JS Number (only ~15-16 exact digits), so typing more than ~16
           repeating digits rounded the tail into zeros (e.g. 25 ones showed
           "...0000000"). Grouping the raw string keeps every typed digit. */
        const integerDisplay = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        if (decimalDigits != null) {
            return `${sign}${integerDisplay}.${decimalDigits}`;
        } else {
            return `${sign}${integerDisplay}`;
        }
    };

    /**
    * DOCU: This function is used to refresh the calculator's display. <br>
    * It writes the formatted current operand into the current display and, <br>
    * when an operation is pending, shows the previous operand plus the <br>
    * operation symbol in the smaller display. <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function update
    * @author Cesar
    */
    const update = () => {
        currentOperand.innerText = getDisplay(state.current);
        if (state.operation != null) {
            previousOperand.innerText = `${getDisplay(state.previous)} ${state.operation}`;
        } else {
            previousOperand.innerText = '';
        }
        /* Keep every value on a single line by scaling down the font so the
           whole number stays inside the fixed display. */
        fitOperandToDisplay(currentOperand);
        fitOperandToDisplay(previousOperand);
    };

    clear();

    return {
        appendNumber,
        chooseOperation,
        compute,
        clear,
        remove,
        toggleSign,
        update
    };
};
/**
 * DOCU: Shrinks an operand's font size so the full value always stays on one
 * line inside the fixed display. The element fills the output panel and is
 * single-line (nowrap) with hidden overflow, so its own clientWidth is the
 * available space and its scrollWidth reflects how wide the text is at the
 * current font. The font is reduced proportionally until scrollWidth stops
 * exceeding clientWidth — so long numbers scale down smoothly instead of
 * overflowing, wrapping, or pushing the layout around. Short numbers keep the
 * normal full size. <br>
 * Last Updated Date: September 12, 2026 <br>
 * @function fitOperandToDisplay
 * @param {object} element - the operand element to fit (current or previous)
 * @author Cesar
 */
const fitOperandToDisplay = (element) => {
    const text = element.textContent;

    /* The available width: the element fills the output panel, so its own
       clientWidth is the fixed space it can use. */
    const available = element.clientWidth;

    /* Measure against the true base size: drop the font transition so the
       computed (non-animated) value is sampled, then reset to the responsive
       CSS clamp (max) size before measuring. */
    document.body.classList.add('no-transition');
    element.style.fontSize = '';              /* reset to the CSS clamp (max) */
    const baseSize = parseFloat(getComputedStyle(element).fontSize);
    element.style.fontSize = `${baseSize}px`;

    /* Empty display (or no width yet) → use the normal full-size font. */
    if (available <= 0 || text === '') {
        element.style.fontSize = '';
        document.body.classList.remove('no-transition');
        return;
    }

    const minSize = 0.5;
    let size = baseSize;
    let guard = 0;

    /* Text width scales almost proportionally with font size, so each ratio
       step converges quickly; the loop guards against edge cases. */
    while (element.scrollWidth > available + 0.5 && size > minSize && guard < 60) {
        size = Math.max(minSize, size * (available / element.scrollWidth) * 0.999);
        element.style.fontSize = `${size}px`;
        guard++;
    }

    element.style.fontSize = `${size}px`;
    document.body.classList.remove('no-transition');
};

/**
* DOCU: These are the DOM element references used to wire up the calculator. <br>
* They gather the number/operation buttons and the display/output panels <br>
* so the calculator logic can read input and write the results. <br>
* Last Updated Date: September 12, 2026 <br>
* @type {NodeList|Element}
* @author Cesar
*/
const numberButtons = document.querySelectorAll('#number');
const operationButtons = document.querySelectorAll('#operation');
const previousOperand = document.querySelector('#previous-operand');
const currentOperand = document.querySelector('#current-operand');
const allClear = document.querySelector('#all-clear');
const deleteButton = document.querySelector('#delete');
const toggleSignButton = document.querySelector('#toggle-sign');
const equalsButton = document.querySelector('#equals');

/**
* DOCU: These are the references to the power switch, its label, and the <br>
* toast message element used to show feedback while the device is OFF. <br>
* Last Updated Date: September 12, 2026 <br>
* @type {Element}
* @author Cesar
*/
const powerSwitch = document.querySelector('#power-switch');
const powerSwitchLabel = document.querySelector('#power-switch-label');
const toast = document.querySelector('#toast');
const toastMessage = document.querySelector('#toast-message');
const toastProgress = document.querySelector('.toast-progress');

/**
* DOCU: This creates a single instance of the calculator, wiring it to the <br>
* previous and current operand display panels. This instance is shared by <br>
* all of the event handlers below. <br>
* Last Updated Date: September 12, 2026 <br>
* @type {object}
* @author Cesar
*/
const calculator = createCalculator(previousOperand, currentOperand);

/* ------------------------------------------------------------------
   Power (ON/OFF) behaviour
   ------------------------------------------------------------------ */
/**
* DOCU: These variables track the ON/OFF state of the calculator. <br>
* calculatorOn indicates whether the device is currently turned on. <br>
* Last Updated Date: September 12, 2026 <br>
* @type {boolean}
* @author Cesar
*/
let calculatorOn = false;

/**
 * DOCU: These variables drive the toast (auto-dismiss notification) countdown.
 * The toast lasts for TOAST_DURATION ms unless the user dismisses it or pauses
 * it. Progress is driven per-frame so it stops while the toast is hovered or
 * focused, giving people enough time to read the message. <br>
 * Last Updated Date: September 12, 2026 <br>
 * @type {number|boolean}
 * @author Cesar
 */
const TOAST_DURATION = 3000;

let toastRAF = null;     /* requestAnimationFrame id driving the progress bar      */
let toastStart = 0;      /* timestamp (ms) when the current visible span began    */
let toastElapsed = 0;    /* ms already elapsed on the toast's lifetime            */
let toastPaused = false; /* true while the toast is hovered/focused               */

/**
* DOCU: This is a combined list of all interactive calculator keys. <br>
* It includes the number buttons, operation buttons, the equals button, <br>
* the all-clear (AC) button, the delete (DEL) button, and the sign toggle <br>
* (+/-) button. It is used to <br>
* enable/disable every key when the device is turned on/off. <br>
* Last Updated Date: September 12, 2026 <br>
* @type {Element[]}
* @author Cesar
*/
const keyButtons = [
    ...numberButtons,
    ...operationButtons,
    equalsButton,
    allClear,
    deleteButton,
    toggleSignButton
];

/**
* DOCU: This function keeps the countdown progress bar in sync with the time
* left on the toast. It computes how many milliseconds remain and writes that
* as a width percentage on the progress bar. <br>
* Last Updated Date: September 12, 2026 <br>
* @function updateToastProgress
* @returns {number} the remaining time in milliseconds
* @author Cesar
*/
const updateToastProgress = () => {
    const now = performance.now();
    /* Clamp the frame delta: rAF stops while the tab is suspended, so the
       first frame back would otherwise apply the whole suspension at once
       and the toast would vanish in a single frame. Clamping keeps the
       countdown resuming smoothly from where it visually was. */
    const delta = Math.min(now - toastStart, 250);
    toastElapsed = Math.min(TOAST_DURATION, toastElapsed + delta);
    toastStart = now;
    const remaining = Math.max(0, TOAST_DURATION - toastElapsed);
    toastProgress.style.width = `${(remaining / TOAST_DURATION) * 100}%`;
    return remaining;
};

/**
* DOCU: This function requests the next animation frame until there is no time
* left or the toast is paused. When the countdown reaches zero it hides the
* toast automatically. <br>
* Last Updated Date: September 12, 2026 <br>
* @function driveToastProgress
* @author Cesar
*/
const driveToastProgress = () => {
    const remaining = updateToastProgress();
    if (remaining > 0 && !toastPaused) {
        toastRAF = requestAnimationFrame(driveToastProgress);
    } else if (remaining === 0) {
        hideToast();
    }
};

/**
* DOCU: This function stops the per-frame loop and cancels the pending
* auto-hide timer. It is called before hiding or pausing the toast. <br>
* Last Updated Date: September 12, 2026 <br>
* @function stopToastProgress
* @author Cesar
*/
const stopToastProgress = () => {
    if (toastRAF) cancelAnimationFrame(toastRAF);
    toastRAF = null;
};

/**
* DOCU: This function hides the toast immediately. It stops the progress loop
* and removes the visible class, letting the CSS transition play the slide-down
* + fade-out animation. <br>
* Last Updated Date: September 12, 2026 <br>
* @function hideToast
* @author Cesar
*/
const hideToast = () => {
    stopToastProgress();
    toast.classList.remove('show');
};

/**
* DOCU: This function resets the countdown and displays a toast message, which
* will fade out on its own after TOAST_DURATION ms. <br>
* Last Updated Date: September 12, 2026 <br>
* @function showToast
* @param {string} message - the text to display in the toast
* @author Cesar
*/
const showToast = (message) => {
    stopToastProgress();            /* clear any in-progress countdown first */
    toastMessage.innerText = message;
    toastStart = performance.now();
    toastElapsed = 0;
    toastPaused = false;
    toastProgress.style.width = '100%';
    toast.classList.add('show');
    driveToastProgress();
};

/**
* DOCU: This function pauses the toast countdown. It is triggered when the
* pointer hovers over the toast, giving the user more time to read the
* message. <br>
* Last Updated Date: September 12, 2026 <br>
* @function pauseToast
* @author Cesar
*/
const pauseToast = () => {
    if (!toast.classList.contains('show') || toastPaused) return;
    updateToastProgress();
    toastPaused = true;
    stopToastProgress();
};

/**
* DOCU: This function resumes a paused toast countdown. It is triggered when
* the pointer leaves the toast. <br>
* Last Updated Date: September 12, 2026 <br>
* @function resumeToast
* @author Cesar
*/
const resumeToast = () => {
    if (!toast.classList.contains('show') || !toastPaused) return;
    toastPaused = false;
    toastStart = performance.now();
    driveToastProgress();
};

/* Pause/resume the auto-dismiss while the user reads the message. */
toast.addEventListener('mouseenter', pauseToast);
toast.addEventListener('mouseleave', resumeToast);

/**
* DOCU: This function is used to show the "turned off" toast message. <br>
* It is called when a key is pressed while the calculator is OFF. The <br>
* toast is shown and automatically hidden after a short delay. <br>
* Last Updated Date: September 12, 2026 <br>
* @function showTurnedOffMessage
* @author Cesar
*/
const showTurnedOffMessage = () => {
    showToast('Calculator is currently turned off.\nKindly turn it on to use.');
};

/**
* DOCU: This function is used to turn the calculator on. <br>
* It flips the internal state, updates the power switch appearance and <br>
* label, and enables all of the calculator keys. <br>
* Last Updated Date: September 12, 2026 <br>
* @function turnOn
* @author Cesar
*/
const turnOn = () => {
    calculatorOn = true;
    powerSwitch.classList.add('on');
    powerSwitch.setAttribute('aria-pressed', 'true');
    powerSwitchLabel.innerText = 'ON';
    keyButtons.forEach(button => button.classList.remove('disabled'));
    /* Turning on resolves the "turned off" notice, so dismiss it. */
    hideToast();
    /* Powered on: reveal the battery indicator in the upper-right. */
    showBattery();
};

/**
* DOCU: This function is used to turn the calculator off. <br>
* It flips the internal state, updates the power switch appearance and <br>
* label, disables all of the calculator keys, and clears the display. <br>
* Last Updated Date: September 12, 2026 <br>
* @function turnOff
* @author Cesar
*/
const turnOff = () => {
    calculatorOn = false;
    powerSwitch.classList.remove('on');
    powerSwitch.setAttribute('aria-pressed', 'false');
    powerSwitchLabel.innerText = 'OFF';
    keyButtons.forEach(button => button.classList.add('disabled'));
    /* Turning off also clears the display. */
    calculator.clear();
    calculator.update();
    /* Powered off: hide the battery indicator and stop its updates. */
    hideBattery();
};

/**
* DOCU: This event listener handles clicks on the power switch. <br>
* The switch itself stays active so the user can power the device anytime, <br>
* toggling between the off and on states. <br>
* Last Updated Date: September 12, 2026 <br>
* @function powerSwitchClickHandler
* @param {object} event - the click event
* @author Cesar
*/
/**
 * DOCU: This function toggles the calculator's power state. <br>
 * It flips the device between its ON and OFF states and is used by
 * the power-switch click handler. <br>
 * Last Updated Date: September 12, 2026 <br>
 * @function togglePower
 * @author Cesar
 */
const togglePower = () => {
    if (calculatorOn) {
        turnOff();
    } else {
        turnOn();
    }
};

powerSwitch.addEventListener('click', () => {
    togglePower();
    /* Release focus after clicking the switch. Otherwise it stays focused
       after you click to turn the calculator ON, so the very next keypress can
       make the browser treat it as keyboard-focused and expose its visible
       focus outline — exactly the unwanted "switch is focusing" effect. */
    powerSwitch.blur();
});

/**
* DOCU: This function is used as a guard for all calculator controls. <br>
* While OFF, no calculator control may perform any calculation; it shows <br>
* the "turned off" toast and blocks the action by returning false. <br>
* Last Updated Date: September 12, 2026 <br>
* @function requireOn
* @returns {boolean} true if the calculator is on, false otherwise
* @author Cesar
*/
const requireOn = () => {
    if (!calculatorOn) {
        showTurnedOffMessage();
        return false;
    }
    return true;
};

/**
* DOCU: This is the single action dispatch shared by BOTH mouse clicks and
* the physical keyboard. It checks that the calculator is on — showing the
* "turned off" toast when it is OFF — and then performs exactly the same
* action a mouse click on the button would perform. Keeping one dispatch
* guarantees keyboard and mouse behaviour are always identical. It returns
* true when the action ran and false when the calculator is OFF. <br>
* Last Updated Date: September 12, 2026 <br>
* @function performKeyAction
* @param {object} button - the calculator key button being pressed
* @returns {boolean} true when the action ran, false when the calculator is OFF
* @author Cesar
*/
const performKeyAction = (button) => {
    if (!requireOn()) return false;
    if (button === equalsButton) {
        calculator.compute();
    } else if (button === allClear) {
        calculator.clear();
    } else if (button === deleteButton) {
        calculator.remove();
    } else if (button === toggleSignButton) {
        calculator.toggleSign();
    } else if (/^[0-9.]$/.test(button.innerText)) {
        calculator.appendNumber(button.innerText);
    } else {
        calculator.chooseOperation(button.innerText);
    }
    calculator.update();
    return true;
};

/**
* DOCU: This single loop wires every calculator key (numbers, operations,
* equals, AC, DEL and +/-) to the shared action dispatch. It also takes the keys
* out of the Tab order and releases focus after use, so keyboard navigation
* can never leave a calculator button visibly focused or selected.
* Touch/mouse press animation is driven via Pointer Events so a finger tap
* shows the exact same brighten + label-scale feedback as a desktop click
* (:active alone is delayed/unreliable on mobile Safari/Chrome). <br>
* Last Updated Date: September 12, 2026 <br>
* @function calculatorKeyClickHandler
* @param {object} button - the clicked calculator key button
* @author Cesar
*/
keyButtons.forEach(button => {
    /* Pull keys out of the Tab order so Tab never navigates onto a key. */
    button.setAttribute('tabindex', '-1');

    /* Wrap the label in a <span> so the pressed animation can scale only the
       text and leave the button box (border/size) completely untouched. */
    if (!button.querySelector('.key-label')) {
        const label = document.createElement('span');
        label.className = 'key-label';
        label.textContent = button.textContent;
        button.textContent = '';
        button.appendChild(label);
    }

    /* Press animation for mouse + touch: pointerdown shows it instantly
       (no 300ms/mobile :active delay), pointerup/cancel/leave clears it.
       Disabled (OFF) keys never get the class — pressButton() guards that —
       so OFF keys stay dimmed with no animation on every device. */
    button.addEventListener('pointerdown', () => {
        pressButton(button);
    });
    button.addEventListener('pointerup', () => {
        releaseButton(button);
    });
    button.addEventListener('pointercancel', () => {
        releaseButton(button);
    });
    button.addEventListener('pointerleave', () => {
        releaseButton(button);
    });
    button.addEventListener('lostpointercapture', () => {
        releaseButton(button);
    });

    button.addEventListener('click', () => {
        performKeyAction(button);
        /* Don't let the key keep focus after it is activated. */
        button.blur();
    });
});


/* ------------------------------------------------------------------
   Keyboard input — physical keys drive the same actions as clicks.
   - A mapping from each physical key to its matching calculator button.
   - An "is-pressed" visual state that mirrors the button :active
     animation, so a keyboard press reacts exactly like a mouse press.
   ------------------------------------------------------------------ */

const numberButtonsList = Array.from(numberButtons);
const operationButtonsList = Array.from(operationButtons);
const numberButtonByKey = {};
numberButtonsList.forEach(button => { numberButtonByKey[button.innerText] = button; });
const operationButtonByKey = {};
operationButtonsList.forEach(button => { operationButtonByKey[button.innerText] = button; });

/* Resolve a physical key to its matching calculator button, if any
   (returns undefined for Tab, arrows, F-keys and other non-calculator keys). */
const keyToButton = (key) => {
    if (key === 'Escape') return allClear;
    if (key === 'Backspace' || key === 'Delete') return deleteButton;
    if (key === 'Enter' || key === '=') return equalsButton;
    if (key === 'F9' || key === 'n' || key === 'N') return toggleSignButton;
    if (/^[0-9.]$/.test(key)) return numberButtonByKey[key];
    return operationButtonByKey[key];
};

/* Visual "pressed" feedback, kept in sync with the :active style so the
   keyboard press looks identical to a mouse press. */
const pressedButtons = new Set();

const pressButton = (button) => {
    if (!button || button.classList.contains('disabled')) return;
    pressedButtons.add(button);
    button.classList.add('is-pressed');
};

const releaseButton = (button) => {
    if (!button || !pressedButtons.delete(button)) return;
    button.classList.remove('is-pressed');
};

/* Clear any stuck pressed state (e.g. a key released outside the window). */
const releaseAllButtons = () => {
    Array.from(pressedButtons).forEach(releaseButton);
};

/* ------------------------------------------------------------------
   Key-hold auto-repeat — keep a held key continuously processing.
   The very first keypress runs the action instantly, then after a short
   delay a controlled timer repeats the action until the key is released,
   just like pressing and holding a physical calculator button.
   ------------------------------------------------------------------ */

const KEY_REPEAT_DELAY = 500;    /* wait before repetition begins, ms     */
const KEY_REPEAT_INTERVAL = 90;  /* delay between each repeated action, ms */

let heldButton = null;       /* calculator button whose key is currently held */
let repeatDelayTimer = null; /* timeout id waiting before repeats begin      */
let repeatTimer = null;      /* interval id driving the held-key repeats     */

/* Stop any in-progress held-key repetition. */
const stopKeyRepeat = () => {
    if (repeatDelayTimer) {
        clearTimeout(repeatDelayTimer);
        repeatDelayTimer = null;
    }
    if (repeatTimer) {
        clearInterval(repeatTimer);
        repeatTimer = null;
    }
    heldButton = null;
};

/* Start repeating a held button. Only called after the first action has run,
   so the repeat timer never fires for a calculator that is OFF. */
const startKeyRepeat = (button) => {
    stopKeyRepeat();
    heldButton = button;
    repeatDelayTimer = setTimeout(() => {
        repeatDelayTimer = null;
        repeatTimer = setInterval(() => {
            /* Repeat only while the same button is still held. */
            if (heldButton) {
                performKeyAction(heldButton);
            } else {
                stopKeyRepeat();
            }
        }, KEY_REPEAT_INTERVAL);
    }, KEY_REPEAT_DELAY);
};

/* Restore the visual state and stop repetition when a held key is released. */
const onKeyRelease = (button) => {
    if (!button) return;
    if (button === heldButton) stopKeyRepeat();
    releaseButton(button);
};

/**
 * DOCU: This handler maps physical keyboard keys to calculator actions. <br>
 * It reuses the exact same action dispatch and requireOn() guard as the
 * buttons, so keyboard and mouse behave identically — including showing the
 * "turned off" toast when the calculator is OFF. Non-calculator and modifier
 * keys are left untouched, and Tab/arrow keys never select a calculator key.
 * Holding a calculator key keeps it visually pressed and continuously invokes
 * its action (auto-repeat) until the key is released; the browser's native
 * keydown repeats are ignored in favour of a controlled repeat timer, so a
 * held key can never cause duplicate or excessive input. <br>
 * Last Updated Date: September 12, 2026 <br>
 * @function handleKeypress
 * @param {object} event - the keydown event
 * @author Cesar
 */
const handleKeypress = (event) => {
    /* Ctrl/Alt/Meta may be reserved by the browser/system, so never let a
       modified combination drive a calculator key. */
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    const key = event.key;

    /* If one of our controls currently owns focus, let Enter/Space activate it
       natively instead of also firing a calculator action — this avoids a
       double trigger. The keys themselves are kept out of the Tab order. */
    const onCalculatorControl = event.target === powerSwitch || keyButtons.includes(event.target);
    if (onCalculatorControl && (key === 'Enter' || key === ' ')) return;

    const button = keyToButton(key);
    if (!button) return;          /* Tab, arrows, F-keys, etc. are left alone */

    event.preventDefault();

    /* The browser re-fires keydown while a key is held. Those repeats are
       ignored: the first press already ran the action and the repeat timer
       below drives continuous input, so duplicates never add unexpected
       calculations. */
    if (event.repeat || event.repeatCount > 0) return;

    /* First press of a (possibly new) key. If another key is still held, let
       the newest one take over so only one key is continuously processed. */
    if (heldButton && heldButton !== button) {
        releaseButton(heldButton);
    }
    pressButton(button);
    if (performKeyAction(button)) {
        /* The calculator is on: keep repeating while the key stays held. */
        startKeyRepeat(button);
    }
    /* When OFF, performKeyAction showed the "turned off" toast and returned
       false, so nothing is calculated and no repetition is started. */
};

/**
 * DOCU: This handler fires when a key is lifted. It cleanly stops any held-key
 * repetition for that button and restores its normal (unpressed) visual state,
 * so continuous input ends immediately on release. <br>
 * Last Updated Date: September 12, 2026 <br>
 * @function handleKeyup
 * @param {object} event - the keyup event
 * @author Cesar
 */
const handleKeyup = (event) => {
    if (event.repeat || event.repeatCount > 0) return;
    onKeyRelease(keyToButton(event.key));
};

/* Wire the physical keyboard to the calculator. */
window.addEventListener('keydown', handleKeypress);
window.addEventListener('keyup', handleKeyup);

/* If the window loses focus mid-press, stop any held-key repetition and
   clear any stuck pressed state so nothing keeps firing in the background. */
window.addEventListener('blur', () => {
    stopKeyRepeat();
    releaseAllButtons();
});

/* Re-fit the display on window resizes so the fixed layout stays consistent
   and long numbers keep fitting across different screen sizes. */
window.addEventListener('resize', () => calculator.update());

/* ------------------------------------------------------------------
   Battery status indicator — shown in the upper-right while ON.
   - Uses the real Battery Status API (navigator.getBattery) when the
     browser supports it, and updates live on level/charging changes.
   - Falls back to a slow simulated drain elsewhere so the percentage
     still updates dynamically during development/demo.
   - Low (<20%) turns the icon amber; critically low (<10%) turns it
     red with a pulse; each threshold warns once via the toast.
   ------------------------------------------------------------------ */

const batteryStatus = document.getElementById('battery-status');
const batteryLevel = document.getElementById('battery-level');
const batteryPercentage = document.getElementById('battery-percentage');

const BATTERY_LOW_THRESHOLD = 20;        /* percent                          */
const BATTERY_CRITICAL_THRESHOLD = 10;   /* percent                          */
const BATTERY_SIM_START = 87;            /* simulated starting level, %      */
const BATTERY_SIM_STEP = 1;              /* percent lost per simulated tick  */
const BATTERY_SIM_INTERVAL = 4000;       /* ms between simulated ticks       */

let batteryLevelValue = null;    /* 0-100, null until first reading */
let batteryCharging = false;
let batterySimTimer = null;      /* fallback drain timer            */
let warnedLow = false;           /* toast shown only once per event */
let warnedCritical = false;

/**
* DOCU: Applies the current battery level to the indicator: updates the <br>
* fill width, the percentage text, and the low/critical color states. <br>
* Last Updated Date: September 12, 2026 <br>
* @function renderBattery
* @author Cesar
*/
const renderBattery = () => {
    if (batteryLevelValue === null) return;
    const level = Math.max(0, Math.min(100, Math.round(batteryLevelValue)));

    batteryLevel.style.width = `${level}%`;
    batteryPercentage.innerText = `${level}%`;

    const isLow = level < BATTERY_LOW_THRESHOLD;
    const isCritical = level < BATTERY_CRITICAL_THRESHOLD;

    batteryStatus.classList.toggle('battery-low', isLow && !isCritical);
    batteryStatus.classList.toggle('battery-critical', isCritical);

    /* One-time toast warnings as the battery drops past each threshold. */
    if (isCritical && !warnedCritical) {
        warnedCritical = true;
        showToast('Battery critically low!\nPlease charge your device.');
    } else if (isLow && !warnedLow) {
        warnedLow = true;
        showToast('Battery low.\nPlease charge your device soon.');
    }
    /* Charging resets the warnings so they can fire again if it drops. */
    if (batteryCharging) {
        warnedLow = false;
        warnedCritical = false;
    }
};

/**
* DOCU: Sets the battery state from a 0-1 fraction (as reported by the <br>
* Battery Status API) and re-renders the indicator. <br>
* Last Updated Date: September 12, 2026 <br>
* @function setBatteryState
* @param {number} levelFraction - battery level as a 0-1 fraction
* @param {boolean} charging - whether the battery is currently charging
* @author Cesar
*/
const setBatteryState = (levelFraction, charging) => {
    batteryLevelValue = levelFraction * 100;
    batteryCharging = Boolean(charging);
    renderBattery();
};

/**
* DOCU: Reveals the battery indicator and starts keeping it up to date. <br>
* Prefers the real Battery Status API; otherwise starts the simulated <br>
* drain timer so the percentage visibly changes over time. <br>
* Last Updated Date: September 12, 2026 <br>
* @function showBattery
* @author Cesar
*/
const showBattery = () => {
    batteryStatus.hidden = false;
    batteryStatus.classList.add('show');
    if (batterySimTimer) {
        /* Re-showing: sync from wherever the simulation is. */
        renderBattery();
        return;
    }
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            const sync = () => setBatteryState(battery.level, battery.charging);
            sync();
            battery.addEventListener('levelchange', sync);
            battery.addEventListener('chargingchange', sync);
        }).catch(() => startBatterySimulation());
    } else {
        startBatterySimulation();
    }
};

/**
* DOCU: Starts the fallback simulated drain: begins at a healthy level and <br>
* loses BATTERY_SIM_STEP percent every BATTERY_SIM_INTERVAL ms, pausing <br>
* while the page is hidden so the drain never jumps after returning. <br>
* Last Updated Date: September 12, 2026 <br>
* @function startBatterySimulation
* @author Cesar
*/
const startBatterySimulation = () => {
    if (batterySimTimer) return;
    if (batteryLevelValue === null) batteryLevelValue = BATTERY_SIM_START;
    renderBattery();
    batterySimTimer = setInterval(() => {
        if (document.hidden) return;
        if (!batteryCharging && batteryLevelValue > 0) {
            batteryLevelValue = Math.max(0, batteryLevelValue - BATTERY_SIM_STEP);
            renderBattery();
        }
    }, BATTERY_SIM_INTERVAL);
};

/**
* DOCU: Hides the battery indicator (when the calculator powers off). The <br>
* simulation timer keeps running so the level continues to drain like a <br>
* real device, and re-powering simply reveals it again. <br>
* Last Updated Date: September 12, 2026 <br>
* @function hideBattery
* @author Cesar
*/
const hideBattery = () => {
    batteryStatus.classList.remove('show');
};

/**
 * DOCU: This call sets the default state of the calculator to OFF. <br>
 * The calculator starts turned OFF, so the power switch is off and all <br>
 * keys are disabled until the user turns it on. <br>
 * Last Updated Date: September 12, 2026 <br>
 * @function initializeCalculator
 * @author Cesar
 */
turnOff();