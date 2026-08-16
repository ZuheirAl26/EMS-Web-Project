import { useEffect, useMemo } from "react";
import {
  ImageUploadIcon,
  Upload02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { MediaUploadProps } from "../../types/componentType";

function getFileSignature(file: File) {
  return `${file.name}:${file.size}:${file.type}:${file.lastModified}`;
}

export function MediaUpload({
  accept,
  emptyLabel,
  errorMessage,
  file = null,
  files,
  helpText,
  id,
  label,
  limitReachedLabel,
  maxFiles = 1,
  onFileChange,
  onFilesChange,
  remotePreviewUrls = [],
  removeFileAriaLabel,
  required = false,
  selectedFilesLabel,
  uploadedLabel,
  wide = false,
}: MediaUploadProps) {
  const isMultiFile = maxFiles > 1;
  const selectedFiles = isMultiFile ? (files ?? []) : file ? [file] : [];
  const remotePreviews = remotePreviewUrls.filter(Boolean);
  const localPreviewUrls = useMemo(() => {
    const filesToPreview = isMultiFile ? (files ?? []) : file ? [file] : [];
    return filesToPreview.map((selectedFile) => URL.createObjectURL(selectedFile));
  }, [file, files, isMultiFile]);

  useEffect(
    () => () => {
      localPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    },
    [localPreviewUrls],
  );

  const previewUrls = localPreviewUrls.length ? localPreviewUrls : remotePreviews;
  const hasMedia = selectedFiles.length > 0 || remotePreviews.length > 0;
  const isAtFileLimit = isMultiFile && selectedFiles.length >= maxFiles;

  const handleFiles = (fileList: FileList | null) => {
    if (isAtFileLimit) {
      return;
    }

    const imageFiles = Array.from(fileList ?? []).filter((candidate) =>
      candidate.type.startsWith("image/"),
    );

    if (!imageFiles.length) {
      return;
    }

    if (isMultiFile) {
      const knownFileSignatures = new Set(selectedFiles.map(getFileSignature));
      const uniqueNewFiles = imageFiles.filter((candidate) => {
        const signature = getFileSignature(candidate);

        if (knownFileSignatures.has(signature)) {
          return false;
        }

        knownFileSignatures.add(signature);
        return true;
      });

      if (uniqueNewFiles.length) {
        onFilesChange?.([...selectedFiles, ...uniqueNewFiles].slice(0, maxFiles));
      }

      return;
    }

    onFileChange?.(imageFiles[0] ?? null);
  };

  const clearMedia = () => {
    if (isMultiFile) {
      onFilesChange?.([]);
      return;
    }

    onFileChange?.(null);
  };

  const removeFile = (fileIndex: number) => {
    if (!isMultiFile) {
      clearMedia();
      return;
    }

    onFilesChange?.(selectedFiles.filter((_, index) => index !== fileIndex));
  };

  const detailText = isAtFileLimit && limitReachedLabel
    ? limitReachedLabel
    : selectedFiles.length
      ? selectedFiles.map((selectedFile) => selectedFile.name).join(", ")
      : helpText;

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
      <span>
        {label}
        {required ? <em aria-hidden="true">*</em> : null}
      </span>
      <label
        aria-disabled={isAtFileLimit || undefined}
        className={[
          "company-profile__dropzone",
          isAtFileLimit ? "company-profile__dropzone--disabled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onDragOver={(event) => {
          if (!isAtFileLimit) {
            event.preventDefault();
          }
        }}
        onDrop={(event) => {
          event.preventDefault();

          if (!isAtFileLimit) {
            handleFiles(event.dataTransfer.files);
          }
        }}
      >
        {previewUrls.length ? (
          <span className="company-profile__dropzone-preview" aria-hidden="true">
            {previewUrls.slice(0, 3).map((url, index) => (
              <img alt="" key={`${url}-${index}`} src={url} />
            ))}
          </span>
        ) : (
          <HugeiconsIcon
            aria-hidden="true"
            color="currentColor"
            icon={hasMedia ? ImageUploadIcon : Upload02Icon}
            size={32}
            strokeWidth={1.6}
          />
        )}
        <b>{hasMedia ? uploadedLabel : emptyLabel}</b>
        <span>{detailText}</span>
        <input
          accept={accept}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          aria-invalid={Boolean(errorMessage)}
          aria-required={required}
          disabled={isAtFileLimit}
          id={id}
          multiple={isMultiFile}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
          type="file"
        />
      </label>
      {isMultiFile && selectedFiles.length ? (
        <ul aria-label={selectedFilesLabel ?? label} className="company-profile__selected-files">
          {selectedFiles.map((selectedFile, index) => (
            <li className="company-profile__selected-file" key={getFileSignature(selectedFile)}>
              <img
                alt=""
                aria-hidden="true"
                className="company-profile__selected-file-preview"
                src={localPreviewUrls[index]}
              />
              <span className="company-profile__selected-file-name">{selectedFile.name}</span>
              <button
                aria-label={removeFileAriaLabel?.(selectedFile.name) ?? `Remove ${selectedFile.name}`}
                className="company-profile__selected-file-remove"
                onClick={() => removeFile(index)}
                type="button"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="company-profile__media-status">
        <span
          className={
            hasMedia
              ? "company-profile__status--uploaded"
              : "company-profile__status--missing"
          }
        >
          {hasMedia ? uploadedLabel : emptyLabel}
        </span>
        {!isMultiFile && selectedFiles.length ? (
          <button
            aria-label={`${label}: ${emptyLabel}`}
            onClick={clearMedia}
            type="button"
          >
            ×
          </button>
        ) : null}
      </div>
      {errorMessage ? (
        <span className="company-profile__validation-error" id={`${id}-error`} role="alert">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
