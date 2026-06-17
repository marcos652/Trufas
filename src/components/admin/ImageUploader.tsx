import { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
  error?: string;
}

const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ImageUploader({ value, onChange, error }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState('');

  function processFile(file: File) {
    setSizeError('');
    if (!file.type.startsWith('image/')) {
      setSizeError('Apenas imagens são aceitas (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setSizeError(`Imagem muito grande. Máximo: ${MAX_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Comprimir via canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        onChange(compressed);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div className={styles.wrapper}>
      {value ? (
        <div className={styles.preview}>
          <img src={value} alt="Preview da trufa" className={styles.previewImg} />
          <button
            type="button"
            className={styles.removeBtn}
            onClick={() => onChange('')}
            title="Remover foto"
          >
            <X size={16} />
          </button>
          <button
            type="button"
            className={styles.changeBtn}
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={14} />
            Trocar foto
          </button>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''} ${error || sizeError ? styles.hasError : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <ImageIcon size={32} className={styles.dropIcon} />
          <p className={styles.dropText}>
            Arraste uma foto ou <span>clique para selecionar</span>
          </p>
          <p className={styles.dropHint}>PNG, JPG, WEBP — máx. {MAX_SIZE_MB}MB</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleChange}
      />

      {(error || sizeError) && (
        <p className="form-error">{sizeError || error}</p>
      )}
    </div>
  );
}
