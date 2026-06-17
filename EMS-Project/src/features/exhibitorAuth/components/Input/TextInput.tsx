interface TextInputProps {
  id: string;
  label: string;
  type?: "text" | "email";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

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
