import type { TextInputProps } from "../../types/componentType";

export default function TextInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = true,
}: TextInputProps) {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? "input-error" : ""}
        required={required}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
