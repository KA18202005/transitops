export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {actionLabel ? (
        <button type="button" onClick={onAction} className="mt-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
