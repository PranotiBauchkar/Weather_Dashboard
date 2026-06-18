export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-2">
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}
