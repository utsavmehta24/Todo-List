    import { httpAxios } from "@/helper/httpHelper";

    export async function addtask(task) {
        const result = await httpAxios.post("/api/works", task).then((res) => {
            res.data
        })
        return result
    }

    export async function getTasksOfUsers(userId){
        const result = await httpAxios.get(`/api/users/${userId}/tasks`).then((res) => {
            return res.data
        })
        return result
    }

    export async function deleteTasks(taskId) {
        const result = await httpAxios.delete(`/api/works/${taskId}`).then((res) => {
            return res.data
        })
        return result
    }