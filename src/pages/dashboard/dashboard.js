import Api from "../../scripts/models/api.js"
import Dom from "../../scripts/models/dom.js"
import Modal from "../../scripts/models/modal.js"
import Toast from "../../scripts/models/toast.js"

class Dashboard{

    static userIsLogged(){
        const token = localStorage.getItem("@techManagement:token") || null

        if(!token){
            location.replace("/index.html")
        }
        
    }

    static sectorsDom(sectors){
        const section      = Dom.createTag("section", "section__sectors ")
        const h2           = Dom.createTag("h2", "font-title-1 mg-top-2", "Setores")
        const ul           = Dom.createTag("ul", "sectors__list flex flex-wrap jtf-start mg-bottom-2")
        sectors.forEach(({uuid, description})=>{
            const li           = Dom.createTag("li", "list__sectors__item flex jtf-center align-item-center mg-top-2", null, "id", uuid)
            const p            = Dom.createTag("p", "font-text-1", description)

            li.appendChild(p)
            ul.appendChild(li)
        })
       
        section.append(h2, ul)

        return section
    }

    static async listingAllSectors(){
        const main           = document.querySelector("main")

        const sectors        =  await Api.getAllSectors()
        
        const sectionSectors = this.sectorsDom(sectors.data)

        main.innerHTML       = ""
        main.appendChild(sectionSectors)
        
    }

    static async companiesDom(companies){
        const section              = Dom.createTag("section", "section__companies")
        const divHead              = Dom.createTag("div", "companies__head flex jtf-between mg-top-2")
        const h2                   = Dom.createTag("h2", "font-title-1", "Empresas")
        const spanIconAdd          = Dom.createTag("span", "material-symbols-outlined", "add")
        
        const divSearch            = Dom.createTag("div", "companies__search flex align-item-center jtf-between mg-top-2")
        const inputSearch          = Dom.createTag("input", "input-default", null, "placeholder", "Pesquisar por empresa")
        const spanSearch           = Dom.createTag("span", "material-symbols-outlined", "search")
        
        const ulAllSectors         = Dom.createTag("ul", "companies__list__sectors flex gap-5 mg-top-2")
        const liAllSectors         = Dom.createTag("li")
        const buttonAllSectors     = Dom.createTag("button", "button__sector", "Todos", "data-sector","selectSector")
        
        liAllSectors.append(buttonAllSectors)
        ulAllSectors.appendChild(liAllSectors)

        const getAllSectors        = await Api.getAllSectors()
        getAllSectors.data.forEach(sector=>{
            const liSector = Dom.createTag("li")
            const button   = Dom.createTag("button", "button__sector", sector.description, "data-sector","selectSector")
            button.id      = sector.uuid
            liSector.appendChild(button)
            ulAllSectors.appendChild(liSector)
        })

        const ulAllCompanies                   = Dom.createTag("ul", "companies__list  mg-bottom-2 flex flex-dir-col gap-4 ")

        inputSearch.type           = "text"
        spanIconAdd.setAttribute("data-open","addCompany")
        spanSearch.setAttribute("id","btnSearch")
        inputSearch.setAttribute("id","inputSearch")
        companies.forEach(async ({description, name, opening_hours, sectors, uuid})=>{
            const liCompany              = Dom.createTag("li", "list__companies__item mg-top-2")
            const divCompanyInfos        = Dom.createTag("div", "companies__item__infos flex gap-4")
            const pCompanyName           = Dom.createTag("p","font-text-1", `Empresa: ${name}`)
            const pCompanyHours          = Dom.createTag("p", "font-text-1", `Horário: ${opening_hours}`)
            const pBranchCompany         = Dom.createTag("p", "font-text-1", `Ramo: ${sectors.description}`)
            const h2Departments          = Dom.createTag("h2","font-title-3 mg-top-1", "Departamentos")
            const h2Employees            = Dom.createTag("h2", "font-title-3 mg-top-1", "Funcionários")

            /* infos da empresa prontos  */
            divCompanyInfos.append(pCompanyName, pBranchCompany,  pCompanyHours)
            liCompany.appendChild(divCompanyInfos)
            /* buscar departamentos da empresa*/
            const getAllDepartments      = await Api.getAllDepartmentsOfACompany(uuid)
            const ulAllDepartments       = Dom.createTag("ul", "list__departments flex gap-5 mg-top-1")
            const ulAllEmployees         = Dom.createTag("ul", "list__employees flex gap-5 mg-top-1")
            getAllDepartments.data.forEach(async ({description, name, uuid})=>{
                const departmentId       = uuid
                const liDepartment       = Dom.createTag("li", "companies__item__dep")
                const pDepartmentName    = Dom.createTag("p", "font-text-2")
                const pDepartmentDesc    = Dom.createTag("p", "font-text-2")

                const AllEmployees       = await Api.getAllEmployees()
                const filtro = AllEmployees.data.filter(({department_uuid})=> department_uuid == departmentId)

                filtro.forEach(({username, kind_of_work, email})=>{
                    const liEmployee          = Dom.createTag("li", "companies__item__func")
                    const pEmployeeName       = Dom.createTag("p","font-text-2", username)
                    const pEmployeeKinfOfWork = Dom.createTag("p", "font-text-2", kind_of_work)
                    const pEmployeeEmail      = Dom.createTag("p", "font-text-2", email)
                    
                    liEmployee.append(pEmployeeName, pEmployeeKinfOfWork, pEmployeeEmail)
                    ulAllEmployees.append(liEmployee)
                })

                pDepartmentName.innerText = name
                pDepartmentDesc.innerText = description
                liDepartment.append(pDepartmentName, pDepartmentDesc)
                ulAllDepartments.appendChild(liDepartment)
                liCompany.append(h2Departments,ulAllDepartments, h2Employees,ulAllEmployees)
            })
            
            ulAllCompanies.appendChild(liCompany)
        })
        // console.log(ulAllSectors)
        divHead.append(h2, spanIconAdd)
        divSearch.append(inputSearch, spanSearch)
        section.append(divHead, divSearch, ulAllSectors,ulAllCompanies)
           
        return section
    }

