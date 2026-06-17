import { motion } from 'framer-motion';
import { Clock, CalendarDays } from 'lucide-react';
import type { Truffle } from '../../types';
import { ChocolatePlaceholder } from '../ui/ChocolatePlaceholder';
import styles from './ComingSoonCard.module.css';

interface ComingSoonCardProps {
  truffle: Truffle;
  index: number;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getDaysRemaining(dateStr: string) {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function ComingSoonCard({ truffle, index }: ComingSoonCardProps) {
  const daysLeft = truffle.launchDate ? getDaysRemaining(truffle.launchDate) : null;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45, ease: 'easeOut' }}
    >
      {/* Imagem com shimmer */}
      <div className={styles.imageWrapper}>
        {truffle.imageBase64 ? (
          <img src={truffle.imageBase64} alt={truffle.name} className={styles.image} loading="lazy" />
        ) : (
          <ChocolatePlaceholder />
        )}
        <div className={styles.shimmerOverlay} />
        <span className="badge badge--coming-soon" style={{ position: 'absolute', top: 12, left: 12 }}>
          <Clock size={12} />
          Em Breve
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{truffle.name}</h3>
        <p className={styles.flavor}>Sabor: <strong>{truffle.flavor}</strong></p>

        {truffle.description && (
          <p className={styles.description}>{truffle.description}</p>
        )}

        <div className={styles.footer}>
          {truffle.launchDate && (
            <div className={styles.launchDate}>
              <CalendarDays size={14} />
              <div>
                <span className={styles.launchLabel}>Disponível em</span>
                <span className={styles.launchValue}>{formatDate(truffle.launchDate)}</span>
              </div>
            </div>
          )}
          {daysLeft !== null && daysLeft > 0 && (
            <span className={styles.countdown}>
              {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
