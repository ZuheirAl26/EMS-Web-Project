import { HugeiconsIcon } from "@hugeicons/react";
import type { ProfileFieldProps } from "../../types/componentType";

export function ProfileField({
  icon,
  label,
  onValueChange,
  value,
  ...inputProps
}: ProfileFieldProps) {
  return (
    <label className="company-profile__field">
      <span>{label}</span>
      <span className="company-profile__input">
        <HugeiconsIcon
          aria-hidden="true"
          color="currentColor"
          icon={icon}
          size={14}
          strokeWidth={1.8}
        />
        <input
          {...inputProps}
          onChange={(event) => onValueChange(event.target.value)}
          value={value}
        />
      </span>
    </label>
  );
}