    static async listingAllCompanies(companies){
        const main             = document.querySelector("main")

        const sectionCompanies = await this.companiesDom(companies)

        main.innerHTML         = ""
        
        main.appendChild(sectionCompanies)

        this.searchCompany(companies)

        setTimeout(()=>{
            this.createCompany()
            this.selectSector()
        },500)
    }

    static async departmentsDom(allDepartments){
        const section              = Dom.createTag("section", "section__departments")
        const divHead              = Dom.createTag("div", "companies__head flex jtf-between mg-top-2")
        const h2                   = Dom.createTag("h2", "font-title-1", "Departamentos")
        const spanIconAdd          = Dom.createTag("span", "material-symbols-outlined", "add","data-add","department")
        
        const divSearch            = Dom.createTag("div", "companies__search flex align-item-center jtf-between mg-top-2")
        const inputSearch          = Dom.createTag("input", "input-default", null, "placeholder", "Pesquisar empresa")
        const spanSearch           = Dom.createTag("span", "material-symbols-outlined", "search")

        inputSearch.setAttribute("data-search","department")
        spanSearch.setAttribute("data-search","department")

        const ulAllDepartmentsBtns = Dom.createTag("ul", "departmentsBtnsList flex gap-5 mg-top-2")
        const liAllDepartments     = Dom.createTag("li")
        const buttonAllDepartments = Dom.createTag("button", "button__department", "Todos", "data-dep","selectDep")
        
        liAllDepartments.append(buttonAllDepartments)
        ulAllDepartmentsBtns.appendChild(liAllDepartments)

        const getAllDepartments = await Api.listAllDepartments()

        getAllDepartments.data.forEach(dep=>{
            const liSector = Dom.createTag("li")
            const button   = Dom.createTag("button", "button__department", dep.name, "data-dep","selectDep")
            liSector.appendChild(button)
            ulAllDepartmentsBtns.appendChild(liSector)
        })

        const ulAllDepartments     = Dom.createTag("ul", "department__list mg-bottom-2  flex flex-dir-col gap-4")

        inputSearch.type           = "text"
        
        allDepartments.forEach(({description, name, companies, uuid})=>{
            const liDepartment     = Dom.createTag("li","department__item  mg-top-2 ")
            const pDepartmentName  = Dom.createTag("p", "font-text-1", `Departamento: ${name}`)
            const pDepartmentDesc  = Dom.createTag("p","font-text-1", `Descrição: ${description}`)
            const pCompany         = Dom.createTag("p", "font-text-1",`Empresas: ${companies.name}`)
            const spanDelete       = Dom.createTag("span","delete__department material-symbols-outlined", "delete","data-delete","department")
            const spanEdit         = Dom.createTag("span","edit__department material-symbols-outlined", "edit","data-edit","department")

            spanDelete.id = uuid
            spanEdit.id   = uuid
            liDepartment.append(pDepartmentName,spanDelete,spanEdit, pDepartmentDesc, pCompany)
            ulAllDepartments.append(liDepartment)
        })
        divHead.append(h2, spanIconAdd)
        divSearch.append(inputSearch, spanSearch)
        section.append(divHead, divSearch, ulAllDepartmentsBtns,ulAllDepartments)
           
        return section

    }

    static async listingAllDepartment(departments){
        const main             = document.querySelector("main")

        const sectionDepartments= await this.departmentsDom(departments)

        main.innerHTML         = ""
        
        main.appendChild(sectionDepartments)

        setTimeout(()=>{
            this.createDepartment()
            this.listCompanyByDepartment()
            this.selectDepartment()
            this.deleteDepartment()
            this.editDepartment()
        },500)
    }

