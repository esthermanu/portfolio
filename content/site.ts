/* =============================================================================
   SITE CONTENT — the only file you need to edit to make this site "real".
   Built from Esther's two résumés. Anything still uncertain is marked ⚠️.
   ============================================================================= */

export const site = {
  /* ✏️ Replace with the real deployed domain before launch (used for SEO tags) */
  url: "https://esthermanu.com",

  name: "Esther Manu",
  initials: "EM",

  role: "Systems Software Engineer",

  /* Rotating line in the hero. Name actual things, not disciplines —
     "Thin-film solar cells" says far more than "Solar Research". */
  disciplinesLabel: "Lately",
  disciplines: [
    "Monitoring 5,000+ devices",
    "Docker build pipelines",
    "Sensor control loops",
    "Real-time sync",
  ],

  location: "Cincinnati, OH",

  availability: { open: true, label: "Open to internships & new grad roles" },

  tagline:
    "Electrical engineering student with hands-on experience in embedded systems, circuit design and test, and software development — control code close to the sensor, pipelines and monitoring close to the server. I build the layer everything else quietly depends on.",

  about: [
    "I’m an electrical engineering student at the University of Cincinnati, and most of what I enjoy sits in the gap between a circuit and the code driving it — instrumenting a prototype, tuning a sensor until the false positives stop, turning raw measurements into something a person can actually read.",
    "That means my week might be solar cell characterisation on an I-V curve tracer, and the next a Flutter app or a React admin panel. I like owning a build end to end: model the part, print it, wire the sensors, write the control logic, then test it until the numbers hold up.",
    "I’m active in IEEE, NSBE, ColorStack, ACM and the Society of Women Engineers, and I volunteer at conferences like MWSCAS. Outside of that I take things apart to see how they were put together.",
  ],

  facts: [
    { label: "Based in", value: "Cincinnati, OH" },
    { label: "Studying", value: "BS Electrical Engineering" },
    { label: "Graduating", value: "May 2028" },
    { label: "GPA", value: "3.6" },
    { label: "Honors", value: "Dean’s List (2×)" },
    { label: "Currently", value: "Solar cell research" },
  ],

  portrait: "/esther-manu.jpg" as string | null,

  email: "manuer@mail.uc.edu",
  socials: [
    { label: "GitHub", handle: "@esthermanu", href: "https://github.com/esthermanu" },
    { label: "LinkedIn", handle: "/in/estmanu", href: "https://linkedin.com/in/estmanu" },
  ],

  /* The hardware/EE résumé. The software one is not used here: it carries
     a phone number, and both this repo and the site are public. */
  resume: "/esther-manu-resume.pdf" as string | null,
};

/* ---------------------------------------------------------------------------
   SKILLS — merged from both résumés, grouped for a systems-software engineer.
   --------------------------------------------------------------------------- */
export const skillGroups = [
  {
    title: "Languages",
    blurb: "From register level up to application code.",
    items: ["Python", "C++", "TypeScript", "Java", "Verilog HDL", "Assembly"],
  },
  {
    title: "Hardware & Test",
    blurb: "Designing, modelling and proving out real hardware.",
    items: [
      "AutoCAD",
      "Arduino",
      "KiCad",
      "LTspice",
      "Multisim",
      "MATLAB",
      "LabVIEW",
      "Soldering",
    ],
  },
  {
    title: "Software & Tools",
    blurb: "The stack behind the apps and pipelines.",
    items: ["React", "Next.js", "Node.js", "Flutter", "Firebase", "Docker", "Git"],
  },
];

export const marqueeSkills = [
  "Python",
  "C++",
  "Arduino",
  "MATLAB",
  "KiCad",
  "AutoCAD",
  "Verilog",
  "LTspice",
  "TypeScript",
  "React",
  "Next.js",
  "Flutter",
  "Firebase",
  "OpenCV",
  "Docker",
];

