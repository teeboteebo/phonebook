let header = document.createElement('header');
header.innerHTML = 'Super duper telefonbok'
header.setAttribute('class', 'header')

let main = document.createElement('main')

document.body.append(header, main);


let listSection = document.createElement('section')
listSection.setAttribute('class', 'contact-list')

let contactSection = document.createElement('section');
contactSection.innerHTML = 'aside sektion med kontaktinformation (empty as default)'
contactSection.setAttribute('class', 'contact-information')

main.append(listSection, contactSection)

let button = document.createElement('button')
button.setAttribute('class', 'test-button')


contactSection.append(button)

const loadContacts = async () => {
  console.log('running');

  let allContacts = await fetch('/api/contacts')
  let json = await allContacts.json()
  return json
}

const loadAndMountContactsToList = async () => {
  let contacts = await loadContacts()
  let sortedByFirstName = [...contacts].sort((a, b) => a.firstName.localeCompare(b.firstName, 'sv'))
  let contactList = '<ul>' + sortedByFirstName.map(contact => {
    return `<li class="list-item" id="${contact._id}">` + contact.firstName + (contact.lastName ? ' ' + contact.lastName : '') + '</li>'
  }).join('') + '</ul>'



  listSection.innerHTML += contactList
}
loadAndMountContactsToList()

const mountContact = (contact) => {
  let firstName = document.createElement('p')
  firstName.innerHTML = contact.firstName
  let lastName = document.createElement('p')
  lastName.innerHTML = contact.lastName
  return [firstName, lastName]
}

const findContactAndOpen = async(id) => {
  contactInfo = document.querySelector('.contact-information')
  contactInfo.setAttribute('class', contactInfo.className + ' open')
  let contactContent = await fetch(`/api/contacts/id/${id}`)
  let json = await contactContent.json()
  if (json) {
    console.log(mountContact(json))
    contactInfo.innerHTML = `<input type="text" value=${json.firstName} /><p>${json.lastName}</p>`
    history.pushState({}, null, '/kontakt/' + json._id);
  }
}







const [listen, unlisten] = (() => {
 
  let listeningOnType = {};
  let listeners = [];
 
  function listen(eventType, cssSelector, func){
    // Register a "listener"
    let listener = {eventType, cssSelector, func};
    listeners.push(listener);
    // If no listener on window[eventType] register a 
    // a real/raw js-listener
    if(!listeningOnType[eventType]){
      // add event listener for this type on the whole window
      window.addEventListener(eventType, e => {
        listeners
          .filter(x => x.eventType === eventType)
          .forEach(listener => {
            if(e.target.closest(listener.cssSelector)){
              listener.func(e);
            }
        });
      });
      listeningOnType[eventType] = true;
    }
    return listener;
  }
 
  function unlisten(listener){
    listeners.splice(listeners.indexOf(listener), 1);
  }
 
  return [listen, unlisten];
 
})();

// We can listen
let listener1 = listen('click', '.list-item', e => {
  findContactAndOpen(e.target.id)
  
});
let listener2 = listen('click', 'button', e => {
  console.log('You clicked a button');
});


// Show the contact based on url
const checkURLandUpdateInfo = async(url) => {
  const urlId = url.substring(url.lastIndexOf('/') + 1)
  if (urlId){findContactAndOpen(urlId)}
}
checkURLandUpdateInfo(window.location.pathname)
// We can unlisten - try commenting in these lines:
// unlisten(listener1);
// unlisten(listener2);