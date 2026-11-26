// All invitation content lives here: edit this file to customise the site.

export const wedding = {
  partner1: "Roshen",
  partner2: "Dilshi",
  monogram: ["R", "D"] as const,

  // Public address of the site, used for guest links and link previews.
  // Leave empty to use whatever domain the admin page is opened on.
  baseUrl: "",

  eventName: "Homecoming",
  dateShort: "29 . 08 . 27",
  dateLong: "29 August 2027",
  weekday: "Sunday",
  dateParts: ["29", "Aug", "2027"] as const, // big date in the hero
  timeLabel: "6:30 PM", // shown on the venue card as "from 6:30 PM"; empty hides it
  // Countdown target and calendar entry
  start: "2027-08-29T18:30:00+05:30",
  end: "2027-08-29T23:30:00+05:30",

  parents: [
    // Entries left empty are hidden on the site
    { label: "With the blessings of", names: "Ananda Samarathunga & Renuka Gamage" },
  ],

  venue: {
    name: "Hilton Colombo",
    area: "Colombo",
    address: "2 Sir Chittampalam A Gardiner Mawatha, Colombo 00200, Sri Lanka",
    mapQuery: "Hilton Colombo, 2 Sir Chittampalam A Gardiner Mawatha, Colombo 00200, Sri Lanka",
  },

  // Programme, shown as a timeline. Leave time empty until it is confirmed.
  events: [
    { title: "Welcome & Arrival", time: "6:30 PM", icon: "pin", note: "Drinks and a warm welcome" },
    { title: "Grand Entrance", time: "", icon: "rings", note: "The bride and groom arrive" },
    { title: "Bollywood Night", time: "", icon: "music", note: "Music, dance and celebration" },
    { title: "Dinner", time: "", icon: "utensils", note: "A royal feast" },
  ],

  // Shown at the foot of the page. Add the couple's numbers here, e.g.
  // { label: "Roshen · 07X XXX XXXX", href: "tel:+947XXXXXXXX", whatsapp: false }
  contacts: [] as { label: string; href: string; whatsapp: boolean }[],

  // Dress code card. Leave colors empty to hide the card.
  dressCode: {
    title: "Bollywood Glam",
    note: "Dress in rich Indian colours: sarees, lehengas, sherwanis and kurtas are all welcome.",
    colors: [
      { name: "Peacock", hex: "#0F5A5C" },
      { name: "Emerald", hex: "#14472F" },
      { name: "Burgundy", hex: "#6E1426" },
      { name: "Maroon", hex: "#4A0E17" },
      { name: "Gold", hex: "#C9A04E" },
    ] as { name: string; hex: string }[],
  },

  maxGuests: 6,

  // Shown on the RSVP card as "Kindly respond by ...". Leave empty for "at your earliest convenience".
  rsvpBy: "",

  // Google Apps Script web app that saves RSVPs to this couple's sheet (google-apps-script/Code.gs).
  // The RSVP_SCRIPT_URL environment variable overrides this.
  rsvpScriptUrl: "",
};

export const coupleNames = `${wedding.partner1} & ${wedding.partner2}`;

// Link-preview image for WhatsApp, Facebook, etc.
export const ogImage = { url: "/assets/og-roshen-dilshi.jpg", width: 1200, height: 1200, alt: `${coupleNames} · ${wedding.eventName}` };

export const mapsLink =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(wedding.venue.mapQuery);

export const mapsEmbed =
  "https://maps.google.com/maps?q=" + encodeURIComponent(wedding.venue.mapQuery) + "&z=15&output=embed";