/* ---------------------------------------------------------------------------
   PROJECTS
   --------------------------------------------------------------------------- */
export type Project = {
  title: string;
  year: string;
  category: string;
  summary: string;
  stack: string[];
  href: string | null;
  repo: string | null;
  /* Still in /public. Doubles as the poster frame when a video is set. */
  image: string | null;
  /* Clip in /public. Plays muted on hover on desktop; tap-to-play on mobile. */
  video?: string | null;
  accent: [string, string];
};

export const projects: Project[] = [
  {
    /* ⚠️ Not on either résumé — written from the photos and the LabVIEW
       diagram (ENED1120). Correct the wording and the year. */
    title: "Line-Following Robot",
    year: "2025",
    category: "Robotics · LEGO EV3 + LabVIEW",
    summary:
      "An autonomous robot that tracks a line using reflected-light sensors, built on the LEGO Mindstorms EV3 platform and programmed in LabVIEW. Two light sensors feed a steering routine driving the left and right motors independently, with a sensitivity threshold tuned so the robot holds the line through curves.",
    stack: ["LEGO EV3", "LabVIEW", "Light sensors", "Motor control"],
    href: null,
    repo: null,
    image: "/projects/ev3-line-follower-poster.jpg",
    video: "/projects/ev3-line-follower.mp4",
    accent: ["#d9a961", "#6b4a1f"],
  },
  {
    /* ⚠️ Paired with the printed-frame photo from your Drive folder — confirm
       it is the same project. Your résumé says AutoCAD; the screenshot in that
       folder shows Tinkercad. */
    title: "Lightweight Drone Frame",
    year: "2025",
    category: "CAD · Agricultural drone",
    summary:
      "A modular agricultural drone airframe designed in AutoCAD to support precision farming through aerial crop monitoring. Structural load analysis and design validation improved flight stability and payload capacity, and an integrated camera and NDVI imaging system captures crop health data so farmers can spot plant stress early.",
    stack: ["AutoCAD", "Python", "OpenCV", "MATLAB"],
    href: null,
    repo: null,
    image: "/projects/quadcopter-print.jpg",
    video: null,
    accent: ["#f07ab0", "#7a2f52"],
  },
  {
    title: "DWIPS — Wearable Safety System",
    year: "2025",
    category: "Embedded · Motion detection",
    summary:
      "A solar-powered wearable that uses motion sensors to detect falls and hazardous movement in real time. Photovoltaic cells feed the sensor and alert system so it runs continuously without battery replacement, and sensor sensitivity was tuned across multiple motion scenarios to cut false positives while keeping detection reliable.",
    stack: ["MPU6050", "Arduino", "KiCad", "MATLAB"],
    href: null,
    repo: null,
    image: null,
    video: null,
    accent: ["#8fa4b8", "#2c3a49"],
  },
  {
    title: "Taste of African Cuisine",
    year: "2026",
    category: "Full-stack · Food ordering platform",
    summary:
      "A Flutter ordering app with real-time meals, cart management and Stripe checkout that cut drop-offs by 35%, plus a rider app using Google Maps routing and live status that improved delivery times by 25%. A Firebase backend keeps orders in sync for 100+ concurrent users, behind a React and TypeScript admin panel.",
    stack: ["Flutter", "Firebase", "React", "TypeScript", "Stripe"],
    href: "https://tasteofafricancuisine.com",
    repo: null,
    image: null,
    video: null,
    accent: ["#c59a7b", "#4a2f24"],
  },
  {
    title: "StudyBridge",
    year: "2025",
    category: "Full-stack · Tutoring platform",
    summary:
      "A tutoring platform built with React, Tailwind CSS and Node/Express that cut student-to-tutor match time by 65% and lifted booking conversions by 28%. Real-time chat over Socket.io delivers 98% of messages in under 200ms, alongside a notes-sharing system with file uploads and read receipts.",
    stack: ["React", "Tailwind CSS", "Node.js", "Express", "Socket.io"],
    href: null,
    repo: null,
    image: null,
    video: null,
    accent: ["#9db89d", "#27382b"],
  },
  {
    title: "Object Detection Pipeline",
    year: "2025",
    category: "Computer vision · Quality inspection",
    summary:
      "A Python computer-vision pipeline that classifies electronic components and flags defective units automatically. Visual feature extraction and statistical analysis surface variation across test batches, and classification was validated against manually labelled sets to improve sorting accuracy and cut manual inspection time.",
    stack: ["Python", "OpenCV", "NumPy", "Pandas"],
    href: null,
    repo: null,
    image: null,
    video: null,
    accent: ["#b58fb5", "#3d2a42"],
  },
];

