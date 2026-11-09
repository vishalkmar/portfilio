/**
 * Lets any part of the page ask Byte to react to something the visitor did,
 * without importing the tour guide. The guide listens for these events.
 *
 *   byteReact("cv")                          – CV download started
 *   byteReact("contact-error")               – contact form failed
 *   byteReact("service", { title })          – "Discuss this service" clicked
 *
 *   await byteNarrate(["line 1", "line 2"])  – Byte says the lines; the
 *                                              promise settles once he has
 *                                              finished talking
 */
export const BYTE_EVENT = "byte:react";
export const NARRATE_EVENT = "byte:narrate";
export const NARRATE_DONE = "byte:narrate-done";
export const NARRATE_CANCEL = "byte:narrate-cancel";

export function byteReact(kind, data = {}) {
  window.dispatchEvent(new CustomEvent(BYTE_EVENT, { detail: { kind, ...data } }));
}

let seq = 0;

/**
 * Has Byte say `lines` and resolves when he is done (voice finished, or the
 * bubble has had time to be read when muted). A safety timeout resolves it
 * anyway, so callers never hang. The returned promise has `.cancel()`.
 */
export function byteNarrate(lines, { pose = "idle", timeout = 12000 } = {}) {
  seq += 1;
  const id = `narrate-${Date.now()}-${seq}`;
  let cancel = () => {};

  const promise = new Promise((resolve) => {
    let timer;
    const cleanup = () => {
      window.removeEventListener(NARRATE_DONE, onDone);
      clearTimeout(timer);
    };
    function onDone(e) {
      if (e.detail?.id !== id) return;
      cleanup();
      resolve();
    }
    timer = setTimeout(() => {
      cleanup();
      resolve();
    }, timeout);
    window.addEventListener(NARRATE_DONE, onDone);

    cancel = () => {
      cleanup();
      window.dispatchEvent(new CustomEvent(NARRATE_CANCEL, { detail: { id } }));
    };

    window.dispatchEvent(new CustomEvent(NARRATE_EVENT, { detail: { id, lines, pose } }));
  });

  promise.cancel = () => cancel();
  return promise;
}
