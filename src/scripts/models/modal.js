import Api from "./api.js"
import Dom from "./dom.js"

class Modal{

    static modalRegisterDom(){
        const section                = Dom.createTag("section", "section__register formRegisterUp")
        const form                   = Dom.createTag("form", "flex flex-dir-col align-item-center")
        const h1                     = Dom.createTag("h1", "mg-top-2 font-title-1", "Criar Conta")
        const labelUserName          = Dom.createTag("label", "mg-top-3 align-self-start font-text-2",  "Nome de usuário")
        const labelEmail             = Dom.createTag("label", "mg-top-2 align-self-start font-text-2", "Email")
        const labelPassword          = Dom.createTag("label", "mg-top-2 align-self-start font-text-2", "Senha")
        const labelLevelPro          = Dom.createTag("label", "mg-top-2 align-self-start font-text-2", "Nível profissional")
        const inputUserName          = Dom.createTag("input", "input-default", null , "placeholder", "Digite um nome de usuário")
        const inputEmail             = Dom.createTag("input", "input-default", null, "placeholder", "Digite seu melhor email")
        const inputPassword          = Dom.createTag("input", "input-default", null , "placeholder", "Digite sua senha")
        const inputLevelPro          = Dom.createTag("input", "input-default", null, "placeholder", "Digite seu nível profissional")
        const button                 = Dom.createTag("button", "mg-top-2 button-primary", "Cadastrar")
        const pInfo                  = Dom.createTag("p", "mg-top-2 mg-bottom-2 font-text-1", "já possui cadastro? ")
        const linkLogin              = Dom.createTag("a",null,"login", "href", "#" )
        const boxPassword            = Dom.createTag("div", "box-password",null ,"data-boxPassword","register" )
        const lookPassword           = Dom.createTag("span", "eyePassword material-symbols-outlined", "visibility_off")

        inputUserName.type = "text"
        inputEmail.type = "text"
        inputPassword.type = "password"
        inputLevelPro.type = "text"

        inputUserName.setAttribute("data-input","register")
        inputEmail.setAttribute("data-input","register")
        inputPassword.setAttribute("data-input","register")
        inputLevelPro.setAttribute("data-input","register")
        button.setAttribute("data-button","registerModal")
        linkLogin.setAttribute("data-link","login")

        boxPassword.append(inputPassword, lookPassword)
        pInfo.appendChild(linkLogin)
        form.append(h1, labelUserName, inputUserName, labelEmail, inputEmail,labelPassword, boxPassword, labelLevelPro, inputLevelPro, button, pInfo)
        section.append(form)

        return section
    }

    static async modalCreateCompany(){
        const section = Dom.createTag("section", "modal-container flex jtf-center align-item-center ")

        const h2RegisterCompany  = Dom.createTag("h2","font-title-2","Cadastrar Empresa")
        const btnClose           = Dom.createTag("span","material-symbols-outlined","close" ,"data-button","closeModal")
        const formRegister       = Dom.createTag("form", "modal__register--company flex flex-dir-col gap-5 modalCreateCompanyIn")
        const labelCompanyName   = Dom.createTag("label", "font-text-3", "Nome da Empresa","for","nameCompany")
        const inputCompanyName   = Dom.createTag("input","input-default",null,"placeholder","Digite o nome da empresa")
        const labelCompanyHours  = Dom.createTag("label","font-text-3", "Horário da empresa" ,"for", "hoursCompany")
        const inputCompanyHours  = Dom.createTag("input","input-default", null, "placeholder", "Digite o horário de funcion...")
        const labelCompanyDesc   = Dom.createTag("label", "font-text-3", "Descrição da empresa","for", "descCompany")
        const inputCompanyDesc   = Dom.createTag("input", "input-default", null, "placeholder", "Descrição")
        const labelCompanySector = Dom.createTag("label", "font-text-3", "Selecione o setor","for","sectors")
        const selectSector       = Dom.createTag("select",null,null,"data-select","sector")
        const button             = Dom.createTag("button","button-primary", "Cadastrar", "data-button","registerCompany")
        const optGroup           = Dom.createTag("option",null, "Selecione o setor")
        selectSector.append(optGroup)

        const allSectors = await Api.getAllSectors()

        allSectors.data.forEach(({uuid, description})=>{
            const optionSector = Dom.createTag("option",null, description, "value", uuid)
            selectSector.append(optionSector)
        })

        inputCompanyName.setAttribute("data-input", "register")
        inputCompanyHours.setAttribute("data-input", "register")
        inputCompanyDesc.setAttribute("data-input", "register")

        inputCompanyName.type  = "text"
        inputCompanyHours.type = "text"
        inputCompanyDesc.type  = "text"

        inputCompanyName.id    = "nameCompany"
        inputCompanyHours.id   = "hoursCompany"
        inputCompanyDesc.id    = "descCompany"
        selectSector.id        = "sectors"

        formRegister.append(h2RegisterCompany,btnClose,labelCompanyName,inputCompanyName, labelCompanyHours,inputCompanyHours, labelCompanyDesc,inputCompanyDesc, labelCompanySector,selectSector, button)
        section.appendChild(formRegister)
        return section
    }

