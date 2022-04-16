import {Theme} from "../../util";
import "./IconButton.css";

interface IconButtonProps {
    onClick: () => void;
    theme: Theme;
    iconWhite: string;
    iconBlack: string;
    className?: string;
}

export function IconButton({onClick,
    theme,
    iconWhite,
    iconBlack,
    className,
}: IconButtonProps) {
    return <button className={`icon-button ${className}`} onClick={onClick}>
        <img src={theme === Theme.LIGHT ? iconBlack : iconWhite} alt="Settings" />
    </button>;
}