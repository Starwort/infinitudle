import {Modal} from "..";
import {AnimationSpeed, FontSize, KeyboardLayout, members, Theme, toTitleCase} from "../../util";
import "./SettingsModal.css";

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
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
            <select id="theme-select" value={Theme[theme]} onChange={(event) => setTheme(Theme[event.target.value as keyof typeof Theme])}>
                {members(Theme).map((theme) => <option key={theme} value={theme}>{toTitleCase(theme)}</option>)}
            </select>
            <label htmlFor="keyboard-layout-select">Keyboard Layout:</label>
            <select id="keyboard-layout-select" value={KeyboardLayout[keyboardLayout]} onChange={(event) => setKeyboardLayout(KeyboardLayout[event.target.value as keyof typeof KeyboardLayout])}>
                {members(KeyboardLayout).map((keyboardlayout) =>
                    <option key={keyboardlayout} value={keyboardlayout}>{toTitleCase(keyboardlayout)}</option>
                )}
            </select>
            <label htmlFor="font-size-select">Font Size:</label>
            <select id="font-size-select" value={FontSize[fontSize]} onChange={(event) => setFontSize(
                FontSize[event.target.value as keyof typeof FontSize]
            )}>
                {members(FontSize).map((fontsize) =>
                    <option key={fontsize} value={fontsize}>{toTitleCase(fontsize)}</option>
                )}
            </select>
            <label htmlFor="animation-speed-select">Animation Speed:</label>
            <select id="animation-speed-select" value={AnimationSpeed[animationSpeed]} onChange={(event) => setAnimationSpeed(
                AnimationSpeed[event.target.value as keyof typeof AnimationSpeed]
            )}>
                {members(AnimationSpeed).map((animationspeed) =>
                    <option key={animationspeed} value={animationspeed}>{toTitleCase(animationspeed)}</option>
                )}
            </select>
        </div>
    </Modal>;
}