import { motion } from 'framer-motion';
import { ShoppingBag, AlertCircle, Plus } from 'lucide-react';
import type { Truffle } from '../../types';
import { useCart } from '../../context/CartContext';
import { ChocolatePlaceholder } from '../ui/ChocolatePlaceholder';
import styles from './TruffleCard.module.css';

interface TruffleCardProps {
  truffle: Truffle;
  index: number;
}

export function TruffleCard({ truffle, index }: TruffleCardProps) {
  const { addToCart } = useCart();
  const isLowStock = truffle.quantity > 0 && truffle.quantity <= 5;

  return (
    <motion.article
      className={`${styles.card} ${!truffle.available ? styles.unavailable : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
    >
      {/* Imagem */}
      <div className={styles.imageWrapper}>
        {truffle.imageBase64 ? (
          <img
            src={truffle.imageBase64}
            alt={truffle.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <ChocolatePlaceholder />
        )}

        {/* Badge de categoria */}
        <span className={styles.categoryBadge}>{truffle.category}</span>

        {/* Overlay indisponível */}
        {!truffle.available && (
          <div className={styles.unavailableOverlay}>
            <AlertCircle size={28} />
            <span>Indisponível</span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.name}>{truffle.name}</h3>
          <span className={styles.price}>
            R$ {truffle.price.toFixed(2).replace('.', ',')}
          </span>
        </div>

        <p className={styles.flavor}>Sabor: <strong>{truffle.flavor}</strong></p>

        {truffle.description && (
          <p className={styles.description}>{truffle.description}</p>
        )}

        <div className={styles.footer}>
          {/* Status */}
          <span
            className={`badge ${truffle.available ? 'badge--available' : 'badge--unavailable'}`}
          >
            <span className={styles.dot} />
            {truffle.available ? 'Disponível' : 'Indisponível'}
          </span>

          {/* Quantidade */}
          {truffle.available && (
            <span className={`${styles.stock} ${isLowStock ? styles.lowStock : ''}`}>
              <ShoppingBag size={13} />
              {isLowStock
                ? `Últimas ${truffle.quantity} un.`
                : `${truffle.quantity} un.`}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {truffle.available && truffle.quantity > 0 && (
          <button 
            className={styles.addToCartBtn} 
            onClick={() => addToCart(truffle)}
          >
            <Plus size={16} />
            Adicionar
          </button>
        )}
      </div>
    </motion.article>
  );
}