    static createCompany(){
        const btnAddCompany  = document.querySelector("[data-open=addCompany]")
        const body           = document.querySelector("body")
        btnAddCompany.addEventListener("click", async ()=>{
            const modal = await Modal.modalCreateCompany()
            
            setTimeout(()=>{
                modal.children[0].classList.remove("modalCreateCompanyIn")
            },700)

            body.appendChild(modal)
            const btnsModal    = document.querySelectorAll("[data-button]")
            
            btnsModal[0].addEventListener("click", (e)=>{
                modal.children[0].classList.add("modalCreateCompanyOut")
                setTimeout(()=>{
                    body.removeChild(body.lastChild)
                },600)
            })
            btnsModal[1].addEventListener("click", async(e)=>{
                e.preventDefault()
                const inputsModal    = document.querySelectorAll("[data-input]")
                const selectModal    = document.querySelector("[data-select=sector]")

                const company = {
                    name:inputsModal[0].value,
                    opening_hours: inputsModal[1].value,
                    description: inputsModal[2].value,
                    sector_uuid: selectModal.value
                }

                const res = await Api.registerCompany(company)
                if(res.status == 201){
                    setTimeout(()=>{
                        body.removeChild(body.lastChild)
                    },600)
                    Toast.create("Empresa cadastrada com sucesso","green")
                }else{
                    Toast.create("Erro tente novamente","red")
                }
            })
        })


    }

    static searchCompany(companiesOnScreen){
        const btnSearch   = document.querySelector("#btnSearch")
        const inputSearch = document.querySelector("#inputSearch")
        btnSearch.addEventListener("click", ()=>{
            if(inputSearch.value.trim() == ""){
                return
            }

            const filterCompany    = companiesOnScreen.filter(({name})=>name.toLowerCase().startsWith(inputSearch.value.toLowerCase()))
            
            this.listingAllCompanies(filterCompany)
            
            inputSearch.value = ""
        })
    }

    static hamburgerMenuToggle(){
        const btnOpenMenu    = document.querySelector("[data-menu=open]")
        const menuHamburguer = document.querySelector("[data-menu=bodyHamburguer]")
        
        btnOpenMenu.addEventListener("click",()=>{
            
            if(!menuHamburguer.classList.contains("menuHamburguerDown")){
                    btnOpenMenu.classList.add("rotateElement")
                    btnOpenMenu.innerText = "close"
                    menuHamburguer.style.display = "flex"
                    menuHamburguer.classList.add("menuHamburguerDown")
                    setTimeout(()=>{
                        btnOpenMenu.classList.remove("rotateElement")
                    },700)
                    return
                }

                btnOpenMenu.classList.add("rotateElement")
                menuHamburguer.classList.remove("menuHamburguerDown")
                menuHamburguer.classList.add("menuHamburguerUp")
                btnOpenMenu.innerText = "menu"
                setTimeout(()=>{
                    menuHamburguer.style.display = "none"
                    menuHamburguer.classList.remove("menuHamburguerUp")
                    btnOpenMenu.classList.remove("rotateElement")
                },600)
            
        })
    }

    static navigationBetweenSections(){
        const btnsSections = document.querySelectorAll("[data-section=button]")
        const menuHamburguer = document.querySelector("[data-menu=bodyHamburguer]")
        const btnOpenMenu    = document.querySelector("[data-menu=open]")

        
        btnsSections[0].addEventListener("click",()=>{
            this.listingAllSectors()

            if(window.outerWidth > 700){
                return
            }

            if(!menuHamburguer.classList.contains("menuHamburguerDown")){
                btnOpenMenu.classList.add("rotateElement")
                btnOpenMenu.innerText = "close"
                menuHamburguer.style.display = "flex"
                menuHamburguer.classList.add("menuHamburguerDown")
                setTimeout(()=>{
                    btnOpenMenu.classList.remove("rotateElement")
                },700)
                return
            }

            btnOpenMenu.classList.add("rotateElement")
            menuHamburguer.classList.remove("menuHamburguerDown")
            menuHamburguer.classList.add("menuHamburguerUp")
            btnOpenMenu.innerText = "menu"
            setTimeout(()=>{
                menuHamburguer.style.display = "none"
                menuHamburguer.classList.remove("menuHamburguerUp")
                btnOpenMenu.classList.remove("rotateElement")
            },600)
        })
        btnsSections[1].addEventListener("click",async()=>{
            const companies        =  await Api.getAllCompanies()
            this.listingAllCompanies(companies.data)
            if(window.outerWidth > 700){
                return
            }

            if(!menuHamburguer.classList.contains("menuHamburguerDown")){
                btnOpenMenu.classList.add("rotateElement")
                btnOpenMenu.innerText = "close"
                menuHamburguer.style.display = "flex"
                menuHamburguer.classList.add("menuHamburguerDown")
                setTimeout(()=>{
                    btnOpenMenu.classList.remove("rotateElement")
                },700)
                return
            }

            btnOpenMenu.classList.add("rotateElement")
            menuHamburguer.classList.remove("menuHamburguerDown")
            menuHamburguer.classList.add("menuHamburguerUp")
            btnOpenMenu.innerText = "menu"
            setTimeout(()=>{
                menuHamburguer.style.display = "none"
                menuHamburguer.classList.remove("menuHamburguerUp")
                btnOpenMenu.classList.remove("rotateElement")
            },600)
        })
        btnsSections[2].addEventListener("click", async()=>{
            const getAllDepartments     = await Api.listAllDepartments()
            this.listingAllDepartment(getAllDepartments.data)
            if(window.outerWidth > 700){
                return
            }


            if(!menuHamburguer.classList.contains("menuHamburguerDown")){
                btnOpenMenu.classList.add("rotateElement")
                btnOpenMenu.innerText = "close"
                menuHamburguer.style.display = "flex"
                menuHamburguer.classList.add("menuHamburguerDown")
                setTimeout(()=>{
                    btnOpenMenu.classList.remove("rotateElement")
                },700)
                return
            }

            btnOpenMenu.classList.add("rotateElement")
            menuHamburguer.classList.remove("menuHamburguerDown")
            menuHamburguer.classList.add("menuHamburguerUp")
            btnOpenMenu.innerText = "menu"
            setTimeout(()=>{
                menuHamburguer.style.display = "none"
                menuHamburguer.classList.remove("menuHamburguerUp")
                btnOpenMenu.classList.remove("rotateElement")
            },600)
        })

        btnsSections[3].addEventListener("click",async ()=>{
            const allEmployees = await Api.getAllEmployees()

            Dashboard.listingAllUsers(allEmployees.data)

            if(window.outerWidth > 700){
                return
            }

            if(!menuHamburguer.classList.contains("menuHamburguerDown")){
                btnOpenMenu.classList.add("rotateElement")
                btnOpenMenu.innerText = "close"
                menuHamburguer.style.display = "flex"
                menuHamburguer.classList.add("menuHamburguerDown")
                setTimeout(()=>{
                    btnOpenMenu.classList.remove("rotateElement")
                },700)
                return
            }

            btnOpenMenu.classList.add("rotateElement")
            menuHamburguer.classList.remove("menuHamburguerDown")
            menuHamburguer.classList.add("menuHamburguerUp")
            btnOpenMenu.innerText = "menu"
            setTimeout(()=>{
                menuHamburguer.style.display = "none"
                menuHamburguer.classList.remove("menuHamburguerUp")
                btnOpenMenu.classList.remove("rotateElement")
            },600)
        })
        btnsSections[4].addEventListener("click", ()=>{
            location.replace("/index.html")
            localStorage.clear()
        })
    }

