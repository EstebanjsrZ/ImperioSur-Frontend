export function Arrow({ direction = 'right', ...props }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props} style={{ transform: direction === 'left' ? 'rotate(180deg)' : undefined, ...props.style }}><path d="M4 12h15M12 5l7 7-7 7" /></svg>;
}

export function Crown(props) {
  return <svg viewBox="0 0 44 30" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}><path d="m5 9 9 6L22 4l8 11 9-6-5 15H10L5 9Z" /><path d="M11 28h22M22 0v4M2 6l3 3M42 6l-3 3" /></svg>;
}

export function Wave(props) {
  return <svg viewBox="0 0 120 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" {...props}><path d="M0 5c10-6 20 6 30 0s20 6 30 0 20 6 30 0 20 6 30 0M0 12c10-6 20 6 30 0s20 6 30 0 20 6 30 0 20 6 30 0" /></svg>;
}
