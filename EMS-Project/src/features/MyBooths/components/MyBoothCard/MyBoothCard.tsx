import type { MyBoothCardProps } from "../../types/myBoothsType";
import { BoothDetailsCard } from "../BoothDetailsCard/BoothDetailsCard";
import { BoothQrCard } from "../BoothQrCard/BoothQrCard";
import "./MyBoothCard.scss";

export function MyBoothCard({ booth }: MyBoothCardProps) {
  const boothStatus = booth.status ?? (booth.is_booked ? "approved" : "pending");

  return (
    <article
      className={`my-booth-card${
        boothStatus === "rejected" ? " my-booth-card--rejected" : ""
      }`}
    >
      <BoothDetailsCard booth={booth} />
      <BoothQrCard
        boothNumber={booth.number}
        qrToken={booth.qr_token}
        qrUrl={booth.qr_code_url || null}
      />
    </article>
  );
}