    static selectSector(){
        const btnsSectors = document.querySelectorAll("[data-sector=selectSector]")
        
        btnsSectors.forEach(btn=>{
            btn.addEventListener("click", async (e)=>{
                const sectorName = e.target.innerText
                
                if(sectorName == "Todos"){
                    const companies        =  await Api.getAllCompanies()
                    this.listingAllCompanies(companies.data)
                    return
                }
                
                const sector = await Api.listCompaniesBySector(sectorName)
                this.listingAllCompanies(sector.data)
            })
        })
    }

    static async createDepartment(){
        const body  = document.querySelector("body")
        const btnAddDep = document.querySelector("[data-add=department]")
        
        btnAddDep.addEventListener("click",async()=>{
            const modal = await Modal.modalAddDepartment()
            body.appendChild(modal)

            const btnCloseModal = document.querySelector("[data-close=modal]")
                
            btnCloseModal.addEventListener("click", ()=>{
                modal.children[0].classList.remove("modalCreateCompanyIn")
                modal.children[0].classList.add("modalCreateCompanyOut")
                setTimeout(()=>{
                    body.removeChild(body.lastChild)
                },600)
            })
        
            const btnAddDep  = document.querySelector("[data-send=dep]")
            btnAddDep.addEventListener("click", async(e)=>{
                e.preventDefault()

                const allInputs = document.querySelectorAll("[data-input=addDep]")

                const newDep  =  {
                    name: allInputs[0].value,
                    description: allInputs[1].value,
                    company_uuid: allInputs[2].value
                }
                const res = await Api.createDepartment(newDep)
               
                console.log(res)

                if(res.status == 201){
                    Toast.create("Departamento criado","green")
                    modal.children[0].classList.remove("modalCreateCompanyIn")
                    modal.children[0].classList.add("modalCreateCompanyOut")
                    const getAllDepartments     = await Api.listAllDepartments()
                    this.listingAllDepartment(getAllDepartments.data)
                    setTimeout(()=>{
                            body.removeChild(body.lastChild)
                    },600)
                    return
                }

                if(res.response.status >= 400){
                    Toast.create("Erro tente novamente","red")
                    return 
                }
                
                   
                
            })
        })
    }

    static async listCompanyByDepartment(){
        const search = document.querySelectorAll("[data-search=department]")

        search[1].addEventListener("click", async ()=>{
            const getAllDepartments     = await Api.listAllDepartments()
            const filter = getAllDepartments.data.filter(({companies})=> companies.name.toLowerCase().startsWith(`${search[0].value}`))
            this.listingAllDepartment(filter)
        })
    }

    static selectDepartment(){
        const btnsDepartments = document.querySelectorAll("[data-dep=selectDep]")

        btnsDepartments.forEach(btn=>{
            btn.addEventListener("click", async (e)=>{
                const getAllDepartments     = await Api.listAllDepartments()
                if(e.target.innerText =="Todos"){
                    this.listingAllDepartment(getAllDepartments.data)
                    return
                }

                const departmant = e.target.innerText

                const filter = getAllDepartments.data.filter(({name})=> name == departmant)

                this.listingAllDepartment(filter)
            })
        })
    }

