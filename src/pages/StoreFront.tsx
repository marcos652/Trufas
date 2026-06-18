import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTruffles } from '../hooks/useTruffles';
import { HeroSection } from '../components/storefront/HeroSection';
import { FilterBar } from '../components/storefront/FilterBar';
import { TruffleCard } from '../components/storefront/TruffleCard';
import { ComingSoonCard } from '../components/storefront/ComingSoonCard';
import { CartSidebar } from '../components/storefront/CartSidebar';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useCart } from '../context/CartContext';
import type { TruffleCategory } from '../types';
import styles from './StoreFront.module.css';

export function StoreFront() {
  const { truffles, loading, error } = useTruffles();
  const { totalItems, setIsOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<TruffleCategory | 'Todos'>('Todos');

  const available = useMemo(
    () => truffles.filter((t) => !t.comingSoon),
    [truffles]
  );

  const comingSoon = useMemo(
    () => truffles.filter((t) => t.comingSoon),
    [truffles]
  );

  const filtered = useMemo(() => {
    if (selectedCategory === 'Todos') return available;
    return available.filter((t) => t.category === selectedCategory);
  }, [available, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: available.length };
    available.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [available]);

  return (
    <div className={styles.page}>
      {/* Header Actions */}
      <div className={styles.headerActions}>
        <ThemeToggle />
        <Link to="/admin" className={styles.adminLink} title="Painel Administrativo">
          <Settings size={16} />
          <span>Admin</span>
        </Link>
      </div>

      <HeroSection />

      <main className={styles.main}>
        <div className="container">
          {/* Filtros */}
          <section className={styles.filterSection}>
            <FilterBar
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              counts={categoryCounts}
            />
          </section>

          {/* Estado de carregamento */}
          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner" />
              <p>Carregando trufas...</p>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className={styles.errorState}>
              <p>⚠️ {error}</p>
            </div>
          )}

          {/* Grid de trufas disponíveis */}
          {!loading && !error && (
            <>
              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Nenhuma trufa encontrada nesta categoria.</p>
                </div>
              ) : (
                <section className={styles.gridSection}>
                  <h2 className={styles.sectionTitle}>
                    Nossas Trufas
                    <span className={styles.sectionCount}>{filtered.length}</span>
                  </h2>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedCategory}
                      className={styles.grid}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {filtered.map((truffle, i) => (
                        <TruffleCard key={truffle.id} truffle={truffle} index={i} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </section>
              )}

              {/* Seção Em Breve */}
              {comingSoon.length > 0 && (
                <section className={styles.comingSoonSection}>
                  <div className={styles.comingSoonHeader}>
                    <div className={styles.pulse} />
                    <h2 className={styles.sectionTitle}>Em Breve</h2>
                  </div>
                  <p className={styles.comingSoonSubtitle}>
                    Novidades especiais chegando em breve para você
                  </p>
                  <div className={styles.gridComingSoon}>
                    {comingSoon.map((truffle, i) => (
                      <ComingSoonCard key={truffle.id} truffle={truffle} index={i} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Vitrine de Trufas. Feito com 🍫</p>
      </footer>

      {/* Floating Cart Button */}
      {totalItems > 0 && (
        <motion.button
          className={styles.floatingCart}
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ShoppingCart size={24} />
          <span className={styles.cartBadge}>{totalItems}</span>
        </motion.button>
      )}

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}
