import { CheckIcon } from "../icons";

interface FilterChipProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export function FilterChip({ label, checked, onToggle }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-all
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
        ${
          checked
            ? "bg-slate-100 border-slate-200 text-slate-900"
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
        }`}
    >
      <CheckIcon checked={checked} />
      <span>{label}</span>
    </button>
  );
}