    static deleteDepartment(){
        const btnsDelete = document.querySelectorAll("[data-delete=department]")
        const body = document.querySelector("body")

        btnsDelete.forEach(btn=>{
            btn.addEventListener("click",async(e)=>{
                const departmentId = e.target.id

                const modal = Modal.modalDeleteDep(departmentId)

                body.appendChild(modal)

                setTimeout(()=>{
                    const btnsModal = document.querySelectorAll("[data-dep=del]")

                    btnsModal[0].addEventListener("click",async(e)=>{
                        e.preventDefault()
                        
                        const res = await Api.deleteDepartments(departmentId)
                        console.log(res)
                        if(res.status == 204){
                            Toast.create("Departamento deletado","green")
                            const getAllDepartments     = await Api.listAllDepartments()
                            this.listingAllDepartment(getAllDepartments.data)
                        }else{
                            Toast.create("Erro tente novamente","red")
                            return
                        }

                        modal.children[0].classList.remove("modalCreateCompanyIn")
                        modal.children[0].classList.add("modalCreateCompanyOut")
                        setTimeout(()=>{
                            body.removeChild(body.lastChild)
                        },600)
                        const getAllDepartments = await Api.listAllDepartments()
                        this.listingAllDepartment(getAllDepartments.data)
                    })

                    btnsModal[1].addEventListener("click",(e)=>{
                        e.preventDefault()
                        modal.children[0].classList.remove("modalCreateCompanyIn")
                        modal.children[0].classList.add("modalCreateCompanyOut")
                        setTimeout(()=>{
                            body.removeChild(body.lastChild)
                        },600)
                        
                    })
                },500)

            })
        })
    }

    static editDepartment(){
        const allBtns = document.querySelectorAll("[data-edit=department]")
        const body    = document.querySelector("body")
        allBtns.forEach(btn=>{
            btn.addEventListener("click",()=>{

                const modal = Modal.modalEditDep(btn.id)

                body.appendChild(modal)

                const allInputs = document.querySelectorAll("[data-edi=dep]")   

                allInputs[1].addEventListener("click",async(e)=>{
                    e.preventDefault()

                    if(allInputs[0].value.trim() == ""){
                        Toast.create("Campos inválidos","red")
                        return
                    }

                    const data = {
                        description: allInputs[0].value
                    }

                    const res = await Api.editDepartment(btn.id, data)

                    if(res.status == 200){
                        Toast.create("Editado com sucesso","green")
                        modal.children[0].classList.remove("modalCreateCompanyIn")
                        modal.children[0].classList.add("modalCreateCompanyOut")

                        setTimeout(()=>{
                            body.removeChild(body.lastChild)
                        },600)
                    }else{
                        Toast.create("Erro tente novamente","red")
                    }
                })
    
                allInputs[2].addEventListener("click",()=>{
                    modal.children[0].classList.remove("modalCreateCompanyIn")
                    modal.children[0].classList.add("modalCreateCompanyOut")

                        setTimeout(()=>{
                            body.removeChild(body.lastChild)
                        },600)
                })
            })
        })
    }

