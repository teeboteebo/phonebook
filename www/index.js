class App {

  constructor() {
    this.setupInitialGUI();
    this.contactHandler = new ContactHandler(this);
  }

  setupInitialGUI() {
    this.createEl('header', 'Super duper telefonbok', { class: 'header' });
    this.createEl('main');
    this.createEl('section', '', { class: 'contact-list' }, document.querySelector('main'));
    this.createEl('section', '', { class: 'contact-information' }, document.querySelector('main'));
  }


  createEl(newElName, html = '', attributes = {}, root = document.body) {
    let newEl = document.createElement(newElName);
    newEl.innerHTML = html;
    for (let [key, val] of Object.entries(attributes)) {
      newEl.setAttribute(key, val);
    }
    root.append(newEl);
  }

}

class ContactHandler {
  constructor() {
    // run submethods
    this.loadAndMountContactsToList();
    this.checkURLandUpdateInfo(window.location.pathname);
    this.addListeners();
  }

  addListeners() {
    listen('click', '.list-item', e => {
      this.findContactAndOpen(e.target.id)
    });
    listen('click', '.back-button', e => {
      console.log('running');
      this.clearContactSection();
    });
  }

  loadContacts = async () => {
    console.log('running');
    let allContacts = await fetch('/api/contacts')
    let json = await allContacts.json()
    return json
  }

  loadAndMountContactsToList = async () => {
    let contacts = await this.loadContacts()
    let sortedByFirstName = [...contacts].sort((a, b) => a.firstName.localeCompare(b.firstName, 'sv'))
    let contactList = '<ul>' + sortedByFirstName.map(contact => {
      return `<li class="list-item" id="${contact._id}">` + contact.firstName + (contact.lastName ? ' ' + contact.lastName : '') + '</li>'
    }).join('') + '</ul>'
    let listSection = document.querySelector('.contact-list')
    listSection.innerHTML = contactList
  }

  clearContactSection = () => {
    let contactInfo = document.querySelector('.contact-information')
    contactInfo.setAttribute('class', contactInfo.className.replace(' open', ''))
    contactInfo.innerHTML = ''
    history.pushState({}, null, '/');
  }
  checkURLandUpdateInfo = async (url) => {
    const urlId = url.substring(url.lastIndexOf('/') + 1)
    if (urlId) { this.findContactAndOpen(urlId) }
  }
  findContactAndOpen = async (id) => {
    let contactInfo = document.querySelector('.contact-information')
    contactInfo.setAttribute('class', 'contact-information open')
    
    let contactContent = await fetch(`/api/contacts/id/${id}`)
    let json = await contactContent.json()
    if (json) {
      contactInfo.innerHTML = `
        <div>
          <button class="back-button">Stäng</button>
        </div>
        <div class="contact-info">
          <div class="contact-names">
            <span class="text-field first" id="${json._id + '-firstName'}">${json.firstName}</span>
            <span class="text-field" id="${json._id + '-lastName'}">${json.lastName}</span>
          </div>
        </div>
        `
      history.pushState({}, null, '/kontakt/' + json._id);
    }
  }
}

// <div>
//           <button class="back-button">Stäng</button>
//         </div>
//         <div class="inputs">
//           <div class="input-grp">
//             <label class="input-label" for="${json._id + '-firstname'}">Förnamn</label><br />
//             <input class="input-field" id="${json._id + '-firstName'}" type="text" value=${json.firstName} /> <br />
//           </div>
//           <div class="input-grp">
//             <label class="input-label" for="${json._id + '-lastName'}">Efternamn</label><br />
//             <input class="input-field" id="${json._id + '-lastName'}" type="text" value=${json.lastName} /> <br />
//           </div>
//         </div>


const [listen, unlisten] = (() => {

  let listeningOnType = {};
  let listeners = [];

  function listen(eventType, cssSelector, func) {
    // Register a "listener"
    let listener = { eventType, cssSelector, func };
    listeners.push(listener);
    // If no listener on window[eventType] register a 
    // a real/raw js-listener
    if (!listeningOnType[eventType]) {
      // add event listener for this type on the whole window
      window.addEventListener(eventType, e => {
        listeners
          .filter(x => x.eventType === eventType)
          .forEach(listener => {
            if (e.target.closest(listener.cssSelector)) {
              listener.func(e);
            }
          });
      });
      listeningOnType[eventType] = true;
    }
    return listener;
  }

  function unlisten(listener) {
    listeners.splice(listeners.indexOf(listener), 1);
  }

  return [listen, unlisten];

})();


new App()