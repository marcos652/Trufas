import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { useTruffles } from '../../hooks/useTruffles';
import { ImageUploader } from '../../components/admin/ImageUploader';
import type { TruffleFormData, TruffleCategory } from '../../types';
import styles from './TruffleForm.module.css';

const CATEGORIES: TruffleCategory[] = ['Clássica', 'Premium', 'Especial', 'Sazonal'];

const schema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  flavor: z.string().min(2, 'Informe o sabor'),
  description: z.string(),
  price: z.coerce.number().min(0.01, 'Preço inválido'),
  quantity: z.coerce.number().int().min(0, 'Quantidade inválida'),
  available: z.boolean(),
  comingSoon: z.boolean(),
  launchDate: z.string(),
  imageBase64: z.string(),
  category: z.enum(['Clássica', 'Premium', 'Especial', 'Sazonal']),
});

type FormValues = z.infer<typeof schema>;

export function TruffleForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { truffles, addTruffle, updateTruffle, loading } = useTruffles();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: '',
      flavor: '',
      description: '',
      price: 0,
      quantity: 0,
      available: true,
      comingSoon: false,
      launchDate: '',
      imageBase64: '',
      category: 'Clássica',
    },
  });

  const comingSoon = watch('comingSoon');

  // Preencher formulário no modo edição
  useEffect(() => {
    if (isEdit && !loading) {
      const truffle = truffles.find((t) => t.id === id);
      if (truffle) {
        reset({
          name: truffle.name,
          flavor: truffle.flavor,
          description: truffle.description || '',
          price: truffle.price,
          quantity: truffle.quantity,
          available: truffle.available,
          comingSoon: truffle.comingSoon,
          launchDate: truffle.launchDate || '',
          imageBase64: truffle.imageBase64 || '',
          category: truffle.category,
        });
      }
    }
  }, [isEdit, loading, truffles, id, reset]);

  async function onSubmit(data: FormValues) {
    setSaving(true);
    try {
      const payload: TruffleFormData = {
        ...data,
        description: data.description || '',
        launchDate: data.launchDate || '',
        imageBase64: data.imageBase64 || '',
      };

      if (isEdit && id) {
        await updateTruffle(id, payload);
      } else {
        await addTruffle(payload);
      }
      setSaved(true);
      setTimeout(() => {
        navigate('/admin/truffles');
      }, 800);
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/admin/truffles" className="btn btn--secondary btn--sm">
          <ArrowLeft size={15} />
          Voltar
        </Link>
        <h1 className={styles.title}>
          {isEdit ? 'Editar Trufa' : 'Nova Trufa'}
        </h1>
      </div>

      <motion.form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        noValidate
      >
        {/* Coluna esquerda: foto */}
        <div className={styles.leftCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Foto da Trufa</h2>
            <Controller
              name="imageBase64"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.imageBase64?.message}
                />
              )}
            />
          </div>

          {/* Disponibilidade */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Disponibilidade</h2>
            <div className={styles.toggleRow}>
              <div>
                <p className={styles.toggleLabel}>Disponível</p>
                <p className={styles.toggleHint}>
                  {comingSoon ? 'Desabilitado — trufa Em Breve' : 'Mostrar como disponível na vitrine'}
                </p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  {...register('available')}
                  disabled={comingSoon}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            <div className={styles.toggleRow}>
              <div>
                <p className={styles.toggleLabel}>Em Breve</p>
                <p className={styles.toggleHint}>Aparece na seção "Em Breve" da vitrine</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  {...register('comingSoon')}
                  onChange={(e) => {
                    setValue('comingSoon', e.target.checked);
                    if (e.target.checked) setValue('available', false);
                  }}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {comingSoon && (
              <motion.div
                className="form-group"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="form-label" htmlFor="launchDate">
                  Data de Lançamento
                </label>
                <input
                  id="launchDate"
                  type="date"
                  className="form-input"
                  {...register('launchDate')}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Coluna direita: dados */}
        <div className={styles.rightCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações</h2>

            <div className={styles.formGrid}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nome *</label>
                <input
                  id="name"
                  className="form-input"
                  placeholder="Ex: Trufa de Morango"
                  {...register('name')}
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="flavor">Sabor *</label>
                <input
                  id="flavor"
                  className="form-input"
                  placeholder="Ex: Morango com chocolate branco"
                  {...register('flavor')}
                />
                {errors.flavor && <p className="form-error">{errors.flavor.message}</p>}
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  className="form-input form-textarea"
                  placeholder="Descreva a trufa, ingredientes especiais, diferenciais..."
                  {...register('description')}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category">Categoria *</label>
                <select id="category" className="form-input form-select" {...register('category')}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">Preço (R$) *</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="0,00"
                  {...register('price')}
                />
                {errors.price && <p className="form-error">{errors.price.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="quantity">Quantidade em estoque *</label>
                <input
                  id="quantity"
                  type="number"
                  min="0"
                  step="1"
                  className="form-input"
                  placeholder="0"
                  {...register('quantity')}
                />
                {errors.quantity && <p className="form-error">{errors.quantity.message}</p>}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className={styles.submitRow}>
            <Link to="/admin/truffles" className="btn btn--secondary">
              Cancelar
            </Link>
            <button
              type="submit"
              className={`btn btn--primary ${styles.submitBtn}`}
              disabled={saving || saved}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className={styles.spinning} />
                  Salvando...
                </>
              ) : saved ? (
                <>✓ Salvo!</>
              ) : (
                <>
                  <Save size={16} />
                  {isEdit ? 'Salvar alterações' : 'Criar trufa'}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
