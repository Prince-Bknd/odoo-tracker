import api from "./api";
export const getAllTeams = () => api.get("/teams").then(r => r.data.data);
export const getTeamById = (id) => api.get(`/teams/${id}`).then(r => r.data.data);
export const createTeam = (payload) => api.post("/teams", payload).then(r => r.data.data);
export const updateTeam = (id, payload) => api.put(`/teams/${id}`, payload).then(r => r.data.data);
export const deleteTeam = (id) => api.delete(`/teams/${id}`).then(r => r.data);
