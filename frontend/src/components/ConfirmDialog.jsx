import { useEffect } from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', loading, onConfirm, onCancel }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onMouseDown={onCancel}>
      <div role="alertdialog" aria-modal="true" className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TriangleAlert className="h-5 w-5" />
        </span>
        <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1.5 text-sm text-slate-500">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
