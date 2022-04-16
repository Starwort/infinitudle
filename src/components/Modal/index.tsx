import React from "react";
import {IconButton} from "..";
import closeBlack from "./close_black.svg";
import closeWhite from "./close_white.svg";
import "./Modal.css";

interface ModalProps {
    /** The modal's title */
    title: string;
    /** The modal's content */
    children: React.ReactNode;
    /** Whether the modal is open */
    open: boolean;
    /** Callback that closes the modal */
    onClose: () => void;
    /** Which theme the app is currently in */
    theme: "light" | "dark";
}

export function Modal({title, children, open, onClose, theme}: ModalProps) {
    React.useEffect(() => {
        if (open) {
            document.body.classList.add("modal-active");
        } else {
            document.body.classList.remove("modal-active");
        }
    }, [open]);
    return <div className={"modal-container" + (open ? "" : " inactive")}>
        <div className="modal-scrim" onClick={onClose} />
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <IconButton
                        className="close-button"
                        iconBlack={closeBlack}
                        iconWhite={closeWhite}
                        onClick={onClose}
                        theme={theme}
                    />
                </div>
                {children}
            </div>
        </div>
    </div>;
};