import Api from "./models/api.js"
import Modal from "./models/modal.js"
import Toast from "./models/toast.js"
import Dom from "./models/dom.js"

class Home{
    
    static login(){
        const allInputs     = document.querySelectorAll("[data-input]")
        const allButtons    = document.querySelectorAll("[data-button]")
        const body          = document.querySelector("body")
        const eyePassword   = document.querySelector("[data-boxPassword=login]")

        allButtons.forEach((button) => {
            button.addEventListener("click", async (e) => {
                e.preventDefault()
                if(button.getAttribute("data-button") == "login"){

                    const user = {
                        email: allInputs[0].value,
                        password: allInputs[1].value
                    }
                    
                    if(allInputs[0].value.trim() =="" ||  allInputs[1].value.trim() =="" ){
                        Toast.create("Campos inválidos","red")
                        return
                    }
                    const res = await Api.login(user)
                    
                    if(res != undefined){
                        Toast.create("Erro tente novamente","red")
                        return
                    }


                    const token = localStorage.getItem("@techManagement:token") || null
                    if(token != null){
                            location.replace("src/pages/dashboard/dashboard.html")
                    }
                    return
                }

                const formRegister = Modal.modalRegisterDom()
                body.appendChild(formRegister)
                this.register()
                
            })
        })

        eyePassword.addEventListener("click",(e)=>{

            if(e.target.tagName == "SPAN"){
                allInputs[1].type == "password"? allInputs[1].type = "text" : allInputs[1].type = "password"
                e.target.innerText == "visibility_off" ? e.target.innerText ="visibility" : e.target.innerText ="visibility_off"
            }

        })

       
    }

    static register(){
        const allInputs   = document.querySelectorAll("[data-input=register]")
        const btnRegister = document.querySelector("[data-button=registerModal]")
        const linkLogin   = document.querySelector("[data-link=login]")
        const body        = document.querySelector("body")
        const modal       = document.querySelector(".section__register")
        const eyePassword = document.querySelector("[data-boxpassword=register]")

        btnRegister.addEventListener("click", async (e)=>{
            e.preventDefault()
            const userData =  {
                                password: allInputs[2].value,
                                email: allInputs[1].value,
                                professional_level: allInputs[3].value,
                                username: allInputs[0].value
                            }
  
            const response = await Api.register(userData)  
            

            if(response.status != 201 ){
                if(response.response.data.error == "required field password!"){
                    Toast.create("Erro tente novamente","red")
                    return
                }
                Toast.create(`${response.response.data.error[0]}`,"red")
                return
            }
            
            if(response.status == 201){
                Toast.create("Cadastro realizado com sucesso!","green")
                modal.classList.toggle("formRegisterUp")
                modal.classList.toggle("formRegisterDown")
                
                setTimeout(()=>{
                    body.removeChild(body.lastChild)
                },600)
            }
           
        })
    
       linkLogin.addEventListener("click", (e)=>{
            e.preventDefault()
            modal.classList.toggle("formRegisterUp")
            modal.classList.toggle("formRegisterDown")
            
            setTimeout(()=>{
                body.removeChild(body.lastChild)
            },600)
       })

       eyePassword.addEventListener("click",(e)=>{

        if(e.target.tagName == "SPAN"){
            allInputs[2].type == "password"? allInputs[2].type = "text" : allInputs[2].type = "password"
            e.target.innerText == "visibility_off" ? e.target.innerText ="visibility" : e.target.innerText ="visibility_off"
        }

    })
    }

    static async showListCompanies(){
        const body              = document.querySelector("body")
        const linkListCompanies = document.querySelector("#linkToListCompanies")
        
        linkListCompanies.addEventListener("click", async ()=>{
            
            const modalListCompanies = await Modal.modalListOfCompanies()
            
            body.appendChild(modalListCompanies)

            setTimeout(()=>{
                modalListCompanies.classList.remove("modalCreateCompanyIn")
            },600)
            
            const btnCloseModal = document.querySelector("[data-modal=closeList]")
            btnCloseModal.addEventListener("click",()=>{
                modalListCompanies.children[0].classList.add("modalCreateCompanyOut")

                setTimeout(()=>{
                    body.removeChild(modalListCompanies)
                },600)
            })
            
            const btnsSectors       = document.querySelectorAll("[data-sector=selectSector]")

            btnsSectors.forEach(btn=>{
                btn.addEventListener("click", async (e)=>{
                    const ulAllCompanies = document.querySelector("[data-ul=companies]")
                    const sectorName = e.target.innerText
                    if(sectorName == "Todos"){
                        const companies        =  await Api.getAllCompanies()
                        ulAllCompanies.innerHTML = ""
                        
                        companies.data.forEach(({description, name, opening_hours})=>{
                            const liCompany     = Dom.createTag("li","companies__company")
                            const pCompanyName  = Dom.createTag("p","font-text-2", `Empresa: ${name}`)
                            const pCompanyHours = Dom.createTag("p", "font-text-2", `Horário: ${opening_hours}`) 
                            const pCompanyDesc  = Dom.createTag("p", "font-text-2", `Descrição: ${description}`)
                
                            liCompany.append(pCompanyName, pCompanyDesc, pCompanyHours)
                            ulAllCompanies.appendChild(liCompany)
                        })
                        return
                    }
            
                })
            })

            const allInputs = document.querySelectorAll("[data-search=sector]")
            allInputs[1].addEventListener("click",async()=>{
                const ulAllCompanies = document.querySelector("[data-ul=companies]")
                ulAllCompanies.innerHTML = ""
                const sectorName = allInputs[0].value
                const sector = await Api.listCompaniesBySector(sectorName)
                
                sector.data.forEach(({description, name, opening_hours})=>{
                    const liCompany     = Dom.createTag("li","companies__company")
                    const pCompanyName  = Dom.createTag("p","font-text-2", `Empresa: ${name}`)
                    const pCompanyHours = Dom.createTag("p", "font-text-2", `Horário: ${opening_hours}`) 
                    const pCompanyDesc  = Dom.createTag("p", "font-text-2", `Descrição: ${description}`)
        
                    liCompany.append(pCompanyName, pCompanyDesc, pCompanyHours)
                    ulAllCompanies.appendChild(liCompany)
            
                })      

                allInputs[0].value = ""
            })
        })

      
    }
}

Home.login()

Home.showListCompanies()
