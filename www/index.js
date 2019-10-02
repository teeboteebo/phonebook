let header = document.createElement('header');
header.innerHTML = 'Super duper telefonbok'
header.setAttribute('class', 'header')

let main = document.createElement('main')

document.body.append(header, main);


let listSection = document.createElement('section')
let listContent = `<ul><li>Olle Hallberg</li></ul>`
listSection.innerHTML = `main sektion med lista över alla kontakter <br /> ${listContent}`
listSection.setAttribute('class', 'contact-list')

let contactSection = document.createElement('section');
contactSection.innerHTML = 'aside sektion med kontaktinformation (empty as default)'
contactSection.setAttribute('class', 'contact-information')

main.append(listSection, contactSection)