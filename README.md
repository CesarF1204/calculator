# Simple Calculator

A physical-looking, mobile-first calculator built with **HTML, CSS (Bootstrap 5 + custom), and vanilla JavaScript**. It renders as a realistic handheld device: a dark beveled casing, a recessed LCD display, an **ON/OFF power switch** (the device starts turned off and every key is disabled until powered on), a live **battery indicator**, and a **3D flip** that reveals a branded metallic back — mirroring the behavior of a real pocket calculator.

## Features

- **ON/OFF toggle switch** — A physical-looking sliding switch in the top-left of the display. Toggle it to power the calculator on or off at any time.
- **Disabled state (OFF)** — When the calculator is off, every key is visually dimmed and non-functional, and the display is cleared.
- **Turn-off prompt (toast)** — If a user presses any key while the calculator is off, a small notification ("turned off" toast) appears with a warning icon and a countdown progress bar, prompting them to switch the device on.
- **Normal operations (ON)** — When powered on, the calculator supports full arithmetic:
  - Addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`)
  - Decimal numbers with smart handling (e.g. `.8` becomes `0.8`, only one `.` allowed per number)
  - Sign toggle (`±`) — flips a positive value to negative and vice versa (zero is left unchanged)
  - Chained calculations (e.g. `5 + 3 + 2` evaluates intermediate results)
  - `AC` (all clear) and `DEL` (backspace) — `DEL` deletes one character at a time, and once the current input is fully deleted it pulls the pending upper value down so deletion can continue
- **Battery indicator** — A battery icon with live percentage in the upper-right while the calculator is ON. It uses the real **Battery Status API** when the browser supports it and falls back to a slow simulated drain elsewhere (starts at 87%, loses 1% every 4s, pauses while the tab is hidden, and never displays below 1%). Below **20%** the icon turns amber; below **10%** it turns red with a pulse — each threshold warns once via the toast.
- **Readable output** — Results are formatted with thousands separators, long values shrink to fit in place (no horizontal scrolling), and pending intermediate values are shown in a smaller secondary display.
- **3D flip & branded back** — A button beneath the calculator flips the device 180° to reveal a metallic-silver back panel with an Apple-style logo and "MADE BY CES · YEAR 2026" fine print; a second button flips it back. Works in modern browsers, with dedicated WebKit/Safari 3D fixes.
- **Responsive & touch-friendly** — The casing, grid, and type scale fluidly across phone (including iPhone SE class), tablet, and desktop, with no horizontal overflow and iOS safe-area handling.
- **Full keyboard support with key repeat** — Every key can be driven from the physical keyboard, including **held-key auto-repeat** with a matching visual "pressed" animation on the on-screen button. Losing window focus releases any stuck keys safely.
- **Accessibility** — The power switch uses `role="switch"` with `aria-pressed`, the toast and battery use `aria-live="polite"`, flip buttons expose their state via `aria-pressed`/labels, and the UI respects `prefers-reduced-motion` (the flip turns instantly), keyboard focus, and hover-capable devices.

## How It Works

The calculator has two states, tracked by the `calculatorOn` flag in `js/script.js`:

### When OFF (default)
- The power-switch knob sits on the left on a slate-gray track and reads **OFF**.
- Every calculator key is given a `.disabled` class: dimmed, `cursor: not-allowed`, with no hover or press styling.
- The display is cleared (previous and current operands are empty) and the battery indicator is hidden.
- Pressing any key triggers `requireOn()`, which shows the **"Calculator is currently turned off. Kindly turn it on to use."** toast and blocks the action. The toast auto-hides after **3 seconds** (and its countdown pauses while the message is hovered).

### When ON
- The switch knob slides right on a green track and reads **ON**.
- All keys are enabled and interactive, and the battery indicator fades in.
- Pressing a digit appends it to the **current operand**; pressing an operator stores the current value as the **previous operand** and remembers the operation; pressing `=` runs the calculation and displays the result in the **current operand** display.
- The power switch remains active in both states, so the user can turn the device off (which also clears the display) or on at any time.

## Getting Started

This project has **no dependencies to install and no build step** — it is a static website. Bootstrap 5.3.3 and the Google Fonts load from public CDNs, so an internet connection is needed for the intended look.

### Quick start

1. Clone or download the project folder.
2. Open `index.html` in any modern web browser.

That's it. The calculator is fully client-side and requires no server.

## Usage

### Turning the calculator on / off

Click (or tap) the **power switch** in the top-left of the display. The switch shows its current state with the **ON** / **OFF** text label and a sliding knob:

- **OFF → ON:** knob slides right, track turns green, all keys become active, battery indicator appears.
- **ON → OFF:** knob slides left, track turns slate-gray, display clears, all keys become disabled, battery indicator hides.

If you try to use the calculator while it's off, a toast message will prompt you to turn it on first.

### Performing calculations

### Using the keyboard

The whole calculator can be driven from a physical keyboard. Holding a key repeats it (just like a real device), and the matching on-screen button shows a pressed animation. The keys map as follows:

| Key(s)                    | Calculator action                      |
| ------------------------- | -------------------------------------- |
| `0`–`9`                   | Enter a digit                          |
| `.`                       | Decimal point                          |
| `+`  `-`  `*`  `/`        | Select the operation                   |
| `Enter` or `=`            | Equals (`=`)                           |
| `Backspace` or `Delete`   | Delete last digit (`DEL`)              |
| `Escape`                  | All clear (`AC`)                       |
| `F9` or `n` / `N`         | Sign toggle (`±`)                      |

The same rules apply as with the mouse: any calculator key pressed while the device is **OFF** shows the "turned off" toast (via `requireOn()`).

### Flipping the calculator

Click **Flip to back** below the calculator to watch it rotate 180° and reveal the branded back panel; **Flip to front** brings the keypad back. Only the relevant button is shown at a time, mid-flip clicks are ignored, and the animation is skipped (instant swap) when `prefers-reduced-motion` is set.

## Project Structure

```
calculator/
├── index.html        # Markup: flip rig, casing front/back, display, power switch, battery, toast, buttons
├── images/
│   └── logo.png      # Favicon
├── css/
│   └── style.css     # Bootstrap-first styling + custom 3D casing, LCD, keys, flip, battery, toast
└── js/
    └── script.js     # Calculator logic, ON/OFF, battery, flip animation, toast, keyboard repeat, wiring