    static async modalListOfCompanies(){
        const section            = Dom.createTag("section", "modal-container flex jtf-center align-item-center")
        const divBodyModal       = Dom.createTag("div", "modal__allcompanies flex flex-dir-col gap-5 modalCreateCompanyIn")
        const h2ListOfCompanies  = Dom.createTag("h2","font-title-2","Lista de empresas")
        const spanClose          = Dom.createTag("span", "material-symbols-outlined","close","data-modal","closeList")

        const ulAllSectors         = Dom.createTag("ul","allcompanies__sectors flex gap-5")
        const liAllSectors         = Dom.createTag("li")
        const buttonAllSectors     = Dom.createTag("button","sectors__sector", "Todos", "data-sector","selectSector")
        liAllSectors.append(buttonAllSectors)
        ulAllSectors.appendChild(liAllSectors)
        
        const divSearch = Dom.createTag("div","div__search")

        const inputSearch       = Dom.createTag("input","input-default",null,"placeholder","Pesquisar setor")
        const spanSearch        = Dom.createTag("span","material-symbols-outlined","search")

        inputSearch.type = "text"

        inputSearch.setAttribute("data-search","sector")
        spanSearch.setAttribute("data-search","sector")

        const ulAllCompanies     = Dom.createTag("ul","allcompanies__list flex flex-dir-col gap-5",null,"data-ul","companies")
        const companies          = await Api.getAllCompanies()
        companies.data.forEach(({description, name, opening_hours})=>{
            const liCompany     = Dom.createTag("li","companies__company")
            const pCompanyName  = Dom.createTag("p","font-text-2", `Empresa: ${name}`)
            const pCompanyHours = Dom.createTag("p", "font-text-2", `Horário: ${opening_hours}`) 
            const pCompanyDesc  = Dom.createTag("p", "font-text-2", `Descrição: ${description}`)


            liCompany.append(pCompanyName, pCompanyDesc, pCompanyHours)
            ulAllCompanies.appendChild(liCompany)
        })
        divSearch.append(inputSearch, spanSearch)
        divBodyModal.append(h2ListOfCompanies,divSearch,spanClose,ulAllSectors,ulAllCompanies)
        section.appendChild(divBodyModal)
        return section
    }

    static async modalAddDepartment(){
        const section      = Dom.createTag("section", "modal-container flex jtf-center align-item-center ")

        const form         = Dom.createTag("form","modal__addDepartment modalCreateCompanyIn flex flex-dir-col gap-5")
        const h2           = Dom.createTag("h2","font-title-3","Criar novo departamento")
        const spanClose    = Dom.createTag("span", "material-symbols-outlined", "close","data-close","modal")
        const inputNameDep = Dom.createTag("input", "input-default",null, "type","text")
        const textArea     = Dom.createTag("textarea",null, null)
        const selectCompany = Dom.createTag("select")
        const button       = Dom.createTag("button","button-primary","Criar")

        const labelNameDep     = Dom.createTag("label","font-text-3","Nome do departamento")   
        const labelTextArea    = Dom.createTag("label","font-text-3", "Descrição do departamento")
        const labelSelectCompany = Dom.createTag("label","font-text-3", "Selecionar empresa")

        inputNameDep.placeholder = "Insira o nome do departamento"
        textArea.placeholder     = "Insira uma descrição"

        inputNameDep.setAttribute("data-input","addDep")
        textArea.setAttribute("data-input","addDep")
        selectCompany.setAttribute("data-input", "addDep")
        button.setAttribute("data-send","dep")

        const allcompanies = await Api.getAllCompanies()
        allcompanies.data.forEach(({name, uuid})=>{
            const option = Dom.createTag("option",null, name)
            option.value = uuid

            selectCompany.appendChild(option)
        }) 

        form.append(h2, spanClose,labelNameDep ,inputNameDep, labelTextArea,textArea, labelSelectCompany,selectCompany, button)
        section.append(form)        
        return section
    }

