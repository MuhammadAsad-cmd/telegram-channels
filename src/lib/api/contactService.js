import { apiPublic } from "./axios";

/** POST /contact/create — body: { email, username, subject, message } */
export const createContact = (data) => apiPublic.post("/contact/create", data);
