import {
  Building03Icon,
  Mail01Icon,
  SentIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useMyBooths } from "../../../MyBooths/hooks/useMyBooths";
import "./InvitePage.scss";

type InviteRole = "boothManager" | "companyManager";

const REFERENCE_TEAM = [
  { email: "ahmad@levanttech.com", initials: "AA", name: "Ahmad Al-Khatib" },
  { email: "nour@levanttech.com", initials: "NK", name: "Nour Kassem" },
  { email: "omar@levanttech.com", initials: "OH", name: "Omar Halabi" },
] as const;

export function InvitePage() {
  const { t } = useTranslation("dashboard");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole | null>(null);
  const [boothId, setBoothId] = useState("");
  const myBoothsQuery = useMyBooths(1);

  const booths = useMemo(() => {
    return (myBoothsQuery.data?.data.data ?? []).filter(
      (booth) => booth.status !== null,
    );
  }, [myBoothsQuery.data?.data.data]);

  const handleRoleChange = (nextRole: InviteRole) => {
    setRole(nextRole);

    if (nextRole !== "boothManager") {
      setBoothId("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section aria-labelledby="invite-page-title" className="invite-page">
      <div className="invite-page__intro">
                <p className="invite-page__eyebrow"><span>{t("navigation.dashboard")}</span><span aria-hidden="true">/</span><strong>{t("invite.title")}</strong></p>
        <h1 id="invite-page-title">{t("invite.title")}</h1>
        <p>{t("invite.description")}</p>
      </div>

      <div className="invite-page__grid">
        <form className="invite-page__form" onSubmit={handleSubmit}>
          <div className="invite-page__form-heading">
            <h2>{t("invite.form.title")}</h2>
          </div>

          <label className="invite-page__field" htmlFor="invite-email">
            <span>{t("invite.form.email")}</span>
            <div className="invite-page__input-wrap">
              <HugeiconsIcon
                aria-hidden="true"
                icon={Mail01Icon}
                size={17}
                strokeWidth={1.8}
              />
              <input
                autoComplete="email"
                id="invite-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("invite.form.emailPlaceholder")}
                type="email"
                value={email}
              />
            </div>
          </label>

          <fieldset className="invite-page__roles">
            <legend>{t("invite.form.role")}</legend>
            <div>
              <button
                aria-pressed={role === "boothManager"}
                className="invite-page__role-card"
                onClick={() => handleRoleChange("boothManager")}
                type="button"
              >
                <span className="invite-page__role-icon" aria-hidden="true">
                  <HugeiconsIcon
                    icon={Building03Icon}
                    size={18}
                    strokeWidth={1.8}
                  />
                </span>
                <span>
                  <strong>{t("invite.roles.boothManager.title")}</strong>
                  <small>{t("invite.roles.boothManager.description")}</small>
                </span>
              </button>

              <button
                aria-pressed={role === "companyManager"}
                className="invite-page__role-card"
                onClick={() => handleRoleChange("companyManager")}
                type="button"
              >
                <span className="invite-page__role-icon" aria-hidden="true">
                  <HugeiconsIcon
                    icon={UserAdd01Icon}
                    size={18}
                    strokeWidth={1.8}
                  />
                </span>
                <span>
                  <strong>{t("invite.roles.companyManager.title")}</strong>
                  <small>{t("invite.roles.companyManager.description")}</small>
                </span>
              </button>
            </div>
          </fieldset>

          {role ? (
            <label className="invite-page__field" htmlFor="invite-booth">
              <span>{t("invite.form.assignBooth")}</span>
              <select
                id="invite-booth"
                onChange={(event) => setBoothId(event.target.value)}
                value={boothId}
              >
                <option value="">
                  {myBoothsQuery.isPending
                    ? t("invite.form.loadingBooths")
                    : t("invite.form.boothPlaceholder")}
                </option>
                {booths.map((booth) => (
                  <option key={booth.id} value={booth.id}>
                    {t("invite.form.boothOption", {
                      hall: booth.hall_id?.number ?? "—",
                      number: booth.number,
                    })}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <button className="invite-page__submit" type="submit">
            <HugeiconsIcon
              aria-hidden="true"
              icon={SentIcon}
              size={17}
              strokeWidth={1.8}
            />
            <span>{t("invite.form.send")}</span>
          </button>
        </form>

        <aside
          aria-label={t("invite.currentTeam.aria")}
          className="invite-page__team"
        >
          <div className="invite-page__team-heading">
            <h2>{t("invite.currentTeam.title", { count: REFERENCE_TEAM.length })}</h2>
          </div>
          <ul>
            {REFERENCE_TEAM.map((member) => (
              <li key={member.email}>
                <span aria-hidden="true">{member.initials}</span>
                <div>
                  <strong>{member.name}</strong>
                  <small>{member.email}</small>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