    static async allUsersDom(users){
        const section              = Dom.createTag("section", "section__users")
        const divHead              = Dom.createTag("div", "companies__head  mg-top-2")
        const h2                   = Dom.createTag("h2", "font-title-1", "Funcionários")
        
        const divSearch            = Dom.createTag("div", "employee__search flex align-item-center jtf-between mg-top-2")
        const inputSearch          = Dom.createTag("input", "input-default", null, "placeholder", "Pesquisar funcionário")
        const spanSearch           = Dom.createTag("span", "material-symbols-outlined", "search")

        const ulAllEmployees       = Dom.createTag("ul","users__employees flex flex-dir-col gap-4 mg-bottom-2 ")
        
        const ulBtns      = Dom.createTag("ul","btnsNav flex gap-5 mg-top-2")
        const liBtnAllUser      = Dom.createTag("li")
        const liBtnUsersWithoutDep     = Dom.createTag("li")
        const btnAllUser          = Dom.createTag("button", "btnNav","Todos os usuários","data-page","employee")
        const btnUsersWithoutDep = Dom.createTag("button", "btnNav","Usuários sem dep.","data-page","employee")

        liBtnAllUser.appendChild(btnAllUser)
        liBtnUsersWithoutDep.appendChild(btnUsersWithoutDep)
        ulBtns.append(liBtnAllUser, liBtnUsersWithoutDep)
        const getAllDepartments = await Api.listAllDepartments()

        users.forEach(({department_uuid, email, is_admin, kind_of_work, professional_level, username,uuid})=>{
            const liEmployee = Dom.createTag("li", "employees__employe flex flex-dir-col jtf-center align-item-center gap-5 mg-top-2")
            const divBtnsActions       = Dom.createTag("div","btns__employee flex gap-4")
            const pUserName   = Dom.createTag("p", "font-text-1", `Nome: ${username}`)
            const pUserEmail  = Dom.createTag("p", "font-text-1",`Email: ${email}`)
            const pLevelPro   = Dom.createTag("p", "font-text-1", `Nível profissional: ${professional_level}`)
            const pIsAdmin    = Dom.createTag("p", "font-text-1", `Admin: ${is_admin? "sim": "não"}`)
            const editUser    = Dom.createTag("span", "material-symbols-outlined", "edit")
            
            const spanHire = Dom.createTag("span","font-text-2","Contratar")
            const spanEdit = Dom.createTag("span","font-text-2","Editar")
            const spanRemove = Dom.createTag("span","font-text-2","Demitir")
            const divHire    = Dom.createTag("div","btns__actions",null,"data-actions","userHire")
            const divEdit    = Dom.createTag("div","btns__actions",null,"data-actions","userEdit")
            const divRemove  = Dom.createTag("div","btns__actions",null,"data-actions","userRemove")

            let addIcon = Dom.createTag("span","hire__user material-symbols-outlined","person_add")
            if(department_uuid != null){
                addIcon = Dom.createTag("span","hire__user material-symbols-outlined","person_add_disabled")
            }

            let pDepartment = Dom.createTag("p", "font-text-1", "Não possui departamento")
            getAllDepartments.data.forEach(({uuid, name})=>{
                if(uuid === department_uuid){
                    pDepartment   = Dom.createTag("p", "font-text-1", `Departamento: ${name}`)
                }
            })
            const spanDelete       = Dom.createTag("span","delete__user material-symbols-outlined", "delete")
            const pKindOfWork =Dom.createTag("p","font-text-1", `Modelo de trabalho: ${kind_of_work}`)

            liEmployee.id = uuid
            divHire.append(addIcon, spanHire)
            divEdit.append(editUser, spanEdit)
            divRemove.append(spanDelete, spanRemove)
            divBtnsActions.append(divHire, divEdit,divRemove)
            liEmployee.append(divBtnsActions,pUserName, pUserEmail, pLevelPro, pKindOfWork,pDepartment,pIsAdmin)
            ulAllEmployees.appendChild(liEmployee)
        })

        inputSearch.setAttribute("data-search","employee")
        spanSearch.setAttribute("data-search","employee")

        divHead.append(h2)
        divSearch.append(inputSearch, spanSearch)
        section.append(divHead, divSearch, ulBtns,ulAllEmployees)
           
        return section
    }

    static async listingAllUsers(users){
        const main             = document.querySelector("main")
        const sectionUsers     = await this.allUsersDom(users)

        main.innerHTML         = ""
        
        main.appendChild(sectionUsers)

        setTimeout(()=>{
            this.sectionsEmployee()
            this.searchEmployee()
            this.hireEmployee()
            this.editEmployee()
            this.fireEmployee()
        },500)
    }

    static sectionsEmployee(){
        const btnsSections = document.querySelectorAll("[data-page=employee]")
        
        btnsSections.forEach(btn=>{
            btn.addEventListener("click",async (e)=>{
                if(e.target.innerText == "Todos os usuários"){
                    const allEmployees = await Api.getAllEmployees()
                    this.listingAllUsers(allEmployees.data)
                    return
                }

                const allUsersWithoutDep = await Api.getUsersWithoutDepartment()
                this.listingAllUsers(allUsersWithoutDep.data)
            })
        })
    }

    static searchEmployee(){
        const allInputs = document.querySelectorAll("[data-search=employee]")

        allInputs[1].addEventListener("click",async ()=>{
            const allEmployees = await Api.getAllEmployees()

            const filter = allEmployees.data.filter(({username})=>username.toLowerCase().startsWith(allInputs[0].value.toLowerCase()))

            this.listingAllUsers(filter)
        })
    }

    static hireEmployee(){
        const allBtnsHire = document.querySelectorAll("[data-actions=userHire]")
        const body        = document.querySelector("body")

        allBtnsHire.forEach(btn=>{
            btn.addEventListener("click", async(e)=>{
                if(btn.children[0].innerText == "person_add_disabled" ){
                    return
                }
                const userID = btn.parentElement.parentElement.id
                const allEmployees = await Api.getAllEmployees()
                const filter = allEmployees.data.filter(({uuid})=>uuid == userID)

                const modal = await Modal.modalHireEmployee(filter[0])
                body.appendChild(modal)

                const btnClose = document.querySelector("[data-close=modalHire]")
                btnClose.addEventListener("click",()=>{
                    body.removeChild(body.lastChild)
                })

                const inputsHire = document.querySelectorAll("[data-send=hire]")
                inputsHire[1].addEventListener("click", async(e)=>{
                    e.preventDefault()
                    const data = {
                            user_uuid: inputsHire[1].id,
                            department_uuid: inputsHire[0].value
                          }
                    const res = await Api.hireEmploye(data)
                    if(res.status ==200){
                        Toast.create("Funcionário contratado com sucesso","green")
                        body.removeChild(body.lastChild)
                        const allEmployees = await Api.getAllEmployees()

                        Dashboard.listingAllUsers(allEmployees.data)
                    }
                })
            })
        })
    }

