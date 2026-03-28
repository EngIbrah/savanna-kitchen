export const SITE_CONFIG = {
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+255 748412022",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@example.com",
    whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "255748412022",
    address: process.env.NEXT_PUBLIC_LOCATION || "Dar es Salaam",
  },
  timing: {
    hours: process.env.NEXT_PUBLIC_OFFICE_HOURS || "9 AM - 10 PM",
  },
  socials: {
    instagram: "https://instagram.com/savannakitchen",
    // You can add hardcoded links here too
  }
};