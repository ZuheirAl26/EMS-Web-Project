import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components";
import { metrics } from "../../pages/landingData";
import { useNearestEvents } from "../../../Events/hooks/useNearestEvents";
import type { ExhibitorEvent } from "../../../Events/types/eventType";
import "./ExhibitorSection.scss";

const FALLBACK_NEAREST_EVENTS: ExhibitorEvent[] = [
  {
    id: 3,
    title: "The Future of Publishing",
    event_hall_id: 3,
    type: "conference",
    status: "approved",
    start_at: "2026-08-23T11:00:00.000000Z",
    end_at: "2026-08-23T14:00:00.000000Z",
    duration: 3,
    description:
      "A conference exploring digital transformation in publishing and exhibitions.",
    qr_token: null,
    qr_code_url: "/storage/92/E-SEED-002.svg",
    eventable: {
      id: 1,
      name: "Dar Al feker",
      business_sector: "culture",
      phone: "+963112223334",
      description: "Leading readers for reading.",
      year_founded: 2015,
      social_links: {
        website: "https://dar.com",
        linkedin: "https://linkedin.com/company/dar",
      },
      headquarters_lat: 33.513807,
      headquarters_lng: 36.276528,
      status: "approved",
    },
    speakers: [
      { id: 4, name: "Fawzy" },
      { id: 5, name: "Elcoach" },
    ],
    average_rating: 3.77,
    qr_scans_count: 19,
    reviews_count: 0,
    saved_count: 16,
    leads_count: 19,
    created_at: "2026-08-20T13:32:48.000000Z",
    logo: "/storage/93/RBCs.png",
  },
  {
    id: 27,
    title: "Startup Weekend Syria: Build, Validate and Pitch",
    event_hall_id: 8,
    type: "workshop",
    status: "approved",
    start_at: "2026-08-24T09:30:00.000000Z",
    end_at: "2026-08-24T12:30:00.000000Z",
    duration: 3,
    description:
      "A practical exhibition session designed for Syrian companies, public institutions, founders, students, and investors to exchange applied solutions and partnership opportunities.",
    qr_token: null,
    qr_code_url: "/storage/542/E-27-RwK0tfML7Q.svg",
    eventable: {
      id: 26,
      name: "Hamza Hourani",
      email: "hamza.hourani@expanded-tech.test",
      avatar: null,
    },
    speakers: [
      { id: 71, name: "Hamza Hourani" },
      { id: 72, name: "Bashar Saaduddin Al Jbawi" },
      { id: 73, name: "Abdel Malek Al-Mouzayen" },
    ],
    average_rating: 4.03,
    qr_scans_count: 17,
    reviews_count: 0,
    saved_count: 13,
    leads_count: 17,
    created_at: "2026-08-20T13:34:57.000000Z",
    logo: "/storage/543/event-22.jpg",
  },
  {
    id: 6,
    title: "Syria Startup Agenda: From Idea to Investable Company",
    event_hall_id: 6,
    type: "conference",
    status: "approved",
    start_at: "2026-08-24T10:00:00.000000Z",
    end_at: "2026-08-24T12:00:00.000000Z",
    duration: 2,
    description:
      "A practical exhibition session designed for Syrian companies, public institutions, founders, students, and investors to exchange applied solutions and partnership opportunities.",
    qr_token: null,
    qr_code_url: "/storage/500/E-6-DM2EFVRtIf.svg",
    eventable: {
      id: 30,
      name: "TechTown",
      business_sector: "tech",
      phone: "+963 000 000 000",
      description:
        "A Syrian digital innovation and entrepreneurship hub connected with technology ecosystem development.",
      year_founded: 2018,
      social_links: {
        website: "https://techtown.org",
        linkedin: "https://www.linkedin.com/company/techtown",
      },
      headquarters_lat: 0,
      headquarters_lng: 0,
      status: "approved",
    },
    speakers: [
      { id: 8, name: "Abdul-Salam Haykal" },
      { id: 9, name: "Sinan Hatahet" },
      { id: 10, name: "Talal al-Hilali" },
    ],
    average_rating: 4.03,
    qr_scans_count: 22,
    reviews_count: 0,
    saved_count: 18,
    leads_count: 22,
    created_at: "2026-08-20T13:34:48.000000Z",
    logo: "/storage/501/event-01.jpg",
  },
  {
    id: 13,
    title: "Mobility, Logistics and the Digital Transport Transition",
    event_hall_id: 9,
    type: "conference",
    status: "approved",
    start_at: "2026-08-24T11:30:00.000000Z",
    end_at: "2026-08-24T13:30:00.000000Z",
    duration: 2,
    description:
      "A practical exhibition session addressing route optimisation, digital payments, logistics data, and entrepreneurship in transport.",
    qr_token: null,
    qr_code_url: "/storage/514/E-13-1AFAVffSIL.svg",
    eventable: {
      id: 33,
      name: "Wusool",
      business_sector: "tech",
    },
    speakers: [
      { id: 29, name: "Mohammad Alammar" },
      { id: 30, name: "Abdul-Salam Haykal" },
      { id: 31, name: "Mohammad Yaser Bernieh" },
    ],
    average_rating: 3.95,
    qr_scans_count: 22,
    reviews_count: 0,
    saved_count: 9,
    leads_count: 22,
    created_at: "2026-08-20T13:34:51.000000Z",
    logo: "/storage/515/event-08.jpg",
  },
  {
    id: 20,
    title: "E-Commerce, Marketplaces and Consumer Trust",
    event_hall_id: 1,
    type: "lecture",
    status: "approved",
    start_at: "2026-08-24T14:30:00.000000Z",
    end_at: "2026-08-24T16:30:00.000000Z",
    duration: 2,
    description:
      "A marketplace session on fulfilment, customer experience, seller enablement, payments, and expanding digital commerce.",
    qr_token: null,
    qr_code_url: "/storage/528/E-20-RoLWQxyWp5.svg",
    eventable: {
      id: 49,
      name: "noon",
      business_sector: "tech",
    },
    speakers: [
      { id: 50, name: "Nizar Zarka" },
      { id: 51, name: "Ronaldo Mouchawar" },
      { id: 52, name: "Mohammad Alammar" },
    ],
    average_rating: 4,
    qr_scans_count: 26,
    reviews_count: 0,
    saved_count: 11,
    leads_count: 26,
    created_at: "2026-08-20T13:34:54.000000Z",
    logo: "/storage/529/event-15.jpg",
  },
  {
    id: 7,
    title: "Public–Private Dialogue on Syria’s Digital Economy",
    event_hall_id: 3,
    type: "conference",
    status: "approved",
    start_at: "2026-08-25T14:00:00.000000Z",
    end_at: "2026-08-25T16:00:00.000000Z",
    duration: 2,
    description:
      "A policy dialogue on predictable regulation, digital services, investment climate, and cooperation between ministries and technology providers.",
    qr_token: null,
    qr_code_url: "/storage/502/E-7-gfxdmq7NJy.svg",
    eventable: {
      id: 13,
      name: "Syria Smart",
      business_sector: "tech",
    },
    speakers: [
      { id: 11, name: "Abdul-Salam Haykal" },
      { id: 12, name: "Mohammad Nidal al-Shaar" },
      { id: 13, name: "Anas Ajaj" },
    ],
    average_rating: 3.95,
    qr_scans_count: 21,
    reviews_count: 0,
    saved_count: 12,
    leads_count: 21,
    created_at: "2026-08-20T13:34:49.000000Z",
    logo: "/storage/503/event-02.jpg",
  },
  {
    id: 28,
    title: "Technology Export Readiness for Syrian SMEs",
    event_hall_id: 1,
    type: "conference",
    status: "approved",
    start_at: "2026-08-25T14:00:00.000000Z",
    end_at: "2026-08-25T16:00:00.000000Z",
    duration: 2,
    description:
      "A founder-led session on export positioning, service delivery, international sales, data protection, and repeatable technology operations.",
    qr_token: null,
    qr_code_url: "/storage/544/E-28-ounwBQD8ZV.svg",
    eventable: {
      id: 22,
      name: "Sinan Hatahet",
    },
    speakers: [
      { id: 74, name: "Sinan Hatahet" },
      { id: 75, name: "Waseem AlShikh" },
      { id: 76, name: "MHD Yasser Kaziz" },
    ],
    average_rating: 3.95,
    qr_scans_count: 22,
    reviews_count: 0,
    saved_count: 18,
    leads_count: 22,
    created_at: "2026-08-20T13:34:57.000000Z",
    logo: "/storage/545/event-23.jpg",
  },
  {
    id: 14,
    title: "Syria Engineering Talent and the Future of Work",
    event_hall_id: 6,
    type: "conference",
    status: "approved",
    start_at: "2026-08-25T15:00:00.000000Z",
    end_at: "2026-08-25T17:00:00.000000Z",
    duration: 2,
    description:
      "A talent forum on engineering careers, remote work, diaspora collaboration, and building export-ready technology teams.",
    qr_token: null,
    qr_code_url: "/storage/516/E-14-ROKhK2NtOy.svg",
    eventable: {
      id: 49,
      name: "noon",
    },
    speakers: [
      { id: 32, name: "Nizar Zarka" },
      { id: 33, name: "Sami Hijazi" },
      { id: 34, name: "Hamza Hourani" },
    ],
    average_rating: 4,
    qr_scans_count: 25,
    reviews_count: 0,
    saved_count: 14,
    leads_count: 25,
    created_at: "2026-08-20T13:34:52.000000Z",
    logo: "/storage/517/event-09.jpg",
  },
  {
    id: 21,
    title: "Digital Payments and the New Consumer Journey",
    event_hall_id: 2,
    type: "lecture",
    status: "approved",
    start_at: "2026-08-25T17:00:00.000000Z",
    end_at: "2026-08-25T18:00:00.000000Z",
    duration: 1,
    description:
      "A product talk on flexible payments, consumer behaviour, merchant tools, and responsible financial technology.",
    qr_token: null,
    qr_code_url: "/storage/530/E-21-vWAvnSE96U.svg",
    eventable: {
      id: 48,
      name: "Tabby",
    },
    speakers: [
      { id: 53, name: "Hosam Arab" },
      { id: 54, name: "Abdulmajeed Alsukhan" },
      { id: 55, name: "Amer Baroudi" },
    ],
    average_rating: 4.03,
    qr_scans_count: 20,
    reviews_count: 0,
    saved_count: 16,
    leads_count: 20,
    created_at: "2026-08-20T13:34:55.000000Z",
    logo: "/storage/531/event-16.jpg",
  },
  {
    id: 8,
    title: "Digital Wallets, Trust and Financial Inclusion",
    event_hall_id: 2,
    type: "workshop",
    status: "approved",
    start_at: "2026-08-26T11:00:00.000000Z",
    end_at: "2026-08-26T13:00:00.000000Z",
    duration: 2,
    description:
      "A fintech workshop covering digital-wallet adoption, customer trust, payment infrastructure, and responsible financial access in Syria.",
    qr_token: null,
    qr_code_url: "/storage/504/E-8-i5ucdbATu0.svg",
    eventable: {
      id: 15,
      name: "Sham Cash",
    },
    speakers: [
      { id: 14, name: "Mohammad Fawzy Sukkar" },
      { id: 15, name: "Hosam Arab" },
      { id: 16, name: "Amer Baroudi" },
    ],
    average_rating: 4,
    qr_scans_count: 24,
    reviews_count: 0,
    saved_count: 17,
    leads_count: 24,
    created_at: "2026-08-20T13:34:49.000000Z",
    logo: "/storage/505/event-03.png",
  },
];

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  } catch {
    return "";
  }
}

