export default function ErrorState({ title = "Unable to load data", description = "The requested view is not available right now." }) {
  return (
    <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-rose-700">{title}</h2>
      <p className="mt-2 text-sm text-rose-700/80">{description}</p>
    </div>
  );
}
