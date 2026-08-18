import { useLayoutEffect, useRef, useState } from "react";
import { Mail01Icon, Globe02Icon, Mail02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import "./EmailContactMenu.scss";

interface EmailContactMenuProps {
  email: string;
  buttonClassName?: string;
  buttonTitle?: string;
  children?: React.ReactNode;
  align?: "left" | "right";
  direction?: "up" | "down";
}

interface Coords {
  top?: number;
  bottom?: number;
  left: number;
}

export function EmailContactMenu({
  email,
  buttonClassName = "action-btn email-btn",
  buttonTitle = "Send Email",
  children,
  align = "right",
  direction = "down",
}: EmailContactMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 220;
      let left = align === "right" ? rect.right - dropdownWidth : rect.left;

      if (left < 10) left = 10;
      if (left + dropdownWidth > window.innerWidth - 10) {
        left = window.innerWidth - dropdownWidth - 10;
      }

      if (direction === "up") {
        setCoords({
          bottom: window.innerHeight - rect.top + 6,
          left,
        });
      } else {
        setCoords({
          top: rect.bottom + 6,
          left,
        });
      }
    }
  };

  useLayoutEffect(() => {
    if (!isOpen) return;

    updateCoords();

    const handleScrollOrResize = () => {
      updateCoords();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, align, direction]);

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  const mailtoUrl = `mailto:${email}`;

  return (
    <div className="email-contact-menu" ref={menuRef}>
      <button
        ref={buttonRef}
        type="button"
        className={buttonClassName}
        title={buttonTitle}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {children || <HugeiconsIcon icon={Mail01Icon} size={16} />}
      </button>

      {isOpen && coords && (
        <div
          className={`email-contact-dropdown email-contact-dropdown--direction-${direction}`}
          style={{
            position: "fixed",
            left: `${coords.left}px`,
            ...(coords.bottom !== undefined ? { bottom: `${coords.bottom}px` } : {}),
            ...(coords.top !== undefined ? { top: `${coords.top}px` } : {}),
          }}
        >
          <div className="email-dropdown-header">
            <span>Send email to:</span>
            <strong title={email}>{email}</strong>
          </div>
          <div className="email-dropdown-options">
            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="email-dropdown-option"
              onClick={() => setIsOpen(false)}
            >
              <HugeiconsIcon icon={Globe02Icon} size={16} />
              <div className="option-text">
                <strong>Gmail (Web)</strong>
                <small>Open in browser</small>
              </div>
            </a>
            <a
              href={mailtoUrl}
              className="email-dropdown-option"
              onClick={() => setIsOpen(false)}
            >
              <HugeiconsIcon icon={Mail02Icon} size={16} />
              <div className="option-text">
                <strong>Outlook / Default App</strong>
                <small>Open desktop client</small>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
