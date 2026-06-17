import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Candy,
  PlusCircle,
  LogOut,
  ChevronRight,
  Eye,
  ShoppingCart,
} from 'lucide-react';
import { logout } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/truffles', icon: Candy, label: 'Trufas' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Pedidos' },
  { to: '/admin/truffles/new', icon: PlusCircle, label: 'Nova Trufa' },
];

export function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🍫</span>
        <div>
          <p className={styles.logoTitle}>Trufaria</p>
          <p className={styles.logoSub}>Painel Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <p className={styles.navLabel}>Menu</p>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin/truffles/new' ? false : true}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight size={14} className={styles.chevron} />
          </NavLink>
        ))}

        <div className={styles.divider} />

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navItem}
        >
          <Eye size={18} />
          <span>Ver Vitrine</span>
          <ChevronRight size={14} className={styles.chevron} />
        </a>
      </nav>

      {/* User + Logout */}
      <div className={styles.userArea}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.displayName || 'Admin'}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
        )}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
