export default function CuentaLayout({ children }) {
  return (
    <section className="auth-page section-wrap">
      <div className="auth-panel">
        <p className="eyebrow">IMPERIOSUR · ESPACIO PERSONAL</p>
        {children}
      </div>
    </section>
  );
}
