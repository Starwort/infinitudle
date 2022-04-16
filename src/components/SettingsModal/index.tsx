import {Modal} from "..";
import {AnimationSpeed, FontSize, KeyboardLayout} from "../../util";
import "./SettingsModal.css";

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    theme: "light" | "dark";
    setTheme: (theme: "light" | "dark") => void;
    keyboardLayout: KeyboardLayout;
    setKeyboardLayout: (keyboardLayout: KeyboardLayout) => void;
    fontSize: FontSize;
    setFontSize: (fontSize: FontSize) => void;
    animationSpeed: AnimationSpeed;
    setAnimationSpeed: (animationSpeed: AnimationSpeed) => void;
}

export function SettingsModal({
    open,
    onClose,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    keyboardLayout,
    setKeyboardLayout,
    animationSpeed,
    setAnimationSpeed,
}: SettingsModalProps) {
    return <Modal title="Settings" open={open} onClose={onClose} theme={theme}>
        <div className="settings-content">
            <label htmlFor="theme-select">Theme:</label>
            <select id="theme-select" value={theme} onChange={(event) => setTheme(event.target.value as "light" | "dark")}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
            <label htmlFor="keyboard-layout-select">Keyboard Layout:</label>
            <select id="keyboard-layout-select" value={keyboardLayout} onChange={(event) => setKeyboardLayout(event.target.value as KeyboardLayout)}>
                <option value="qwerty">Qwerty</option>
                <option value="dvorak">Dvorak</option>
                <option value="colemak">Colemak</option>
            </select>
            <label htmlFor="font-size-select">Font Size:</label>
            <select id="font-size-select" value={FontSize[fontSize]} onChange={(event) => setFontSize(
                FontSize[event.target.value as keyof typeof FontSize]
            )}>
                {Object.values(FontSize).map(
                    (fontSize) => typeof fontSize === "string" &&
                        <option key={fontSize} value={fontSize}>
                            {fontSize.replace("_", " ").replace(/([A-Z])([A-Z]*)/g, (match, p1, p2) => `${p1}${p2.toLowerCase()}`)}
                        </option>
                )}
            </select>
            <label htmlFor="animation-speed-select">Animation Speed:</label>
            <select id="animation-speed-select" value={AnimationSpeed[animationSpeed]} onChange={(event) => setAnimationSpeed(
                AnimationSpeed[event.target.value as keyof typeof AnimationSpeed]
            )}>
                {Object.values(AnimationSpeed).map(
                    (animationSpeed) => typeof animationSpeed === "string" &&
                        <option key={animationSpeed} value={animationSpeed}>
                            {animationSpeed.replace("_", " ").replace(/([A-Z])([A-Z]*)/g, (match, p1, p2) => `${p1}${p2.toLowerCase()}`)}
                        </option>
                )}
            </select>
        </div>
    </Modal>;
}