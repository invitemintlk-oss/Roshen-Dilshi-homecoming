// All invitation content lives here: edit this file to customise the site.

export const wedding = {
  partner1: "Cheshan",
  partner2: "Chalaki",
  namesSi: "චෙශාන් & චාලකි",
  monogram: ["C", "C"] as const,

  // Public address of the site, used for guest links and link previews.
  // Leave empty to use whatever domain the admin page is opened on.
  baseUrl: "https://cheshan-chalaki-homecoming.vercel.app",

  eventName: "Homecoming",
  dateShort: "23 . 01 . 27",
  dateLong: "23 January 2027",
  dateSi: "2027 ජනවාරි 23",
  weekday: "Saturday",
  dateParts: ["23", "Jan", "2027"] as const, // big date in the hero
  timeLabel: "10:00 AM", // shown on the venue card as "from 10:00 AM"; empty hides it
  // Countdown target and calendar entry
  start: "2027-01-23T10:00:00+05:30",
  end: "2027-01-23T16:30:00+05:30",

  parents: [
    // Entries left empty are hidden on the site
    { label: "Cheshan's parents", names: "දිවා ප්‍රිතීසිරි මලවිආරච්චී / කාන්ති සුධර්මා" },
    { label: "Chalaki's parents", names: "නිමල් දයාරත්න / චන්දිමා උදයංගිකා" },
  ],

  venue: {
    name: "Lake Edge Holiday Inn",
    area: "Tissamaharama",
    areaSi: "තිස්සමහාරාම",
    address: "Tissamaharama, Sri Lanka",
    mapQuery: "Lake Edge Holiday Inn, Tissamaharama, Sri Lanka",
  },

  // Programme, shown as a timeline. Leave time empty until it is confirmed.
  events: [
    { title: "Start", time: "10:00 AM", icon: "pin", note: "ආරම්භය" },
    { title: "Cocktail Hour", time: "12:00 PM", icon: "glass", note: "කොක්ටේල් පැය" },
    { title: "Lunch", time: "12:30 PM", icon: "utensils", note: "දිවා භෝජනය" },
    { title: "End", time: "4:30 PM", icon: "heart", note: "අවසානය" },
  ],

  contacts: [
    { label: "Cheshan · 071 248 3393", href: "tel:+94712483393", whatsapp: false },
    { label: "Chalaki · 071 524 4018", href: "tel:+94715244018", whatsapp: false },
  ] as { label: string; href: string; whatsapp: boolean }[],

  // Dress code card in "The day". Leave colors empty to hide the card.
  dressCode: {
    title: "Our theme colours",
    note: "",
    colors: [] as { name: string; hex: string }[],
  },

  maxGuests: 6,

  // Shown on the RSVP card as "Kindly respond by ...". Leave empty for "at your earliest convenience".
  rsvpBy: "",

  // Google Apps Script web app that saves RSVPs to this couple's sheet (google-apps-script/Code.gs).
  // The RSVP_SCRIPT_URL environment variable overrides this.
  rsvpScriptUrl: "https://script.google.com/macros/s/AKfycbxZpHV-IRjStWzLGzbbR7iUDbLpNuwK0LjaHG1NgUyqkJ3jzDJK4PBeEYGxuHwUUXL7_A/exec",
};

export const coupleNames = `${wedding.partner1} & ${wedding.partner2}`;

// Link-preview image for WhatsApp, Facebook, etc.
export const ogImage = { url: "/assets/og-homecoming.jpg", width: 1200, height: 1200, alt: `${coupleNames} · ${wedding.eventName}` };

export const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(wedding.venue.mapQuery);

export const mapsEmbed =
  "https://maps.google.com/maps?q=" + encodeURIComponent(wedding.venue.mapQuery) + "&z=14&output=embed";
