export default function CpCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200/80 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