/* ---------------------------------------------------------------------------
   EXPERIENCE — newest first.
   --------------------------------------------------------------------------- */
export const experience = [
  {
    role: "Undergraduate Research Assistant",
    company: "University of Cincinnati",
    period: "Feb 2026 — Present",
    location: "Cincinnati, OH",
    points: [
      "Researching next-generation solar cells, integrating thin-film materials into prototype devices to improve power conversion efficiency.",
      "Ran functional testing and data collection across 6 prototype iterations on calibrated I-V curve tracers and spectrophotometers, measuring PCE, fill factor and open-circuit voltage.",
      "Benchmarked prototype performance against commercial standards, identifying quality gaps and driving a 24% efficiency improvement.",
    ],
  },
  {
    /* ⚠️ Your software résumé gives no dates for this role — please add them. */
    role: "Student Software Developer",
    company: "UC ITS Web Development Team",
    period: "Dates needed",
    location: "Cincinnati, OH",
    points: [
      "Maintain Srvmon, a mission-critical Next.js and Express platform monitoring 5,000+ classroom technologies and IT assets.",
      "Manage Bitbucket repos and Jenkins pipelines automating Docker builds, testing and deployment, cutting release time from 20 to 12 minutes.",
      "Partnered with server and network engineers to resolve 20+ critical issues including API proxy failures, signage outages and authentication errors.",
    ],
  },
  {
    /* ⚠️ Your software résumé gives no dates for this role — please add them. */
    role: "Web Developer",
    company: "Voice Of God Ministries",
    period: "Dates needed",
    location: "Connecticut",
    points: [
      "Built and launched a church management platform in React and Node.js, automating member, event and donation workflows and cutting manual admin work by 60%.",
      "Added digital outreach features — newsletters, livestreams, sermon archiving — and redesigned the public site, lifting engagement 50%+ and tripling mobile session duration.",
      "Modularised reusable React components, reducing code duplication by 35%.",
    ],
  },
  {
    /* ⚠️ Résumés disagree on the end date: one says Oct 2025, the other Aug 2025. */
    role: "Machine Learning Researcher",
    company: "AI4ALL",
    period: "May 2025 — Oct 2025",
    location: "Remote",
    points: [
      "Built a Naïve Bayes text-classification pipeline in Python to detect phishing emails, extracting word-frequency and weighted-term features from raw text.",
      "Preprocessed 10,000+ emails through tokenisation and stop-word removal, then applied feature selection to reduce dimensionality and improve generalisation.",
      "Tuned smoothing and vocabulary size via cross-validation, reaching 95% accuracy and 92% recall on test data.",
    ],
  },
  {
    role: "Student Assistant",
    company: "University of Cincinnati",
    period: "Jan 2025 — Nov 2025",
    location: "Cincinnati, OH",
    points: [
      "Set up, operated and troubleshot hardware and power conversion equipment during live STEM outreach demonstrations.",
      "Diagnosed and resolved equipment malfunctions in real time to minimise demonstration downtime.",
      "Contributed to university recruitment, with 5 participants enrolling at UC following outreach sessions.",
    ],
  },
];

/* Section order used by the nav and scroll-spy */
export const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;
