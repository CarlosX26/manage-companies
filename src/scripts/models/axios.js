const token = localStorage.getItem("@techManagement:token") || null

const instance = axios.create({
    baseURL: "http://localhost:6278",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
})

export default instance