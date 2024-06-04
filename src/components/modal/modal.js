import { X } from "lucide-react";
import "./modal.css";
import { useEffect, useState } from "react";
const Modal = ({ children, open = false, onClose }) => {
  return (
    <div className="flexbox modal" style={{ display: open ? "flex" : "none" }}>
      <div className="modal-content">
        <button className="cross" onClick={onClose}>
          <X size={30} strokeWidth={1} color="white"></X>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
