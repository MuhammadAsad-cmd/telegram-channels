import { apiPublic } from "./axios";

export const fetchCategories = () => apiPublic.get("/category/fetch");
