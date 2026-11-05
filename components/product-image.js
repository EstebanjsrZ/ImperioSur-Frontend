'use client';
import { useState } from 'react';

export default function ProductImage({ src, nombre, eager = false }) {
  const [fallida, setFallida] = useState(null);
  return <img src={fallida === src ? '/images/producto-placeholder.svg' : src} alt={nombre} width="450" height="675" loading={eager ? 'eager' : 'lazy'} onError={() => setFallida(src)} />;
}
