/**
* DOCU: This function is used to create a calculator instance. <br>
* It is a factory that encapsulates the calculator's internal state and <br>
* exposes the operations (appendNumber, chooseOperation, compute, clear, <br>
* remove, update) needed to drive the calculator. <br>
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
    * Last Updated Date: September 12, 2026 <br>
    * @type {object}
    * @property {string} current - the current operand being entered
    * @property {string} previous - the previous (stored) operand
    * @property {string|undefined} operation - the pending operation symbol
    * @author Cesar
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
    * DOCU: This function is used to append a digit or a decimal point to the current operand. <br>
    * It is called when the user presses a number key. Extra logic handles <br>
    * the decimal point so only one "." is allowed and "." is turned into "0.". <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function appendNumber
    * @param {string|number} number - the digit or decimal point to append
    * @author Cesar
    */
    const appendNumber = (number) => {
        if (number === '.' && state.current.includes('.')) return;
        // If the decimal point is the very first character typed (for example
        // right after clearing or selecting an operation), prepend a leading
        // zero so "." becomes "0." and ".8" becomes "0.8".
        if (number === '.' && state.current === '') {
            state.current = '0.';
        } else {
            state.current = state.current.toString() + number.toString();
        }
    };

    /**
    * DOCU: This function is used to select an arithmetic operation (+, -, *, /). <br>
    * It stores the current operand as the previous operand and sets the <br>
    * operation symbol. If a previous operand already exists, it computes <br>
    * the intermediate result first (chained calculations). <br>
    * Last Updated Date: September 12, 2026 <br>
    * @function chooseOperation
    * @param {string} operation - the operation symbol the user selected
    * @author Cesar
    */
    const chooseOperation = (operation) => {
        if (state.current === '') return;
        if (state.previous !== '') {
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
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
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
    };

    clear();

    return {
        appendNumber,
        chooseOperation,
        compute,
        clear,
        remove,
        update
    };
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
* the all-clear (AC) button, and the delete (DEL) button. It is used to <br>
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
    deleteButton
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
    toastElapsed = Math.min(TOAST_DURATION, toastElapsed + (now - toastStart));
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
powerSwitch.addEventListener('click', () => {
    if (calculatorOn) {
        turnOff();
    } else {
        turnOn();
    }
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
* DOCU: This handler is triggered when a number button is clicked. <br>
* It checks that the calculator is on, then appends the clicked digit <br>
* and refreshes the display. <br>
* Last Updated Date: September 12, 2026 <br>
* @function numberButtonHandler
* @param {object} button - the clicked number button
* @author Cesar
*/
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!requireOn()) return;
        calculator.appendNumber(button.innerText);
        calculator.update();
    });
});

/**
* DOCU: This handler is triggered when an operation button is clicked. <br>
* It checks that the calculator is on, then selects the operation and <br>
* refreshes the display. <br>
* Last Updated Date: September 12, 2026 <br>
* @function operationButtonHandler
* @param {object} button - the clicked operation button
* @author Cesar
*/
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!requireOn()) return;
        calculator.chooseOperation(button.innerText);
        calculator.update();
    });
});

/**
* DOCU: This handler is triggered when the equals (=) button is clicked. <br>
* It checks that the calculator is on, computes the result, and refreshes <br>
* the display. <br>
* Last Updated Date: September 12, 2026 <br>
* @function equalsButtonHandler
* @author Cesar
*/
equalsButton.addEventListener('click', () => {
    if (!requireOn()) return;
    calculator.compute();
    calculator.update();
});

/**
* DOCU: This handler is triggered when the all-clear (AC) button is clicked. <br>
* It checks that the calculator is on, resets everything, and refreshes <br>
* the display. <br>
* Last Updated Date: September 12, 2026 <br>
* @function allClearHandler
* @author Cesar
*/
allClear.addEventListener('click', () => {
    if (!requireOn()) return;
    calculator.clear();
    calculator.update();
});

/**
* DOCU: This handler is triggered when the delete (DEL) button is clicked. <br>
* It checks that the calculator is on, removes the last digit, and <br>
* refreshes the display. <br>
* Last Updated Date: September 12, 2026 <br>
* @function deleteButtonHandler
* @author Cesar
*/
deleteButton.addEventListener('click', () => {
    if (!requireOn()) return;
    calculator.remove();
    calculator.update();
});

/**
* DOCU: This call sets the default state of the calculator to OFF. <br>
* The calculator starts turned OFF, so the power switch is off and all <br>
* keys are disabled until the user turns it on. <br>
* Last Updated Date: September 12, 2026 <br>
* @function initializeCalculator
* @author Cesar
*/
turnOff();