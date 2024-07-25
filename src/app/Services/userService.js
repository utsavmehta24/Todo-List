import { httpAxios } from "@/helper/httpHelper";

export async function signUp(user) {
    const result = await httpAxios.post("/api/users", user).then((res) => {
        res.data
    })
    return result;
}

export async function logIn(user) {
    const result = await httpAxios.post("/api/login", user).then((res) => {
        return res.data
    })
    return result;
}