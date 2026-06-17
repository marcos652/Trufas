import type { ReactNode } from 'react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  color?: 'gold' | 'green' | 'red' | 'muted';
  suffix?: string;
}

export function StatsCard({ label, value, icon, color = 'gold', suffix }: StatsCardProps) {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.iconWrapper}>{icon}</div>
      <div className={styles.content}>
        <p className={styles.value}>
          {value}
          {suffix && <span className={styles.suffix}>{suffix}</span>}
        </p>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
}
