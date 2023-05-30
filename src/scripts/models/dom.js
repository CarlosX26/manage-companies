class Dom{
    static createTag(name, className, innerText, attribute, attValue){
        const tag = document.createElement(`${name}`)
        if(className){
            tag.className = className
        }
        if(innerText){
            tag.innerText = innerText
        }
        if(attribute){
            tag.setAttribute(`${attribute}`, `${attValue}`)
        }
        return tag
    }
}

export default Dom