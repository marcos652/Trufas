import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { loginWithEmail } from '../../services/firebase';
import styles from './Login.module.css';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('Email ou senha incorretos.');
      } else if (code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Aguarde um momento.');
      } else {
        setError('Erro ao fazer login. Verifique as configurações do Firebase.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.logo}>🍫</span>
          <h1 className={styles.title}>Painel Admin</h1>
          <p className={styles.subtitle}>Entre com suas credenciais para continuar</p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="admin@trufaria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Senha</label>
            <div className={styles.passwordWrapper}>
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className={`form-input ${styles.passwordInput}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              className={styles.errorBox}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            className={`btn btn--primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.btnSpinner} />
            ) : (
              <LogIn size={16} />
            )}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className={styles.back}>
          <a href="/">← Voltar para a Vitrine</a>
        </p>
      </motion.div>
    </div>
  );
}
