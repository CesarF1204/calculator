# Simple Calculator

A clean, mobile-first calculator built with plain **HTML, CSS, and JavaScript**. It ships with a built-in **ON/OFF power switch**: the device starts turned off, and every key is disabled until the user powers it on — mirroring the behavior of a real handheld calculator.

## Features

- **ON/OFF toggle switch** — A physical-looking sliding switch in the top-left of the display. Toggle it to power the calculator on or off at any time.
- **Disabled state (OFF)** — When the calculator is off, every key is visually dimmed and non-functional, and the display is cleared.
- **Turn-off prompt (toast)** — If a user presses any key while the calculator is off, a small notification ("turned off" toast) appears with a warning icon and a countdown progress bar, prompting them to switch the device on.
- **Normal operations (ON)** — When powered on, the calculator supports full arithmetic:
  - Addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`)
  - Decimal numbers with smart handling (e.g. `.8` becomes `0.8`, only one `.` allowed per number)
  - Chained calculations (e.g. `5 + 3 + 2` evaluates intermediate results)
  - `AC` (all clear) and `DEL` (backspace / delete last digit)
- **Readable output** — Results are formatted with thousands separators, long values wrap in place (no horizontal scrolling), and pending intermediate values are shown in a smaller secondary display.
- **Responsive & touch-friendly** — The grid and type scale fluidly across phone, tablet, and desktop.
- **Full keyboard support** — Every key can be driven from the physical keyboard: digits, operators, `Enter`/`=` for equals, `Backspace` for delete, and `Escape` for all-clear.
- **Accessibility** — The power switch uses `role="switch"` with `aria-pressed`, the toast uses `aria-live="polite"`, and the UI respects `prefers-reduced-motion`, keyboard focus, and hover-capable devices.

## How It Works

The calculator has two states, tracked by the `calculatorOn` flag in `js/script.js`:

### When OFF (default)
- The power-switch knob sits on the left on a slate-gray track and reads **OFF**.
- Every calculator key is given a `.disabled` class: dimmed, `cursor: not-allowed`, with no hover or press styling.
- The display is cleared (previous and current operands are empty).
- Pressing any key triggers `requireOn()`, which shows the **"Calculator is currently turned off. Kindly turn it on to use."** toast and blocks the action. The toast auto-hides after **3 seconds** (and its countdown pauses while the message is hovered).

### When ON
- The switch knob slides right on a green track and reads **ON**.
- All keys are enabled and interactive.
- Pressing a digit appends it to the **current operand**; pressing an operator stores the current value as the **previous operand** and remembers the operation; pressing `=` runs the calculation and displays the result in the **current operand** display.
- The power switch remains active in both states, so the user can turn the device off (which also clears the display) or on at any time.

## Getting Started

This project has **no dependencies and no build step** — it is a static website, so there is nothing to install.

### Quick start

1. Clone or download the project folder.
2. Open `index.html` in any modern web browser.

That's it. The calculator is fully client-side and requires no server.

## Usage

### Turning the calculator on / off

Click (or tap) the **power switch** in the top-left of the display. The switch shows its current state with the **ON** / **OFF** text label and a sliding knob:

- **OFF → ON:** knob slides right, track turns green, all keys become active.
- **ON → OFF:** knob slides left, track turns slate-gray, display clears, all keys become disabled.

If you try to use the calculator while it's off, a toast message will prompt you to turn it on first.

### Performing calculations

1. Turn the calculator **ON**.
2. Enter the first number using the number keys (`0–9` and `.`).
3. Pick an operation (`/`, `*`, `+`, `-`). The entered number and operator appear in the small secondary display.
4. Enter the second number.
5. Press `=` to see the result in the main display.

You can chain multiple operations (e.g. `12 + 7 + 5`) for intermediate results, use `DEL` to remove the last digit, and use `AC` to start over.

### Using the keyboard

The whole calculator can be driven from a physical keyboard. The keys map as follows:

| Key(s)                    | Calculator action                      |
| ------------------------- | -------------------------------------- |
| `0`–`9`                   | Enter a digit                          |
| `.`                       | Decimal point                          |
| `+`  `-`  `*`  `/`        | Select the operation                   |
| `Enter` or `=`            | Equals (`=`)                           |
| `Backspace`               | Delete last digit (`DEL`)              |
| `Escape`                  | All clear (`AC`)                       |

The same rules apply as with the mouse: any calculator key pressed while the device is **OFF** shows the "turned off" toast (via `requireOn()`).

## Project Structure

```
calculator/
├── index.html        # Markup: calculator grid, display, power switch, toast, buttons
├── css/
│   └── style.css     # All styling: layout grid, power switch, disabled state, toast
└── js/
    └── script.js     # Calculator logic, ON/OFF behavior, toast countdown, event wiring
