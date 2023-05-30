import instance from "./axios.js"

class Api{
    static async login(user){
        const res = await instance
            .post("/auth/login", user)
            .then((res) => {
                const {token, uuid, is_admin} = res.data
                localStorage.setItem("@techManagement:token", token)
                localStorage.setItem("@techManagement:uuid", uuid)
                localStorage.setItem("@techManagement:is_admin", is_admin)

            })
            .catch((err) =>err)
        
        return res
    }

    static async register(userData){
        const res = await instance
            .post("/auth/register/user", userData)
            .then((res)=> res)
            .catch((error) => error);

        return res
    }

    static async getAllSectors(){
        const res = await instance
            .get("/sectors")
            .then((res)=> res)
            .catch((error) => error.request.response);

        return res
    }

    static async getAllCompanies(){
        const res = await instance
            .get("/companies")
            .then((res)=> res)
            .catch((error) => error.request.response);

        return res
    }

    static async getAllDepartmentsOfACompany(uuid){
        const res = await instance
            .get(`/departments/${uuid}`)
            .then((res)=> res)
            .catch((error) => error.request.response);
        return res
    }

    static async getAllEmployees(){
        const res = await instance
            .get("/users")
            .then((res)=> res)
            .catch((error) => error.request.response);

        return res
    }

    static async registerCompany(newCompany){
        const res = await instance
            .post("/companies", newCompany)
            .then(res => res)
            .catch(err => err)
        return res    
    }

    static async listCompaniesBySector(sector){
        const res = await instance
            .get(`/companies/${sector}`)
            .then(res => res)
            .catch(err => err.request.response)
        return res    
    }

    static async listAllDepartments(){
        const res = await instance
            .get("/departments")
            .then(res => res)
            .catch(err => err.request.response)
        return res    
    }

    static async createDepartment(newDep){
        const res = await instance
            .post("/departments", newDep)
            .then(res => res)
            .catch(err => err)
        return res    
    }

    static async deleteDepartments(uuid){
        const res = await instance
            .delete(`/departments/${uuid}`)
            .then(res => res)
            .catch(err=> err.request.response)
        return res    
    }

    static async getUsersWithoutDepartment(){
        const res = await instance
            .get("/admin/out_of_work")
            .then(res => res)
            .catch(err => err.request.response)
        return res    
    }

    static async hireEmploye(data){
        const res = instance
            .patch("/departments/hire/", data)
            .then(res => res)
            .catch(err => err.request.response)
        return res
    }

    static async editEmploye(uuid, data){
        const res = instance
            .patch(`/admin/update_user/${uuid}`, data)
            .then(res => res)
            .catch(err => err.request.response)
        return res 
    }

    static async fireEmploye(uuid){
        const res = instance
            .patch(`/departments/dismiss/${uuid}`)
            .then(res => res)
            .catch(err => err.request.response)
        return res        
    }

    static async listAllEmployeesOfTheSameDep(){
        const res = instance
            .get("/users/departments/coworkers")
            .then(res => res)
            .catch(err => err.request.response)
        return res      
    }
    
    static async loggedInEmployeeDepartments(){
        const res = instance
            .get("/users/departments")
            .then(res => res)
            .catch(err => err)
        return res       
    }

    static async loggedInEmployeeEdit(data){
        const res = instance
            .patch("/users",data)
            .then(res => res)
            .catch(err => err)
        return res  
    }

    static async getMyDataUser(){
        const res = instance
            .get("users/profile")
            .then(res => res.data)
            .catch(err => err.request.response)
        return res   
    }

    static async editDepartment(uuid, data){
        const res = instance
            .patch(`/departments/${uuid}`,data)
            .then(res => res)
            .catch(err => err)
        return res   
    }
}

export default Api