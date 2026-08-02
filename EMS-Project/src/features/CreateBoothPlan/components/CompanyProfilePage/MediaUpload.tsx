import {
  ImageUploadIcon,
  Upload02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { MediaUploadProps } from "../../types/componentType";

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaUpload({
  accept,
  emptyLabel,
  errorMessage,
  file,
  helpText,
  id,
  label,
  onFileChange,
  required = false,
  uploadedLabel,
  wide = false,
}: MediaUploadProps) {
  const handleFiles = (files: FileList | null) => {
    const nextFile = files?.item(0);

    if (nextFile?.type.startsWith("image/")) {
      onFileChange(nextFile);
    }
  };

  return (
    <div
      className={[
        "company-profile__media-item",
        wide ? "company-profile__media-item--wide" : "",
        errorMessage ? "company-profile__media-item--error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <strong>
        {label}
        {required ? <em aria-hidden="true">*</em> : null}
      </strong>
      <label
        className="company-profile__dropzone"
        htmlFor={id}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFiles(event.dataTransfer.files);
        }}
      >
        <HugeiconsIcon
          aria-hidden="true"
          color="currentColor"
          icon={file ? ImageUploadIcon : Upload02Icon}
          size={32}
          strokeWidth={1.6}
        />
        <b>{file ? uploadedLabel : emptyLabel}</b>
        <span>
          {file ? `${file.name} (${formatFileSize(file.size)})` : helpText}
        </span>
        <input
          accept={accept}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          aria-invalid={Boolean(errorMessage)}
          aria-required={required}
          id={id}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
          type="file"
        />
      </label>
      <div className="company-profile__media-status">
        <span
          className={
            file
              ? "company-profile__status--uploaded"
              : "company-profile__status--missing"
          }
        >
          {file ? uploadedLabel : emptyLabel}
        </span>
        {file ? (
          <button
            aria-label={`${label}: ${emptyLabel}`}
            onClick={() => onFileChange(null)}
            type="button"
          >
            ×
          </button>
        ) : null}
      </div>
      {errorMessage ? (
        <span
          className="company-profile__validation-error"
          id={`${id}-error`}
          role="alert"
        >
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
