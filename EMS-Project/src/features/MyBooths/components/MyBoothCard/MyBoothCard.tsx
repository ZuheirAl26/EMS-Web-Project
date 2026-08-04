import type { MyBoothCardProps } from "../../types/myBoothsType";
import { BoothDetailsCard } from "../BoothDetailsCard/BoothDetailsCard";
import { BoothQrCard } from "../BoothQrCard/BoothQrCard";
import "./MyBoothCard.scss";

export function MyBoothCard({ booth }: MyBoothCardProps) {
  return (
    <article className="my-booth-card">
      <BoothDetailsCard booth={booth} />
      <BoothQrCard
        boothNumber={booth.number}
        qrToken={booth.qr_token}
        qrUrl={booth.qr_token_url ?? null}
      />
    </article>
  );
}
