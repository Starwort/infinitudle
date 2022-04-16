import React from "react";
import {IconButton} from "..";
import {Theme} from "../../util";
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
    theme: Theme;
}

export function Modal({title, children, open, onClose, theme}: ModalProps) {
    React.useEffect(() => {
        if (open) {
            document.body.classList.add("modal-active");
        } else {
            document.body.classList.remove("modal-active");
        }
    }, [open]);
    React.useEffect(() => {
        if (!open) {
            return;
        }
        const listener = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [open, onClose]);
    return <div className={open ? "" : "modal-inactive"}>
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