export default function SectionLabel({
  title,
  count,
  id,
}: {
  title: string;
  count: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-steam-panel2 to-transparent border-l-[3px] border-steam-link text-sm mb-3"
    >
      <span className="text-steam-bright">{title}</span>
      <span className="text-xs font-mono text-steam-dim">{count}</span>
    </div>
  );
}
