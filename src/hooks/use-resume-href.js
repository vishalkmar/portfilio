import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

/** Shipped with the frontend build, so the CV is downloadable even if the API is down. */
export const LOCAL_RESUME = "/resume.pdf";

/**
 * Resolves where the CV actually lives.
 *
 * The API endpoint is preferred because it sets Content-Disposition, so the
 * browser saves the file instead of previewing it. But a host with an
 * ephemeral filesystem can lose the uploaded PDF, so the endpoint is probed
 * once and the link falls back to the copy bundled with this build rather
 * than sending anyone to a 404.
 */
export function useResumeHref(resumeUrl) {
  const [href, setHref] = useState(LOCAL_RESUME);

  useEffect(() => {
    if (!resumeUrl) {
      setHref(LOCAL_RESUME);
      return undefined;
    }

    const url = `${API_BASE}/api/personal/resume/download`;
    const controller = new AbortController();

    fetch(url, { method: "HEAD", signal: controller.signal })
      .then((res) => setHref(res.ok ? url : LOCAL_RESUME))
      .catch(() => setHref(LOCAL_RESUME));

    return () => controller.abort();
  }, [resumeUrl]);

  return href;
}
