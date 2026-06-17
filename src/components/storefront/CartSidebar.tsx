import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../hooks/useOrders';
import styles from './CartSidebar.module.css';

export function CartSidebar() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0 || !customerName || !customerPhone) return;

    setIsSubmitting(true);
    try {
      await createOrder({
        customerName,
        customerPhone,
        items,
        total: totalPrice,
        status: 'Pendente',
      });
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar pedido. Verifique as configurações de permissão do Firebase.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            className={styles.sidebar}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <div className={styles.titleArea}>
                <ShoppingCart size={20} className={styles.icon} />
                <h2>Meu Pedido</h2>
                {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
              </div>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.content}>
              {success ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>✓</div>
                  <h3>Pedido Enviado!</h3>
                  <p>Recebemos o seu pedido. Em breve entraremos em contato.</p>
                </div>
              ) : items.length === 0 ? (
                <div className={styles.emptyState}>
                  <ShoppingCart size={48} className={styles.emptyIcon} />
                  <p>Seu carrinho está vazio</p>
                  <button className="btn btn--primary" onClick={() => setIsOpen(false)}>
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.itemsList}>
                    {items.map((item) => (
                      <div key={item.id} className={styles.item}>
                        {item.imageBase64 && (
                          <img src={item.imageBase64} alt={item.name} className={styles.itemImage} />
                        )}
                        <div className={styles.itemInfo}>
                          <h4>{item.name}</h4>
                          <span className={styles.itemPrice}>
                            R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                          <div className={styles.itemControls}>
                            <div className={styles.quantity}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.truffleId, Math.max(1, item.quantity - 1))}
                              >
                                <Minus size={14} />
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.truffleId, item.quantity + 1)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              type="button"
                              className={styles.removeBtn}
                              onClick={() => removeFromCart(item.truffleId)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form className={styles.checkoutForm} onSubmit={handleCheckout}>
                    <h3>Finalizar Pedido</h3>
                    <div className="form-group">
                      <label className="form-label" htmlFor="customerName">Seu Nome</label>
                      <input
                        id="customerName"
                        className="form-input"
                        placeholder="Ex: João Silva"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="customerPhone">Seu Telefone / WhatsApp</label>
                      <input
                        id="customerPhone"
                        className="form-input"
                        placeholder="Ex: (11) 99999-9999"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>

                    <div className={styles.totalRow}>
                      <span>Total:</span>
                      <span className={styles.totalValue}>
                        R$ {totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className={`btn btn--primary ${styles.submitBtn}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={18} className={styles.spinning} /> Enviando...
                        </>
                      ) : (
                        'Enviar Pedido'
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
