import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Candy, CheckCircle, XCircle, Clock, Package, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTruffles } from '../../hooks/useTruffles';
import { StatsCard } from '../../components/admin/StatsCard';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const { truffles, loading } = useTruffles();
  const { user } = useAuth();

  const stats = useMemo(() => ({
    total: truffles.filter((t) => !t.comingSoon).length,
    available: truffles.filter((t) => t.available && !t.comingSoon).length,
    unavailable: truffles.filter((t) => !t.available && !t.comingSoon).length,
    comingSoon: truffles.filter((t) => t.comingSoon).length,
    totalQuantity: truffles.filter((t) => !t.comingSoon).reduce((sum, t) => sum + t.quantity, 0),
  }), [truffles]);

  const recentTruffles = useMemo(
    () => truffles.filter((t) => !t.comingSoon).slice(0, 5),
    [truffles]
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            {greeting}, {user?.displayName || 'Admin'} 👋
          </h1>
          <p className={styles.subtitle}>Aqui está o resumo da sua trufaria hoje.</p>
        </div>
        <Link to="/admin/truffles/new" className="btn btn--primary">
          <Candy size={16} />
          Nova Trufa
        </Link>
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatsCard label="Total de Trufas" value={loading ? '...' : stats.total} icon={<Candy size={22} />} color="gold" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatsCard label="Disponíveis" value={loading ? '...' : stats.available} icon={<CheckCircle size={22} />} color="green" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatsCard label="Indisponíveis" value={loading ? '...' : stats.unavailable} icon={<XCircle size={22} />} color="red" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatsCard label="Em Breve" value={loading ? '...' : stats.comingSoon} icon={<Clock size={22} />} color="muted" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <StatsCard label="Estoque Total" value={loading ? '...' : stats.totalQuantity} icon={<Package size={22} />} color="gold" suffix="un." />
        </motion.div>
      </div>

      {/* Recent truffles */}
      <motion.div
        className={styles.recentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className={styles.recentHeader}>
          <h2 className={styles.recentTitle}>
            <TrendingUp size={18} />
            Trufas Recentes
          </h2>
          <Link to="/admin/truffles" className="btn btn--secondary btn--sm">
            Ver todas
          </Link>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <div className="spinner" />
          </div>
        ) : recentTruffles.length === 0 ? (
          <div className={styles.emptyState}>
            <Candy size={40} strokeWidth={1} />
            <p>Nenhuma trufa cadastrada ainda.</p>
            <Link to="/admin/truffles/new" className="btn btn--primary btn--sm">
              Cadastrar primeira trufa
            </Link>
          </div>
        ) : (
          <div className={styles.truffleTable}>
            <div className={styles.tableHeader}>
              <span>Trufa</span>
              <span>Categoria</span>
              <span>Quantidade</span>
              <span>Preço</span>
              <span>Status</span>
            </div>
            {recentTruffles.map((t) => (
              <Link key={t.id} to={`/admin/truffles/${t.id}/edit`} className={styles.tableRow}>
                <div className={styles.truffleInfo}>
                  {t.imageBase64 ? (
                    <img src={t.imageBase64} alt={t.name} className={styles.truffleThumb} />
                  ) : (
                    <div className={styles.truffleThumbPlaceholder}>🍫</div>
                  )}
                  <div>
                    <p className={styles.truffleName}>{t.name}</p>
                    <p className={styles.truffleFlavor}>{t.flavor}</p>
                  </div>
                </div>
                <span className={styles.truffleCategory}>{t.category}</span>
                <span className={styles.truffleQty}>{t.quantity} un.</span>
                <span className={styles.trufflePrice}>R$ {t.price.toFixed(2).replace('.', ',')}</span>
                <span className={`badge ${t.available ? 'badge--available' : 'badge--unavailable'}`}>
                  {t.available ? 'Disponível' : 'Indisponível'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
