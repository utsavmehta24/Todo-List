import { httpAxios } from "@/helper/httpHelper";

export async function addtask(task) {
    const result = await httpAxios.post("/api/works", task).then((res) => {
        res.data
    })
    return result
}