```

| File | Purpose |
| --- | --- |
| `index.html` | Defines the structure of the calculator, including the power switch (`#power-switch`), the previous/current operand displays, the toast (`#toast`), and all number / operation / control buttons. |
| `css/style.css` | Responsive CSS Grid layout and all visual styling — the ON/OFF switch, the disabled (OFF) key state, and the toast notification card and its progress bar. |
| `js/script.js` | `createCalculator()` factory that encapsulates state and arithmetic, plus the power (ON/OFF) logic, the toast auto-dismiss countdown, and the event handlers that wire the buttons to the calculator. |
## Technologies Used

- **HTML5** — semantic structure and accessibility attributes (`role`, `aria-pressed`, `aria-live`).
- **CSS3** — modern layout with **CSS Grid**, custom properties, `clamp()` fluid type, media queries (`prefers-reduced-motion`, `hover`), and transitions.
- **JavaScript (ES / vanilla)** — the entire application logic; no frameworks.
- **Google Fonts** — the [Inter](https://fonts.google.com/specimen/Inter) typeface, loaded via CDN.

## Development

Because there is no package manager or build pipeline, development is a simple "edit and refresh" workflow:

1. Make changes to `index.html`, `css/style.css`, or `js/script.js`.
2. Refresh the page in your browser (or restart/refresh your local server) to see the change.

### Where to find key logic

- **Calculator state & arithmetic** — the `createCalculator()` factory near the top of `js/script.js` (functions: `appendNumber`, `chooseOperation`, `compute`, `clear`, `remove`, `update`, `getDisplay`).
- **Power (ON/OFF)** — `turnOn()`, `turnOff()`, and `requireOn()` in `js/script.js`; the switch's default state is set to **OFF** at the bottom of the file.
- **Toast notification** — `showToast()`, `hideToast()`, and the `TOAST_DURATION`/progress functions in `js/script.js`; visual styling is in `css/style.css`.
- **Disabled state & switch styling** — `.disabled`, `.power-switch`, and `.toast` rules in `css/style.css`.

### Testing

There is currently **no automated test suite** in the project. To test manually:

- Verify the calculator starts **OFF** with all keys disabled and an empty display.
- Confirm every key shows the toast prompt while off, and that the toast auto-hides after ~3 seconds.
- Confirm turning **ON** enables all keys and that each operation (`+`, `-`, `*`, `/`), `=`, `AC`, `DEL`, and decimal entry work as expected.
- Check responsiveness at phone, tablet, and desktop widths and confirm there is no horizontal overflow.

## Notes

- **Default state is OFF** — `turnOff()` is called on load so the calculator begins in the off state, intentionally requiring the user to power it on first.
- **No server required** — all logic runs in the browser; nothing is persisted between sessions.
- **Division edge cases** — division by zero currently follows JavaScript semantics and will display `Infinity` (e.g. `5 / 0`). There is no explicit zero-division guard.
- **Numeric precision** — arithmetic uses standard JavaScript floating-point numbers, so results are subject to normal floating-point precision (e.g. `0.1 + 0.2` may display a long decimal).
- **Fonts load from CDN** — an internet connection is needed for the Inter font; the UI falls back to a generic sans-serif stack if the font cannot load.
- **Behavioral scope** — this is a basic four-function calculator; it does not include features such as percentages, square roots, or memory.
- **Keyboard input** — keyboard support is handled in `js/script.js` via the `handleKeypress()` handler (see the "Using the keyboard" section).