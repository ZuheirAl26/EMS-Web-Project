import { useEffect } from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import "./ImageLightbox.scss";

interface ImageLightboxProps {
  alt: string;
  onClose: () => void;
  open: boolean;
  src: string | null;
}

export function ImageLightbox({ alt, onClose, open, src }: ImageLightboxProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !src) {
    return null;
  }

  return (
    <div
      aria-label={alt}
      aria-modal="true"
      className="image-lightbox"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
    >
      <button
        aria-label="Close"
        className="image-lightbox__close"
        onClick={onClose}
        type="button"
      >
        <HugeiconsIcon
          color="currentColor"
          icon={Cancel01Icon}
          size={20}
          strokeWidth={1.8}
        />
      </button>
      <img alt={alt} className="image-lightbox__image" src={src} />
    </div>
  );
}
