import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Building03Icon,
  Calendar03Icon,
  DashboardSquare01Icon,
  Logout03Icon,
  Notification02Icon,
  UserAdd01Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import logo from "../../assets/logo.png";
import { LogoutDialog } from "../../features/ExhibitorAuth/components";
import { useLogout } from "../../features/ExhibitorAuth/hooks/useLogout";
import { useAuthStore } from "../../store/AuthStore";
import "./DashboardLayout.scss";
import { useExhibitorProfile } from "../../features/ExhibitorProfile/hooks/useExhibitorProfile";
import { resolveMediaUrl } from "../../features/ExhibitorProfile/utils/profileUtils";
import { AccountMenu } from "../components/AccountMenu";
import { NotificationHeaderMenu } from "../../features/Notifications";

const navigationItems = [
  {
    id: "dashboard",
    path: "/dashboard",
    icon: DashboardSquare01Icon,
  },
  {
    id: "booths",
    path: "/dashboard/booths",
    icon: Building03Icon,
  },
  {
    id: "visitors",
    path: "/dashboard/visitors",
    icon: UserGroupIcon,
  },
  {
    id: "team",
    path: "/dashboard/team",
    icon: UserAdd01Icon,
  },
  {
    id: "events",
    path: "/dashboard/events",
    icon: Calendar03Icon,
  },
  {
    id: "profile",
    path: "/dashboard/profile",
    icon: UserIcon,
  },
  {
    id: "notification",
    path: "/dashboard/notifications",
    icon: Notification02Icon,
  },
] as const;

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function DashboardLayout() {
  const { t } = useTranslation("dashboard");
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const exhibitorQuery = useExhibitorProfile();
  const exhibitor = exhibitorQuery.data?.data;
  const avatarUrl = useMemo(() => {
    return resolveMediaUrl(exhibitor?.avatar ?? null);
  }, [exhibitor?.avatar]);

  const [prevAvatarUrl, setPrevAvatarUrl] = useState(avatarUrl);
  if (prevAvatarUrl !== avatarUrl) {
    setPrevAvatarUrl(avatarUrl);
    setAvatarError(false);
  }

  const accountName =
    exhibitor?.name?.trim() || user?.name?.trim() || t("account.fallbackName");

  const initials = useMemo(() => getInitials(accountName), [accountName]);
  const activeItem =
    navigationItems.find((item) =>
      item.id === "dashboard"
        ? location.pathname === item.path
        : location.pathname.startsWith(item.path),
    ) ?? navigationItems[0];

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
    logoutMutation.reset();
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__brand">
          <img alt={t("branding.logoAlt")} src={logo} />
          <div>
            <strong>{t("branding.name")}</strong>
            <span>{t("branding.portal")}</span>
          </div>
        </div>

        <div className="dashboard-sidebar__navigation">
          <p className="dashboard-sidebar__menu-label">{t("menuLabel")}</p>
          <nav aria-label={t("navigation.aria")}>
            {navigationItems.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  `dashboard-sidebar__link${
                    isActive ? " dashboard-sidebar__link--active" : ""
                  }`
                }
                end={item.id === "dashboard"}
                key={item.id}
                to={item.path}
              >
                <HugeiconsIcon
                  color="currentColor"
                  icon={item.icon}
                  size={16}
                  strokeWidth={1.8}
                />
                <span>{t(`navigation.${item.id}`)}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="dashboard-sidebar__account">
          <AccountMenu
            accountName={accountName}
            avatarError={avatarError}
            avatarUrl={avatarUrl}
            initials={initials}
            onAvatarError={() => setAvatarError(true)}
          />
          <button
            aria-label={t("account.logout")}
            className="dashboard-sidebar__logout"
            onClick={handleLogout}
            type="button"
          >
            <HugeiconsIcon
              color="currentColor"
              icon={Logout03Icon}
              size={14}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </aside>

      <main className="dashboard-layout__content">
        <header className="dashboard-header">
          <div className="dashboard-header__breadcrumb">
            <NavLink to="/dashboard">{t("header.dashboard")}</NavLink>
            <HugeiconsIcon
              color="currentColor"
              icon={ArrowRight01Icon}
              size={12}
              strokeWidth={1.8}
            />
            <span aria-current="page">
              {t(`header.pages.${activeItem.id}`)}
            </span>
          </div>

          <div className="dashboard-header__actions">
            <NotificationHeaderMenu />
            <NavLink
              aria-label={accountName}
              className="dashboard-header__avatar"
              to="/dashboard/profile"
            >
              {avatarUrl && !avatarError ? (
                <img
                  alt={accountName}
                  className="dashboard-sidebar__avatar-img"
                  onError={() => setAvatarError(true)}
                  src={avatarUrl}
                />
              ) : (
                initials
              )}
            </NavLink>
          </div>
        </header>
        <div className="dashboard-layout__body">
          <Outlet />
        </div>
      </main>
      <LogoutDialog
        errorMessage={logoutMutation.errorMessage}
        isPending={logoutMutation.isPending}
        onCancel={() => {
          setIsLogoutDialogOpen(false);
          logoutMutation.reset();
        }}
        onConfirm={logoutMutation.logout}
        open={isLogoutDialogOpen}
      />
    </div>
  );
}