```

| File | Purpose |
| --- | --- |
| `index.html` | Defines the structure: the 3D flip rig (`.calculator-stage` / `.calculator-flip`), the keypad and display with power switch (`#power-switch`), battery indicator (`#battery-status`), toast (`#toast`), all number / operation / control buttons, the back face with the silver logo SVG, and the two flip buttons. Loads Bootstrap 5.3.3 and the Inter + Chakra Petch fonts from CDNs. |
| `css/style.css` | Bootstrap 5 handles layout, spacing, flex, borders, and shadows; custom CSS covers only what Bootstrap cannot — the beveled casing, recessed LCD, layered key gradients and travel, power-switch mechanics, battery icon states, toast countdown, the 3D flip (including a scoped WebKit/Safari `@supports` fix), and responsive/safe-area adjustments. |
| `js/script.js` | The `createCalculator()` factory (arithmetic, `toggleSign`, display formatting), power (ON/OFF) logic, battery indicator (real Battery Status API + simulated fallback with low/critical warnings), the 3D flip animation controller, the toast auto-dismiss countdown, keyboard handling with held-key repeat and blur safety, and the event wiring. |

## Technologies Used

- **HTML5** — semantic structure and accessibility attributes (`role`, `aria-pressed`, `aria-live`).
- **Bootstrap 5.3.3 (CDN)** — the default styling solution: page centering, spacing, flex utilities, typography, borders, radius, and shadows.
- **CSS3 (custom)** — the physical-casing layer: 3D transforms and keyframe flip animation, layered gradients and bevels, `clamp()` fluid sizing, media queries (`prefers-reduced-motion`, `hover`, small-device breakpoints), and a scoped `@supports (-webkit-touch-callout: none)` fix for Safari's 3D rendering.
- **JavaScript (ES / vanilla)** — the entire application logic; no frameworks.
- **Battery Status API** — real battery level/charging data via `navigator.getBattery()`, with a simulated drain fallback for unsupported browsers.
- **Inline SVG** — the metallic Apple-style back logo (gradient + mask) and the flip button icons.
- **Google Fonts** — [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) (device/UI typeface) and [Inter](https://fonts.google.com/specimen/Inter), loaded via CDN.

## Development

Because there is no package manager or build pipeline, development is a simple "edit and refresh" workflow:

1. Make changes to `index.html`, `css/style.css`, or `js/script.js`.
2. Refresh the page in your browser (or restart/refresh your local server) to see the change.

### Where to find key logic

- **Calculator state & arithmetic** — the `createCalculator()` factory near the top of `js/script.js` (functions: `appendNumber`, `chooseOperation`, `compute`, `clear`, `remove`, `toggleSign`, `update`, `getDisplay`).
- **Power (ON/OFF)** — `turnOn()`, `turnOff()`, and `requireOn()` in `js/script.js`; the switch's default state is set to **OFF** at the bottom of the file (`turnOff()`).
- **Battery indicator** — `renderBattery()`, `setBatteryState()`, `showBattery()`, `hideBattery()`, and `startBatterySimulation()` near the bottom of `js/script.js`; threshold constants (`BATTERY_LOW_THRESHOLD`, `BATTERY_CRITICAL_THRESHOLD`, `BATTERY_SIM_*`) sit just above them.
- **3D flip** — `toggleFlip()` and the `animationend` handling in `js/script.js`; the flip visuals (`.calculator-stage`, `.calculator-flip`, `.calculator-back`, keyframes) live in `css/style.css`.
- **Toast notification** — `showToast()`, `hideToast()`, and the `TOAST_DURATION`/progress functions in `js/script.js`; visual styling is in `css/style.css`.
- **Keyboard handling & repeat** — `handleKeypress()`, `handleKeyup()`, `keyToButton()`, `stopKeyRepeat()`, and `releaseAllButtons()` in `js/script.js`.
- **Disabled state & switch styling** — `.disabled`, `.power-switch`, and `.calc-toast` rules in `css/style.css`.

### Testing

There is currently **no automated test suite** in the project. To test manually:

- Verify the calculator starts **OFF** with all keys disabled and an empty display.
- Confirm every key shows the toast prompt while off, and that the toast auto-hides after ~3 seconds.
- Confirm turning **ON** enables all keys, shows the battery indicator, and that each operation (`+`, `-`, `*`, `/`), `=`, `AC`, `DEL`, `±`, and decimal entry work as expected.
- Watch the battery percentage drop over time (or match the real battery where the API is supported) and confirm the amber/red warnings and toasts fire at 20% / 10%.
- Use **Flip to back / Flip to front** and confirm the rotation, the back-face branding, and that only the relevant flip button is visible; test again with reduced motion enabled.
- Drive everything from the keyboard, including holding a digit or operator (auto-repeat + pressed animation), then switch windows mid-press to confirm no stuck state.
- Check responsiveness at phone, tablet, and desktop widths (including 360px-class devices) and confirm there is no horizontal overflow.

## Notes

- **Default state is OFF** — `turnOff()` is called on load so the calculator begins in the off state, intentionally requiring the user to power it on first.
- **No server required** — all logic runs in the browser; nothing is persisted between sessions.
- **Battery is partly simulated** — browsers without the Battery Status API (or with it unavailable) get a simulated drain (start 87%, −1% per 4s, paused while the tab is hidden, floored at 1%) so the demo still behaves like a real device.
- **Division edge cases** — division by zero currently follows JavaScript semantics and will display `Infinity` (e.g. `5 / 0`). There is no explicit zero-division guard.
- **Numeric precision** — arithmetic uses standard JavaScript floating-point numbers, so results are subject to normal floating-point precision (e.g. `0.1 + 0.2` may display a long decimal).
- **Fonts & Bootstrap load from CDN** — an internet connection is needed for Bootstrap 5 and the Chakra Petch / Inter fonts; the UI falls back to a generic font stack if the fonts cannot load.
- **Safari 3D fix** — WebKit (all Safari versions, iPhone included) needs legacy `-webkit-` 3D declarations and an extra GPU nudge to avoid z-fighting/blank back faces during the flip; this is scoped with `@supports` so other browsers are untouched.
- **Behavioral scope** — this is a four-function calculator with sign toggle; it does not include features such as percentages, square roots, or memory.
- **Keyboard input** — keyboard support is handled in `js/script.js` via the `handleKeypress()`/`handleKeyup()` handlers (see the "Using the keyboard" section).

