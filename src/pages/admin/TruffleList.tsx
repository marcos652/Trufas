import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Pencil, Trash2, ToggleLeft, ToggleRight, Search, Candy } from 'lucide-react';
import { useTruffles } from '../../hooks/useTruffles';
import { ChocolatePlaceholder } from '../../components/ui/ChocolatePlaceholder';
import styles from './TruffleList.module.css';

export function TruffleList() {
  const { truffles, loading, deleteTruffle, toggleAvailability } = useTruffles();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const filtered = truffles.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.flavor.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTruffle(id);
    } finally {
      setDeletingId(null);
      setDeleteConfirm(null);
    }
  }

  async function handleToggle(id: string, current: boolean) {
    setTogglingId(id);
    try {
      await toggleAvailability(id, !current);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gerenciar Trufas</h1>
          <p className={styles.subtitle}>
            {loading ? '...' : `${truffles.length} trufa${truffles.length !== 1 ? 's' : ''} cadastrada${truffles.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link to="/admin/truffles/new" className="btn btn--primary">
          <PlusCircle size={16} />
          Nova Trufa
        </Link>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="search"
          className={`form-input ${styles.searchInput}`}
          placeholder="Buscar por nome, sabor ou categoria..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loadingState}>
          <div className="spinner" />
          <p>Carregando trufas...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className={styles.emptyState}>
          <Candy size={48} strokeWidth={1} />
          <p>{search ? 'Nenhuma trufa encontrada para esta busca.' : 'Nenhuma trufa cadastrada ainda.'}</p>
          {!search && (
            <Link to="/admin/truffles/new" className="btn btn--primary">
              Cadastrar primeira trufa
            </Link>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className={styles.grid}>
          <AnimatePresence>
            {filtered.map((truffle, i) => (
              <motion.div
                key={truffle.id}
                className={styles.card}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                {/* Image */}
                <div className={styles.imageWrapper}>
                  {truffle.imageBase64 ? (
                    <img src={truffle.imageBase64} alt={truffle.name} className={styles.image} />
                  ) : (
                    <ChocolatePlaceholder />
                  )}
                  <span className={styles.categoryBadge}>{truffle.category}</span>
                  {truffle.comingSoon && (
                    <span className={`badge badge--coming-soon ${styles.comingSoonBadge}`}>Em Breve</span>
                  )}
                </div>

                {/* Body */}
                <div className={styles.body}>
                  <div className={styles.bodyTop}>
                    <div>
                      <h3 className={styles.name}>{truffle.name}</h3>
                      <p className={styles.flavor}>{truffle.flavor}</p>
                    </div>
                    <span className={styles.price}>
                      R$ {truffle.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className={styles.meta}>
                    <span className={styles.qty}>
                      📦 {truffle.quantity} un.
                    </span>
                    {truffle.launchDate && truffle.comingSoon && (
                      <span className={styles.date}>
                        📅 {new Date(truffle.launchDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className={styles.actions}>
                    {/* Toggle disponibilidade */}
                    {!truffle.comingSoon && (
                      <button
                        className={`${styles.toggleBtn} ${truffle.available ? styles.toggleOn : styles.toggleOff}`}
                        onClick={() => handleToggle(truffle.id, truffle.available)}
                        disabled={togglingId === truffle.id}
                        title={truffle.available ? 'Desativar' : 'Ativar'}
                      >
                        {truffle.available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        <span>{truffle.available ? 'Disponível' : 'Indisponível'}</span>
                      </button>
                    )}

                    <div className={styles.iconActions}>
                      <Link
                        to={`/admin/truffles/${truffle.id}/edit`}
                        className={`btn btn--icon btn--secondary`}
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        className="btn btn--icon btn--danger"
                        onClick={() => setDeleteConfirm(truffle.id)}
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 size={32} className={styles.modalIcon} />
              <h3 className={styles.modalTitle}>Excluir trufa?</h3>
              <p className={styles.modalText}>Esta ação não pode ser desfeita.</p>
              <div className={styles.modalActions}>
                <button
                  className="btn btn--secondary"
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn--danger"
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deletingId === deleteConfirm}
                >
                  {deletingId === deleteConfirm ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
