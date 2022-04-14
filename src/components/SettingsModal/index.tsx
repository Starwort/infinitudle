import {Modal} from "..";
import {FontSize, KeyboardLayout} from "../../util";
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
        </div>
    </Modal>;
}