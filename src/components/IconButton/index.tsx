import "./IconButton.css";

interface IconButtonProps {
    onClick: () => void;
    theme: "light" | "dark";
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
        <img src={theme === "light" ? iconBlack : iconWhite} alt="Settings" />
    </button>;
}