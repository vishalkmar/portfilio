export const setToken = (token) => localStorage.setItem("adminToken", token);
export const getToken = () => localStorage.getItem("adminToken");
export const clearToken = () => localStorage.removeItem("adminToken");
export const isAuthed = () => !!getToken();
