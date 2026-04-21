// UI strings for the EN/BN site-wide toggle.
// Keep keys flat and namespaced by surface so nothing collides.

export type Language = "en" | "bn";

export const uiStrings = {
  // Navbar
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.hotels": { en: "Hotels", bn: "হোটেল" },
  "nav.vehicles": { en: "Vehicles", bn: "গাড়ি" },
  "nav.experiences": { en: "Experiences", bn: "অভিজ্ঞতা" },
  "nav.places": { en: "Places", bn: "স্থানসমূহ" },
  "nav.about": { en: "About", bn: "আমাদের সম্পর্কে" },
  "nav.contact": { en: "Contact", bn: "যোগাযোগ" },
  "nav.bookNow": { en: "Book Now", bn: "এখনই বুক করুন" },
  "nav.login": { en: "Login", bn: "লগইন" },
  "nav.loginSignup": { en: "Login / Sign Up", bn: "লগইন / সাইন আপ" },
  "nav.profile": { en: "Profile", bn: "প্রোফাইল" },
  "nav.signOut": { en: "Sign Out", bn: "সাইন আউট" },
  "nav.language": { en: "Language", bn: "ভাষা" },

  // Experiences page
  "exp.heroEyebrow": { en: "Marine Drive · After Dark", bn: "মেরিন ড্রাইভ · রাতের আলোয়" },
  "exp.heroTitle": { en: "Experience Inani Vibes", bn: "ইনানি ভাইবস উপভোগ করুন" },
  "exp.heroBody": {
    en: "Beach raves, music festivals, parasailing, jet skis, scuba and more — curated along the world's longest beach. Pick a vibe, book your spot.",
    bn: "সমুদ্র সৈকতের রেভ পার্টি, মিউজিক ফেস্টিভ্যাল, প্যারাসেইলিং, জেট স্কি, স্কুবা — পৃথিবীর দীর্ঘতম সৈকত জুড়ে সাজানো। আপনার পছন্দের ভাইব বেছে নিন, এখনই বুক করুন।",
  },
  "exp.upcomingCta": { en: "Upcoming Events", bn: "আসন্ন ইভেন্ট" },
  "exp.sportsCta": { en: "Adventure Sports", bn: "অ্যাডভেঞ্চার স্পোর্টস" },

  "exp.upcomingEyebrow": { en: "What's coming up", bn: "আসছে যা কিছু" },
  "exp.sportsEyebrow": { en: "Adrenaline along the coast", bn: "উপকূল জুড়ে রোমাঞ্চ" },

  "exp.filter.all": { en: "All", bn: "সব" },
  "exp.filter.party": { en: "Party", bn: "পার্টি" },
  "exp.filter.music": { en: "Music", bn: "মিউজিক" },
  "exp.filter.festival": { en: "Festival", bn: "উৎসব" },
  "exp.filter.cultural": { en: "Cultural", bn: "সাংস্কৃতিক" },
  "exp.filter.food": { en: "Food", bn: "খাবার" },
  "exp.filter.water": { en: "Water", bn: "জলক্রীড়া" },
  "exp.filter.aerial": { en: "Aerial", bn: "আকাশ" },
  "exp.filter.land": { en: "Land", bn: "স্থল" },

  "exp.empty.events": { en: "No upcoming events in this category yet.", bn: "এই বিভাগে কোনো আসন্ন ইভেন্ট নেই।" },
  "exp.empty.sports": { en: "No sports in this category yet.", bn: "এই বিভাগে কোনো স্পোর্টস নেই।" },

  "exp.card.view": { en: "View", bn: "দেখুন" },
  "exp.card.book": { en: "Book", bn: "বুক করুন" },
  "exp.card.ticket": { en: "/ ticket", bn: "/ টিকিট" },
  "exp.card.session": { en: "/ session", bn: "/ সেশন" },
  "exp.card.soldOut": { en: "Sold Out", bn: "শেষ" },
  "exp.card.fewLeft": { en: "Few Spots Left", bn: "কয়েকটি বাকি" },
  "exp.card.sellingFast": { en: "Selling Fast", bn: "দ্রুত বিক্রি হচ্ছে" },

  // Experience detail
  "det.back": { en: "Back to Experiences", bn: "অভিজ্ঞতায় ফিরে যান" },
  "det.event": { en: "Event", bn: "ইভেন্ট" },
  "det.sport": { en: "Adventure Sport", bn: "অ্যাডভেঞ্চার স্পোর্ট" },
  "det.about.event": { en: "About this event", bn: "এই ইভেন্ট সম্পর্কে" },
  "det.about.sport": { en: "About this experience", bn: "এই অভিজ্ঞতা সম্পর্কে" },
  "det.viewMap": { en: "View on Google Maps", bn: "গুগল ম্যাপে দেখুন" },
  "det.dressCode": { en: "Dress Code", bn: "পোশাক বিধি" },
  "det.requirements": { en: "Requirements", bn: "প্রয়োজনীয়তা" },
  "det.dos": { en: "Do's", bn: "করণীয়" },
  "det.donts": { en: "Don'ts", bn: "বর্জনীয়" },
  "det.restricted": { en: "Restricted Items", bn: "নিষিদ্ধ জিনিসপত্র" },
  "det.bookingProcess": { en: "Booking Process", bn: "বুকিং প্রক্রিয়া" },
  "det.faq": { en: "Frequently Asked Questions", bn: "সাধারণ প্রশ্ন" },

  "det.fact.location": { en: "Location", bn: "অবস্থান" },
  "det.fact.date": { en: "Date", bn: "তারিখ" },
  "det.fact.time": { en: "Time", bn: "সময়" },
  "det.fact.hours": { en: "Hours", bn: "চলাকালীন" },
  "det.fact.duration": { en: "Duration", bn: "সময়কাল" },
  "det.fact.ticket": { en: "Ticket", bn: "টিকিট" },
  "det.fact.session": { en: "Session", bn: "সেশন" },

  "det.form.reserveTicket": { en: "Reserve your ticket", bn: "আপনার টিকিট সংরক্ষণ করুন" },
  "det.form.bookSession": { en: "Book a session", bn: "সেশন বুক করুন" },
  "det.form.preferredDate": { en: "Preferred date *", bn: "পছন্দের তারিখ *" },
  "det.form.preferredTime": { en: "Preferred time *", bn: "পছন্দের সময় *" },
  "det.form.tickets": { en: "Tickets", bn: "টিকিট সংখ্যা" },
  "det.form.riders": { en: "Riders / participants", bn: "অংশগ্রহণকারী" },
  "det.form.name": { en: "Full name *", bn: "পূর্ণ নাম *" },
  "det.form.email": { en: "Email *", bn: "ইমেইল *" },
  "det.form.phone": { en: "Phone *", bn: "ফোন *" },
  "det.form.notes": { en: "Special requests (optional)", bn: "বিশেষ অনুরোধ (ঐচ্ছিক)" },
  "det.form.notesPh": {
    en: "Allergies, group ages, accessibility...",
    bn: "অ্যালার্জি, গ্রুপের বয়স, প্রবেশাধিকার...",
  },
  "det.form.total": { en: "Total", bn: "মোট" },
  "det.form.submit": { en: "Request Reservation", bn: "রিজার্ভেশন অনুরোধ করুন" },
  "det.form.signInToReserve": { en: "Sign in to reserve", bn: "সংরক্ষণ করতে সাইন ইন করুন" },
  "det.form.sending": { en: "Sending...", bn: "পাঠানো হচ্ছে..." },
  "det.form.confirm": {
    en: "Confirmation within 30 min by the Inani Vibes team",
    bn: "ইনানি ভাইবস টিম ৩০ মিনিটের মধ্যে নিশ্চিত করবে",
  },
  "det.form.payNote": {
    en: "Online payment coming soon — instructions will follow on confirmation.",
    bn: "অনলাইন পেমেন্ট শীঘ্রই আসছে — নিশ্চিতকরণের পর নির্দেশনা পাবেন।",
  },

  "det.notFound": { en: "Experience not found", bn: "অভিজ্ঞতা পাওয়া যায়নি" },
} as const;

export type StringKey = keyof typeof uiStrings;

export const t = (key: StringKey, lang: Language): string =>
  uiStrings[key]?.[lang] ?? uiStrings[key]?.en ?? key;
