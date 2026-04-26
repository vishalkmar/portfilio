import api from "./api";

export const authApi = {
  login: (username, password) =>
    api.post("/auth/login", { username, password }).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => r.data),
};

export const educationApi = {
  list: () => api.get("/education").then((r) => r.data),
  create: (formData) =>
    api.post("/education", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (id, formData) =>
    api.put(`/education/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  remove: (id) => api.delete(`/education/${id}`).then((r) => r.data),
};

export const personalApi = {
  get: () => api.get("/personal").then((r) => r.data),
  update: (data) => api.put("/personal", data).then((r) => r.data),
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return api.post("/personal/image", fd, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
  },
  uploadResume: (file) => {
    const fd = new FormData();
    fd.append("resume", file);
    return api.post("/personal/resume", fd, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
  },
  removeResume: () => api.delete("/personal/resume").then((r) => r.data),
};

export const projectsApi = {
  list: () => api.get("/projects").then((r) => r.data),
  create: (formData) =>
    api.post("/projects", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (id, formData) =>
    api.put(`/projects/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  remove: (id) => api.delete(`/projects/${id}`).then((r) => r.data),
};

export const skillsApi = {
  list: () => api.get("/skills").then((r) => r.data),
  createCategory: (data) => api.post("/skills", data).then((r) => r.data),
  updateCategory: (id, data) => api.put(`/skills/${id}`, data).then((r) => r.data),
  deleteCategory: (id) => api.delete(`/skills/${id}`).then((r) => r.data),
  addSkill: (id, formData) =>
    api.post(`/skills/${id}/skills`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  updateSkill: (id, skillId, formData) =>
    api.put(`/skills/${id}/skills/${skillId}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  deleteSkill: (id, skillId) => api.delete(`/skills/${id}/skills/${skillId}`).then((r) => r.data),
};

export const servicesApi = {
  list: () => api.get("/services").then((r) => r.data),
  create: (data) => api.post("/services", data).then((r) => r.data),
  update: (id, data) => api.put(`/services/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/services/${id}`).then((r) => r.data),
};

export const headerApi = {
  get: () => api.get("/header").then((r) => r.data),
  update: (data) => api.put("/header", data).then((r) => r.data),
};

export const footerApi = {
  get: () => api.get("/footer").then((r) => r.data),
  update: (data) => api.put("/footer", data).then((r) => r.data),
};

export const contactApi = {
  send: (data) => api.post("/contact", data).then((r) => r.data),
};
