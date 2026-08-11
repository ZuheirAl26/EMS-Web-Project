import { useTranslation } from "react-i18next";
import { Skeleton } from "../../../../components";
import "./MyBoothsSkeleton.scss";

const PLACEHOLDER_CARDS = [0, 1];

export function MyBoothsSkeleton() {
  const { t } = useTranslation("dashboard");

  return (
    <div className="my-booths-skeleton" role="status">
      <span className="my-booths-skeleton__sr-only">
        {t("myBooths.loading")}
      </span>
      {PLACEHOLDER_CARDS.map((index) => (
        <article aria-hidden="true" className="my-booths-skeleton__card" key={index}>
          <section className="my-booths-skeleton__details">
            <div className="my-booths-skeleton__heading">
              <Skeleton height={18} width="36%" />
              <Skeleton height={24} width={82} />
            </div>
            <div className="my-booths-skeleton__rows">
              <Skeleton height={13} />
              <Skeleton height={13} />
              <Skeleton height={13} />
              <Skeleton height={13} />
              <Skeleton height={13} />
            </div>
            <Skeleton height={13} width={130} />
            <div className="my-booths-skeleton__services">
              <Skeleton borderRadius="var(--radius-pill)" height={28} width={110} />
              <Skeleton borderRadius="var(--radius-pill)" height={28} width={96} />
              <Skeleton borderRadius="var(--radius-pill)" height={28} width={118} />
            </div>
          </section>
          <section className="my-booths-skeleton__qr">
            <Skeleton height={18} width={100} />
            <Skeleton height={12} width="70%" />
            <Skeleton borderRadius="var(--radius-2xl)" height={192} width={192} />
            <Skeleton height={12} width="55%" />
            <div>
              <Skeleton borderRadius="var(--radius-lg)" height={36} width={80} />
              <Skeleton borderRadius="var(--radius-lg)" height={36} width={128} />
            </div>
          </section>
        </article>
      ))}
    </div>
  );
}