    static editEmployee(){
        const allBtns = document.querySelectorAll("[data-actions=userEdit]")
        const body    = document.querySelector("body")
        
        allBtns.forEach(btn=>{
            btn.addEventListener("click",()=>{
                const userId = btn.parentElement.parentElement.id
                const userName = btn.parentElement.parentElement.children[1].innerText
                const modal = Modal.modalEditUser(userName, userId)

                body.appendChild(modal)

                const btnClose = document.querySelector("[data-close=modalEdit]")
                btnClose.addEventListener("click",()=>{
                    body.removeChild(body.lastChild)
                })

                const allInputs = document.querySelectorAll("[data-send=edit]")

                allInputs[2].addEventListener("click", async(e)=>{
                    e.preventDefault()
                    const userId = allInputs[2].id
                    const data = {
                        kind_of_work: allInputs[0].value,
                        professional_level: allInputs[1].value
                      }
                    
                    const res = await Api.editEmploye(userId, data)
                    if(res.status == 200){
                        Toast.create("Editado com sucesso","green")
                        body.removeChild(body.lastChild)
                        const allEmployees = await Api.getAllEmployees()

                        Dashboard.listingAllUsers(allEmployees.data)
                    }else{
                        Toast.create("Erro tente novamente","red")
                    }
                    
                })
            })
        })

    }

    static fireEmployee(){
        const allBtns = document.querySelectorAll("[data-actions=userRemove]")
        const body    = document.querySelector("body")

        allBtns.forEach(btn=> {
            btn.addEventListener("click", (e)=>{
                const userName = btn.parentElement.parentElement.children[1].innerText
                const userId = btn.parentElement.parentElement.id

                const modal = Modal.modalFireUser(userName, userId)

                body.appendChild(modal)

                const btnsFire = document.querySelectorAll("[data-fire=user]")

                btnsFire[0].addEventListener("click", async(e)=>{
                    e.preventDefault()
                    const res = await Api.fireEmploye(userId)
                    if(res.status == 200){
                        Toast.create("Demitido com sucesso","green")
                        body.removeChild(body.lastChild)
                        const allEmployees = await Api.getAllEmployees()

                        Dashboard.listingAllUsers(allEmployees.data)
                    }else{
                        Toast.create("Erro tente novamente","red")
                    }
                })

                btnsFire[1].addEventListener("click",(e)=>{
                    e.preventDefault()
                    body.removeChild(body.lastChild)
                })
            })
        })
    }

    static isAdmin(){
        const verification = localStorage.getItem("@techManagement:is_admin")
        if(verification == "true"){
            this.listingAllSectors()
            this.navigationBetweenSections()
            
        }else{
            this.employeeSpace()
            this.employeeNavDom()
            this.employeeNavEvents()
        }
    }

    static async employeeSpace(){
        const myData = await Api.getMyDataUser()
        const main = document.querySelector("main")
        main.innerHTML = ""
        const section = await this.employeeDepartmentDom()

        main.appendChild(section)
        this.employeeNavDom(myData.username)
    }

    static employeeNavDom(user){
        const menuNav = document.querySelector(".body__menuNav")
        const userName  = document.querySelector(".user__name")
        menuNav.innerHTML = ""

        const buttonMyDep = Dom.createTag("button", "button-section","Página inicial","data-section","button")
        const buttonEmploye = Dom.createTag("button", "button-section","Funcionários do meu dep...","data-section","button")
        const buttonExit = Dom.createTag("button", "button-section","Sair","data-section","button")

        menuNav.append(buttonMyDep, buttonEmploye, buttonExit)
        userName.innerText = `${user}`
        userName.setAttribute("data-section","button")

        this.employeeNavEvents()
    }   

    static employeeNavEvents(){
        const allBtns = document.querySelectorAll("[data-section=button]")

        allBtns[0].addEventListener("click", async()=>{
            const main = document.querySelector("main")
            main.innerHTML = ""
            const section = await this.employeeDepartmentDom()

            main.appendChild(section)
            const myData = await Api.getMyDataUser()
            this.employeeNavDom(myData.username)
        })
        allBtns[1].addEventListener("click",async ()=>{
            const main = document.querySelector("main")
            main.innerHTML = ""
            const section = await this.listEmployeeOfMyDepDom()

            main.appendChild(section)
            const myData = await Api.getMyDataUser()
            this.employeeNavDom(myData.username) 
        })
        allBtns[2].addEventListener("click", ()=>{
            localStorage.clear()       
            location.replace("/index.html")
        })
        allBtns[3].addEventListener("click", async()=>{
            const main = document.querySelector("main")
            main.innerHTML = ""

            const section = await this.changeProfileEmploye()
            main.appendChild(section)
            const myData = await Api.getMyDataUser()
            this.employeeNavDom(myData.username) 
            await this.sendChangeProfileEmploye()
        })
        
    }

