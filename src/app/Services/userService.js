import { httpAxios } from "@/helper/httpHelper";

export async function signUp(user) {
    const result = await httpAxios.post("/api/users", user).then((res) => {
        res.data
    })
    return result;
}

export async function logIn(loginData) {
    const result = await httpAxios.post("/api/login", loginData).then((res) => {
        return res.data
    })
    return result;
}

export async function curentUser() {
    const result = await httpAxios.get("/api/current").then((res) => {
        return res.data
    })
    return result;
}

export async function logOut() {
    const result = await httpAxios.post("/api/logout").then((res) => {
        return res.data
    })
    return result;
}