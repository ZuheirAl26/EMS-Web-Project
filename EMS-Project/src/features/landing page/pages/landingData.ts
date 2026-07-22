export const navLinks = [
  "Home",
  "Exhibition",
  "Floor Map",
  "Create Plan",
  "Features",
  "Blog",
  "Contact",
];

export const metrics = [
  ["500+", "Exhibitors"],
  ["12,000+", "Expected Visitors"],
  ["3", "Event Halls"],
  ["2025", "Startup Pitch Showcase"],
];

export const halls = [
  [
    "Hall A",
    "A-01",
    "A-02",
    "A-03",
    "A-04",
    "A-05",
    "A-06",
    "A-07",
    "A-08",
    "A-09",
  ],
  [
    "Hall B",
    "B-01",
    "B-02",
    "B-03",
    "B-04",
    "B-05",
    "B-06",
    "B-07",
    "B-08",
    "B-09",
  ],
];

export const features = [
  {
    icon: "calendar",
    text: "Manage your booth setup, services, and booking requests end-to-end.",
    title: "Pavilion Management",
  },
  {
    icon: "qr",
    text: "Capture visitor leads via QR scan and export to your CRM in one click.",
    title: "Lead Retrieval",
  },
  {
    icon: "map",
    text: "Publish real-time navigable maps that visitors browse on any device.",
    title: "Interactive Floor Maps",
  },
  {
    icon: "users",
    text: "Assign roles, manage staff access, and coordinate your event-day team.",
    title: "Team Coordination",
  },
  {
    icon: "bell",
    text: "Push announcements to all exhibitors and visitors instantly.",
    title: "Announcements",
  },
  {
    icon: "star",
    text: "Track profile views, lead scores, and visitor engagement in real-time.",
    title: "Engagement Reports",
  },
] as const;

export const appFeatures = [
  {
    icon: "qr",
    text: "Scan any booth QR code to instantly save contact info and product catalogs.",
    title: "Scan & Save Exhibitors",
  },
  {
    icon: "map",
    text: "Build a personal schedule, mark booths to visit, and navigate the halls with an interactive map.",
    title: "Plan Your Visit",
  },
  {
    icon: "bell",
    text: "Get real-time notifications about presentations, networking sessions, and special announcements.",
    title: "Live Event Alerts",
  },
  {
    icon: "star",
    text: "Leave feedback on exhibitors you visited and discover top-rated booths from other attendees.",
    title: "Rate & Review",
  },
] as const;

export const posts = [
  {
    text: "Learn how top exhibitors generate 3x more leads by combining digital follow-up with engaging live demos.",
    title: "5 Ways to Maximize Booth ROI at Trade Shows",
  },
  {
    text: "AI-powered badge scanning and sentiment analysis are transforming how exhibitors qualify leads in real time.",
    title: "How AI is Changing Lead Capture at Events",
  },
  {
    text: "From media uploads to service requests, a step-by-step walkthrough of the ExhibitorHub portal.",
    title: "The Complete Guide to Pavilion Setup at TechConnect 2025",
  },
];

export type LandingIconName =
  | (typeof features)[number]["icon"]
  | "apple"
  | "ticket";
