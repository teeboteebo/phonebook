let header = document.createElement('header');
header.innerHTML = 'Super duper telefonbok'
header.setAttribute('class', 'header')

let main = document.createElement('main');
main.innerHTML = 'main sektion med kontaktinformation'
main.setAttribute('class', 'contact-information')

let aside = document.createElement('aside')
aside.innerHTML = 'aside sektion med lista över alla kontakter'
aside.setAttribute('class', 'contact-list')

document.body.append(header, main, aside);