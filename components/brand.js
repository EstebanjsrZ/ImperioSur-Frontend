import { Crown } from './icons';

export default function Brand({ className = '' }) {
  return (
    <span className={`brand ${className}`}>
      <Crown />
      <span className="brand-name">ImperioSur</span>
      <span className="brand-caption">CERVEZA ARTESANAL</span>
    </span>
  );
}
