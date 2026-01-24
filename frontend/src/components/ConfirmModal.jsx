import React from 'react';
import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Yes', cancelText = 'No', type = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalMessage}>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalCancel} onClick={onClose}>
            {cancelText}
          </button>
          <button className={`${styles.modalConfirm} ${type === 'danger' ? styles.modalConfirmDanger : styles.modalConfirmPrimary}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
