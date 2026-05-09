/**
 * Verified REACT contact details (D011, Amadou response 2026-05-04).
 *
 * Single source of truth — consumed by /contact, the SiteFooter (via the
 * CMS-globals fallback in @sen-react/shared), and any future surface that
 * needs to deep-link to email or WhatsApp. Update this file alone when
 * any detail changes.
 */

export const CONTACT_EMAIL = "senreactsen@gmail.com";

/** WhatsApp / phone number in E.164 format, no separators. Used for tel: + wa.me links. */
export const CONTACT_PHONE_E164 = "+221773213955";

/** Display string with separators — "+221 77 321 39 55". */
export const CONTACT_PHONE_DISPLAY = "+221 77 321 39 55";

/** Address as Amadou wrote it — multi-line for footer / contact card. */
export const CONTACT_ADDRESS_LINES = ["Sacrée Coeur 3, Lot N° 128/B", "Dakar, Sénégal"];

/** wa.me deeplink — opens WhatsApp on mobile, web client on desktop. */
export const WHATSAPP_LINK = `https://wa.me/${CONTACT_PHONE_E164.replace(/\+/, "")}`;

/** mailto link with no subject — keeps it clean for the user to compose. */
export const MAILTO_LINK = `mailto:${CONTACT_EMAIL}`;

/** tel: link for desktop dialler / mobile call. */
export const TEL_LINK = `tel:${CONTACT_PHONE_E164}`;
