import { type TruffleCategory } from '../../types';
import styles from './FilterBar.module.css';

const CATEGORIES: Array<TruffleCategory | 'Todos'> = [
  'Todos',
  'Clássica',
  'Premium',
  'Especial',
  'Sazonal',
];

interface FilterBarProps {
  selected: TruffleCategory | 'Todos';
  onSelect: (cat: TruffleCategory | 'Todos') => void;
  counts: Record<string, number>;
}

export function FilterBar({ selected, onSelect, counts }: FilterBarProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.pill} ${selected === cat ? styles.active : ''}`}
            onClick={() => onSelect(cat)}
          >
            <span>{cat}</span>
            {counts[cat] !== undefined && (
              <span className={styles.count}>{counts[cat]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
