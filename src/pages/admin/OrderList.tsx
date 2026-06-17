import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle, XCircle, Search, Loader2, MessageCircle } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import type { OrderStatus } from '../../types';
import styles from './OrderList.module.css';

const TABS: { label: string; value: OrderStatus | 'Todos' }[] = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Pendentes', value: 'Pendente' },
  { label: 'Concluídos', value: 'Concluído' },
  { label: 'Cancelados', value: 'Cancelado' },
];

export function OrderList() {
  const { orders, loading, error, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<OrderStatus | 'Todos'>('Todos');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchTab = activeTab === 'Todos' || order.status === activeTab;
      const matchSearch =
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerPhone.includes(search);
      return matchTab && matchSearch;
    });
  }, [orders, activeTab, search]);

  const handleStatusChange = async (id: string, newStatus: OrderStatus) => {
    if (window.confirm(`Deseja marcar este pedido como ${newStatus}?`)) {
      await updateOrderStatus(id, newStatus);
    }
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case 'Pendente': return styles.badgePending;
      case 'Concluído': return styles.badgeCompleted;
      case 'Cancelado': return styles.badgeCancelled;
      default: return '';
    }
  };

  const handleWhatsApp = (order: typeof orders[0]) => {
    const text = `Olá ${order.customerName}! Seu pedido na Trufaria foi confirmado. O total deu R$ ${order.total.toFixed(2).replace('.', ',')}. Em breve entraremos em contato para combinar a entrega/retirada!`;
    const phone = order.customerPhone.replace(/\D/g, '');
    const waPhone = phone.startsWith('55') ? phone : `55${phone}`;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <ShoppingCart size={24} />
          Pedidos
        </h1>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por cliente ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${activeTab === tab.value ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <Loader2 size={32} className={styles.spinning} />
          <p>Carregando pedidos...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>⚠️ {error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className={styles.orderGrid}>
          <AnimatePresence>
            {filteredOrders.map((order, i) => (
              <motion.div
                key={order.id}
                className={styles.orderCard}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className={styles.orderHeader}>
                  <div>
                    <h3 className={styles.customerName}>{order.customerName}</h3>
                    <p className={styles.customerPhone}>{order.customerPhone}</p>
                  </div>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className={styles.orderItems}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <span className={styles.itemQuantity}>{item.quantity}x</span>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemPrice}>
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.totalInfo}>
                    <p className={styles.date}>
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </p>
                    <p className={styles.total}>
                      Total: R$ {order.total.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <div className={styles.actions}>
                    {order.status === 'Pendente' && (
                      <>
                        <button
                          className={styles.btnComplete}
                          onClick={() => handleStatusChange(order.id, 'Concluído')}
                          title="Marcar como Concluído"
                        >
                          <CheckCircle size={20} />
                        </button>
                        <button
                          className={styles.btnCancel}
                          onClick={() => handleStatusChange(order.id, 'Cancelado')}
                          title="Cancelar Pedido"
                        >
                          <XCircle size={20} />
                        </button>
                      </>
                    )}
                    <button
                      className={styles.btnWhatsapp}
                      onClick={() => handleWhatsApp(order)}
                      title="Avisar no WhatsApp"
                    >
                      <MessageCircle size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
