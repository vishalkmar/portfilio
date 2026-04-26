import api from "./api";

export const publicApi = {
  header: () => api.get("/header").then((r) => r.data),
  footer: () => api.get("/footer").then((r) => r.data),
  personal: () => api.get("/personal").then((r) => r.data),
  education: () => api.get("/education").then((r) => r.data),
  projects: () => api.get("/projects").then((r) => r.data),
  skills: () => api.get("/skills").then((r) => r.data),
  services: () => api.get("/services").then((r) => r.data),
  sendContact: (data) => api.post("/contact", data).then((r) => r.data),
};
