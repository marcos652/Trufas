import styles from './ChocolatePlaceholder.module.css';

export function ChocolatePlaceholder() {
  return (
    <div className={styles.placeholder}>
      <svg
        viewBox="0 0 80 80"
        className={styles.icon}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="10" y="20" width="60" height="40" rx="6" fill="rgba(212,168,67,0.08)" stroke="rgba(212,168,67,0.2)" strokeWidth="1.5" />
        <rect x="20" y="28" width="16" height="24" rx="3" fill="rgba(212,168,67,0.1)" stroke="rgba(212,168,67,0.2)" strokeWidth="1" />
        <rect x="40" y="28" width="22" height="10" rx="3" fill="rgba(212,168,67,0.1)" stroke="rgba(212,168,67,0.2)" strokeWidth="1" />
        <rect x="40" y="42" width="22" height="10" rx="3" fill="rgba(212,168,67,0.1)" stroke="rgba(212,168,67,0.2)" strokeWidth="1" />
        <circle cx="40" cy="14" r="5" fill="rgba(212,168,67,0.15)" stroke="rgba(212,168,67,0.3)" strokeWidth="1.5" />
        <path d="M36 14 Q40 8 44 14" stroke="rgba(212,168,67,0.3)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
      <span className={styles.text}>Sem foto</span>
    </div>
  );
}
