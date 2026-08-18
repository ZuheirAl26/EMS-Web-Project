import { useEffect, useRef, useState } from "react";
import {
  ArrowDown01Icon,
  Globe02Icon,
  Message02Icon,
  Moon02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { useLanguageStore } from "../../context/useLanguageStore";
import { useThemeStore } from "../../context/useThemeStore";
import { EmailContactMenu } from "../../components";
import "./AccountMenu.scss";

const ADMIN_CONTACT_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL || "admin@example.com";

interface AccountMenuProps {
  accountName: string;
  avatarError: boolean;
  avatarUrl: string | null;
  initials: string;
  onAvatarError: () => void;
}

export function AccountMenu({
  accountName,
  avatarError,
  avatarUrl,
  initials,
  onAvatarError,
}: AccountMenuProps) {
  const { t } = useTranslation("dashboard");
  const { language, toggleLanguage } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="account-menu" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t("account.openMenu")}
        className="account-menu__trigger"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span className="account-menu__avatar" aria-hidden="true">
          {avatarUrl && !avatarError ? (
            <img alt={accountName} onError={onAvatarError} src={avatarUrl} />
          ) : (
            initials
          )}
        </span>
        <span className="account-menu__copy">
          <strong>{accountName}</strong>
          <small>{t("account.role")}</small>
        </span>
        <HugeiconsIcon
          aria-hidden="true"
          className={isOpen ? "account-menu__arrow--open" : ""}
          color="currentColor"
          icon={ArrowDown01Icon}
          size={14}
          strokeWidth={2}
        />
      </button>

      {isOpen ? (
        <div
          aria-label={t("account.openMenu")}
          className="account-menu__panel"
          role="menu"
        >
          <button
            className="account-menu__item"
            onClick={() => toggleTheme()}
            role="menuitem"
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={Moon02Icon}
              size={16}
              strokeWidth={1.8}
            />
            <span className="account-menu__item-body">
              <strong>{t("account.menu.theme")}</strong>
              <small>
                {theme === "dark"
                  ? t("account.menu.themeDark")
                  : t("account.menu.themeLight")}
              </small>
            </span>
          </button>

          <button
            className="account-menu__item"
            onClick={() => toggleLanguage()}
            role="menuitem"
            type="button"
          >
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={Globe02Icon}
              size={16}
              strokeWidth={1.8}
            />
            <span className="account-menu__item-body">
              <strong>{t("account.menu.language")}</strong>
              <small>{language === "en" ? "EN" : "AR"}</small>
            </span>
          </button>

          <EmailContactMenu
            align="left"
            direction="up"
            buttonClassName="account-menu__item"
            buttonTitle={t("account.menu.contactAdmin")}
            email={ADMIN_CONTACT_EMAIL}
          >
            <HugeiconsIcon
              aria-hidden="true"
              color="currentColor"
              icon={Message02Icon}
              size={16}
              strokeWidth={1.8}
            />
            <span className="account-menu__item-body">
              <strong>{t("account.menu.contactAdmin")}</strong>
              <small title={ADMIN_CONTACT_EMAIL}>{ADMIN_CONTACT_EMAIL}</small>
            </span>
          </EmailContactMenu>
        </div>
      ) : null}
    </div>
  );
}