function formatDate(isoString: string, locale: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(locale === "ar" ? "ar-SY" : "en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function ExhibitionSection() {
  const { t, i18n } = useTranslation("landing");
  const [showAllEvents, setShowAllEvents] = useState(false);

  const { data: nearestResponse } = useNearestEvents();

  const allEvents: ExhibitorEvent[] =
    nearestResponse?.data && nearestResponse.data.length > 0
      ? nearestResponse.data
      : FALLBACK_NEAREST_EVENTS;

  const displayedEvents = showAllEvents ? allEvents : allEvents.slice(0, 3);

  return (
    <section className="exhibition-section" id="exhibition">
      <div className="exhibition-section__shell">
        <div className="exhibition-section__copy">
          <div>
            <p className="exhibition-section__kicker">
              {t("exhibition.eyebrow")}
            </p>
            <h2>{t("exhibition.title")}</h2>
          </div>
          <p className="exhibition-section__text">
            {t("exhibition.description")}
          </p>
          <div className="exhibition-section__metric-grid">
            {metrics.map((metric) => (
              <div className="exhibition-section__metric-card" key={metric.id}>
                <strong>{metric.value}</strong>
                <span>{t(`exhibition.metrics.${metric.id}`)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="exhibition-section__showcase-card">
          <div className="exhibition-section__showcase-stage">
            <div className="exhibition-section__showcase-header">
              <span className="exhibition-section__pill">
                {t("exhibition.schedule")}
              </span>
              <strong>{t("exhibition.hallCount")}</strong>
            </div>

            <div
              className={`exhibition-section__timeline ${
                showAllEvents ? "exhibition-section__timeline--expanded" : ""
              }`}
            >
              {displayedEvents.map((event) => {
                const startTime = formatTime(event.start_at);
                const endTime = formatTime(event.end_at);
                const eventDate = formatDate(event.start_at, i18n.language);

                return (
                  <div className="exhibition-section__timeline-item" key={event.id}>
                    <div className="exhibition-section__time-col">
                      <span className="exhibition-section__time-val">{startTime}</span>
                      {endTime && (
                        <span className="exhibition-section__time-end">{endTime}</span>
                      )}
                      {eventDate && (
                        <span className="exhibition-section__date-tag">{eventDate}</span>
                      )}
                    </div>

                    <div className="exhibition-section__event-content">
                      <div className="exhibition-section__event-meta">
                        <span className="exhibition-section__hall-badge">
                          {t("exhibition.hall")} {event.event_hall_id}
                        </span>
                        <span className="exhibition-section__type-badge">
                          {event.type}
                        </span>
                      </div>

                      <h3>{event.title}</h3>
                      <p>{event.description}</p>

                      {event.speakers && event.speakers.length > 0 && (
                        <div className="exhibition-section__speakers">
                          <span className="exhibition-section__speakers-label">
                            {t("exhibition.speakers")}:
                          </span>{" "}
                          {event.speakers.map((s) => s.name).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => setShowAllEvents((prev) => !prev)}
              type="button"
            >
              {showAllEvents
                ? t("exhibition.showLess")
                : t("exhibition.viewSchedule")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
