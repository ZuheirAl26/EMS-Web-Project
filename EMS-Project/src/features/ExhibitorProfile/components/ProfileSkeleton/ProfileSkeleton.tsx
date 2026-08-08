import { useTranslation } from "react-i18next";
import { Skeleton } from "../../../../components";
import "./ProfileSkeleton.scss";

const ACCOUNT_FIELD_KEYS = [
  "fullName",
  "role",
  "companyName",
  "businessSector",
  "location",
  "phone",
  "email",
  "yearFounded",
] as const;

export function ProfileSkeleton() {
  const { t } = useTranslation("dashboard");

  return (
    <div className="exhibitor-profile__layout profile-skeleton" role="status">
      <span className="profile-skeleton__sr-only">{t("profile.loading")}</span>

      <aside aria-hidden="true" className="profile-sidebar-card">
        <div className="profile-sidebar-card__identity">
          <div className="profile-sidebar-card__banner" />
          <div className="profile-sidebar-card__avatar profile-sidebar-card__avatar--skeleton" />
          <h2>
            <Skeleton height={16} width={120} />
          </h2>
          <p>
            <Skeleton height={11} width={70} />
          </p>
          <strong>
            <Skeleton height={12} width={100} />
          </strong>
        </div>

        <div className="active-company-selector">
          <h3>
            <Skeleton height={9} width={90} />
          </h3>
          <Skeleton borderRadius="var(--radius-2xl)" height={56} />
        </div>

        <section className="profile-sidebar-card__logo">
          <h3>
            <Skeleton height={9} width={90} />
          </h3>
          <div>
            <Skeleton borderRadius="var(--radius-xl)" height={64} width={64} />
          </div>
        </section>

        <dl className="profile-sidebar-card__summary">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <dt>
                <Skeleton height={11} width={80} />
              </dt>
              <dd>
                <Skeleton height={11} width={40} />
              </dd>
            </div>
          ))}
        </dl>
      </aside>

      <div aria-hidden="true" className="exhibitor-profile__details">
        <section className="profile-account-information">
          <h2>
            <Skeleton height={13} width={140} />
          </h2>
          <dl>
            {ACCOUNT_FIELD_KEYS.map((key) => (
              <div key={key}>
                <dt>{t(`profile.fields.${key}`)}</dt>
                <dd>
                  <Skeleton height={12} />
                </dd>
              </div>
            ))}
            <div className="profile-account-information__wide">
              <dt>{t("profile.fields.website")}</dt>
              <dd>
                <Skeleton height={12} />
              </dd>
            </div>
          </dl>
        </section>

        <section className="profile-company-about">
          <h2>
            <Skeleton height={13} width={100} />
          </h2>
          <p>
            <Skeleton height={13} />
          </p>
          <div className="profile-company-about__location">
            <span />
            <div>
              <Skeleton height={12} width={100} />
              <Skeleton height={10} width={140} />
            </div>
          </div>
        </section>

        <section className="profile-social-links">
          <h2>
            <Skeleton height={13} width={110} />
          </h2>
          <div className="profile-social-links__grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                borderRadius="var(--radius-2xl)"
                height={96}
                key={index}
              />
            ))}
          </div>
        </section>

        <section className="profile-company-media">
          <h2>
            <Skeleton height={13} width={90} />
          </h2>
          <p>
            <Skeleton height={11} width={200} />
          </p>
          <div className="profile-company-media__grid">
            <Skeleton borderRadius="var(--radius-2xl)" height={160} />
            <Skeleton borderRadius="var(--radius-2xl)" height={160} />
          </div>
        </section>
      </div>
    </div>
  );
}
