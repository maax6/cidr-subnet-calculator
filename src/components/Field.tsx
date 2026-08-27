export default function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: 'numeric';
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        spellCheck={false}
        autoComplete="off"
      />
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}