    static async employeeDepartmentDom(){
        const myDepartment    = await Api.loggedInEmployeeDepartments()
        if(myDepartment.status != 200){
            const section = Dom.createTag("section","section__home")
            const ulMyDeps = Dom.createTag("p","font-text-1","Você não possuí departamento")

            const h2MyDep = Dom.createTag("h2", "font-title-2","Meus Departamentos")
            section.append(h2MyDep,ulMyDeps)
            Toast.create("Você não possui departamento","red")
            return section
        }else{
            const {description, name, opening_hours, departments} = myDepartment.data
            const section = Dom.createTag("section","section__home")
            const ulMyDeps = Dom.createTag("ul","flex flex-dir-col ")
            const divMyCompany = Dom.createTag("div")
            const h1 = Dom.createTag("h1","font-title-1",`Minha Empresa: ${name}`)
            const pDesc = Dom.createTag("p", "font-text-1", `Descrição: ${description}`)
            const pHours = Dom.createTag("p", "font-text-1",`Horário: ${opening_hours}`)

            const h2MyDep = Dom.createTag("h2", "font-title-2 mg-top-2","Meus Departamentos")

            departments.forEach(({company_uuid, description, name, uuid})=>{
                const liDep = Dom.createTag("li","depsEmploye mg-top-2")
                const pName  = Dom.createTag("p","font-text-1",name)
                const pDesc  = Dom.createTag("p", "font-text-1", description)
                liDep.append(pName, pDesc)
                ulMyDeps.appendChild(liDep)
            })

            divMyCompany.append(h1, pDesc, pHours)
            section.append(divMyCompany, h2MyDep,ulMyDeps)
            return section
        }
        
    }   

    static async listEmployeeOfMyDepDom(){
        const myDepartment    = await Api.listAllEmployeesOfTheSameDep()
        const section = Dom.createTag("section","section__home")
        const ulDeps = Dom.createTag("ul","flex flex-dir-col gap-5")       
        
        const h1 = Dom.createTag("h1","font-title-2",`Funcionários do meu departamento`)
    
        myDepartment.data.forEach(({name, users})=>{
            const liDep = Dom.createTag("li","font-text-1")
            const pNameDep   = Dom.createTag("p",null, `Departamento: ${name}`)
            const h2   = Dom.createTag("h2","font-title-2 mg-top-2", "Lista de funcionários")
            const ulEmployee = Dom.createTag("ul","flex flex-dir-col")
            
            liDep.append(pNameDep, h2,ulEmployee)
            
            users.forEach(({username, professional_level, kind_of_work, email})=>{
                const liEmployee = Dom.createTag("li","emMyDep mg-top-2")
                const pUserName = Dom.createTag("p",null,`Nome: ${username}` )
                const pLevelPro = Dom.createTag("p",null, `Nível profissional: ${professional_level}`)
                const pKindWork = Dom.createTag("p",null, `Modelo de trabalho: ${kind_of_work}`)
                const pMail     = Dom.createTag("p",null, `Email: ${email}`)

                liEmployee.append(pUserName, pMail, pKindWork, pLevelPro)
                ulEmployee.appendChild(liEmployee)
            })

            ulDeps.append(liDep)
        })
     
        section.append(h1, ulDeps)
        return section
    }

    static changeProfileEmploye(){
        const section = Dom.createTag("section","editEmployeeProfile flex flex-dir-col")
        const h2 = Dom.createTag("h2","font-title-2", "Editar informações")

        const form = Dom.createTag("form","flex flex-dir-col gap-5")
        const inputName = Dom.createTag("input","input-default",null,"placeholder","Digite seu nome de usuário")
        const inputMail = Dom.createTag("input","input-default",null,"placeholder","Digite seu email")
        const labelName = Dom.createTag("label","font-text-2","Nome de usuário")
        const labelMail = Dom.createTag("label","font-text-2", "Email")
        const labelPass = Dom.createTag("label","font-text-2", "Senha")
        const inputPass = Dom.createTag("input","input-default",null,"placeholder","Digite sua nova senha")

        inputMail.type = "text"
        inputName.type = "text"
        inputPass.type = "password"
        const buttonEdit = Dom.createTag("button","button-primary","Editar")

        inputPass.setAttribute("data-change","user")
        inputMail.setAttribute("data-change","user")
        inputName.setAttribute("data-change","user")
        buttonEdit.setAttribute("data-change","user")

        form.append(labelName, inputName, labelMail, inputMail, labelPass,inputPass,buttonEdit)
        section.append(h2, form)
        return section
  
    }

    static async sendChangeProfileEmploye(){
        const allInputs = document.querySelectorAll("[data-change=user]")
        
        const userData = await Api.getMyDataUser()
        allInputs[0].value = userData.username
        allInputs[1].value = userData.email

        allInputs[3].addEventListener("click", async(e)=>{
            e.preventDefault()
            e.stopImmediatePropagation()
            const newData = {
                username: allInputs[0].value,
                email: allInputs[1].value,
                password:allInputs[2].value
            }
           
            const res = await Api.loggedInEmployeeEdit(newData)
            if(res.status == 200){
                Toast.create("Editado com sucesso","green")
            }else{
                Toast.create("Erro tente novamente","red")
            }
        })
    }

    static darkMode(){
        const btnSwitch = document.getElementById("darkMode")
        const html  = document.querySelector("html")

        btnSwitch.addEventListener("click",()=>{
            html.classList.toggle("dark-mode")
        })

    }
}

Dashboard.userIsLogged()

Dashboard.isAdmin()

Dashboard.hamburgerMenuToggle()

Dashboard.darkMode()




