import axios from "axios";

export const httpAxios = axios.create({
    baseURL: typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || "http://localhost:3000"),
    headers: {
        "Content-Type": "application/json",
    },
});