    static async modalHireEmployee(user){
        
        const section      = Dom.createTag("section", "modal-container flex jtf-center align-item-center ")

        const form         = Dom.createTag("form","modal__addEmployee modalCreateCompanyIn flex flex-dir-col gap-5")
        const h2           = Dom.createTag("h2","font-title-3","Contratar funcionário")
        const spanClose    = Dom.createTag("span", "material-symbols-outlined", "close","data-close","modalHire")
        
        const h3           = Dom.createTag("h3","font-title-3", user.username)

        const selectDep       = Dom.createTag("select",null, null,"data-send","hire")

        const allDepartments = await Api.listAllDepartments()

        allDepartments.data.forEach(({name, uuid})=>{
            const option = Dom.createTag("option",null,name,"value",uuid)
            selectDep.append(option)
        })

        const btnHire = Dom.createTag("button","button-primary","Contratar","id", user.uuid)
        btnHire.setAttribute("data-send","hire")
        form.append(h2,spanClose, h3, selectDep, btnHire)
        section.append(form)        
        return section
    }

    static modalEditUser(userName, userId){
        const section      = Dom.createTag("section", "modal-container flex jtf-center align-item-center ")

        const form         = Dom.createTag("form","modal__editEmployee modalCreateCompanyIn flex flex-dir-col gap-5")
        const h2           = Dom.createTag("h2","font-title-3","Editar funcionário")
        const spanClose    = Dom.createTag("span", "material-symbols-outlined", "close","data-close","modalEdit")
        const h3           = Dom.createTag("h3","font-title-3", userName)
        
        const labelKindWork = Dom.createTag("label","font-text-3","Modelo de trabalho")
        const labelLevelPro = Dom.createTag("label","font-text-3","Nível profissional")
        const inputKindWork = Dom.createTag("input","input-default",null,"placeholder","Digite aqui o modelo de trabalho")
        const inputLevelPro = Dom.createTag("input","input-default",null,"placeholder","Digite aqui o nível profissional")
        inputKindWork.type = "text"
        inputLevelPro.type = "text"

        const btnEdit = Dom.createTag("button","button-primary","Editar","id", userId)
        btnEdit.setAttribute("data-send","edit")
        inputKindWork.setAttribute("data-send","edit")
        inputLevelPro.setAttribute("data-send","edit")
        form.append(h2,spanClose, h3, labelKindWork,inputKindWork,labelLevelPro,inputLevelPro,btnEdit)
        section.append(form)        
        return section
    }

    static modalFireUser(userName, userId){
        const section      = Dom.createTag("section", "modal-container flex jtf-center align-item-center ")

        const form         = Dom.createTag("form","modal__fireEmployee modalCreateCompanyIn flex flex-dir-col gap-5")
        const h2           = Dom.createTag("h2","font-title-3",`Deseja demitir ${userName.replace("Nome:","")}` )
        
        const btnConfirm = Dom.createTag("button","button-fire-modal","Confirmar","id", userId)
        const btnCancel = Dom.createTag("button","button-fire-modal", "Cancelar")

        btnConfirm.setAttribute("data-fire","user")
        btnCancel.setAttribute("data-fire","user")

        form.append(h2, btnConfirm, btnCancel)
        section.append(form)        
        return section
    }

    static modalDeleteDep(uuid){
        const section      = Dom.createTag("section", "modal-container flex jtf-center align-item-center ")

        const form         = Dom.createTag("form","modal__deleteDep modalCreateCompanyIn flex flex-dir-col gap-5")
        const h2           = Dom.createTag("h2","font-title-3",`Deseja deletar este departamento?`)
        
        const btnConfirm = Dom.createTag("button","button-fire-modal","Confirmar","id", uuid)
        const btnCancel = Dom.createTag("button","button-fire-modal", "Cancelar")

        btnConfirm.setAttribute("data-dep","del")
        btnCancel.setAttribute("data-dep","del")

        form.append(h2, btnConfirm, btnCancel)
        section.append(form)        
        return section
    }

    static modalEditDep(uuid){
        const section      = Dom.createTag("section", "modal-container flex jtf-center align-item-center ")

        const form         = Dom.createTag("form","modal__editDep modalCreateCompanyIn flex flex-dir-col gap-5")
        const h2           = Dom.createTag("h2","font-title-3",`Editar departamento`)
        const inputDesc   = Dom.createTag("input","input-default",null,"type","text")
        const btnConfirm = Dom.createTag("button","button-primary","Editar","id", uuid)
        const btnCancel = Dom.createTag("span","material-symbols-outlined", "close")

        inputDesc.placeholder ="Digite a descrição"
        btnConfirm.setAttribute("data-edi","dep")
        btnCancel.setAttribute("data-edi","dep")
        inputDesc.setAttribute("data-edi","dep")

        form.append(h2, inputDesc,btnConfirm, btnCancel)
        section.append(form)        
        return section
    }
}

export default Modal

















