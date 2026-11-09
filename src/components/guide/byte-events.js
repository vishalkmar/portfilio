/**
 * Lets any part of the page ask Byte to react to something the visitor did,
 * without importing the tour guide. The guide listens for this event.
 *
 *   byteReact("cv")                          – CV download started
 *   byteReact("contact", { name: "Asha" })   – contact form sent
 *   byteReact("contact-error")               – contact form failed
 *   byteReact("service", { title })          – "Discuss this service" clicked
 */
export const BYTE_EVENT = "byte:react";

export function byteReact(kind, data = {}) {
  window.dispatchEvent(new CustomEvent(BYTE_EVENT, { detail: { kind, ...data } }));
}
