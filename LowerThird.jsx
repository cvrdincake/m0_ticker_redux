// patterns/BroadcastOverlay/LowerThird.jsx
export function LowerThird({ message, active = false }) {
  return (
    <div className={`lower-third ${active ? 'active' : ''}`}>
      <div className="lower-third-track">
        <span className="lower-third-text">{message}</span>
      </div>
    </div>
  );
}