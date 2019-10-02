class App {

  constructor() {
    this.setupInitialGUI();
    this.contactHandler = new ContactHandler(this);
  }

  setupInitialGUI() {
    this.createEl('header', '<i class="far fa-address-card"></i> Kontakter', { class: 'header' });
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
    this.currentContact = ''
  }

  addListeners() {
    listen('click', '.list-item', e => {
      this.findContactAndOpen(e.target.id)
    });
    listen('click', '.back-btn', e => {
      this.clearContactSection();
    });
    listen('click', '.reset-btn', e => {
      console.log(e.target);
    })
    listen('click', '.edit-btn', e => {
      this.renderEditLayout(this.currentContact)
    })
    listen('click', '.save-btn', e => {
      console.log(e.target);
    })
  }

  loadContacts = async () => {
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
    this.currentContact = ''
  }
  checkURLandUpdateInfo = async (url) => {
    const urlId = url.substring(url.lastIndexOf('/') + 1)
    if (urlId) { 
      this.findContactAndOpen(urlId) 
    }
  }
  renderEditLayout = (contact) => {
    console.log(contact);
    
    // let content = `
    // <div>
    //   <button class="btn back-btn">Stäng</button>
    // </div>
    // <div class="contact-info">
    //   <div class="contact-names">
    //     <span class="text-field first" id="${json._id + '-firstName'}">${json.firstName} </span>
    //     <span class="text-field" id="${json._id + '-lastName'}">${json.lastName}</span>
    //   </div>
    //   <ul class="contact-numbers">
    //     <li class="number-item"><i class="fas fa-phone-alt"></i> 0709-629276</li>
    //     <li class="number-item"><i class="fas fa-phone-alt"></i> 1234-567890</li>
    //   </ul>
    //   <ul class="contact-emails">
    //     <li class="email-item"><i class="fas fa-envelope"></i> jesper.asplund95@gmail.com</li>
    //     <li class="email-item"><i class="fas fa-envelope"></i> thisismyemail@gmail.com</li>
    //   </ul>
    // </div>
    // <div class="bottom-buttons">
    //   <button class="btn cancel-btn">Avbryt</button>
    //   <button class="btn save-btn">Spara</button>
    // </div>
    // `
  }
  findContactAndOpen = async (id) => {
    let contactInfo = document.querySelector('.contact-information')
    contactInfo.setAttribute('class', 'contact-information open')

    let contactContent = await fetch(`/api/contacts/id/${id}`)
    let json = await contactContent.json()
    if (json) {
      contactInfo.innerHTML = `
        <div>
          <button class="btn back-btn">Stäng</button>
        </div>
        <div class="contact-info">
          <div class="contact-names">
            <span class="text-field first" id="${json._id + '-firstName'}">${json.firstName} </span>
            <span class="text-field" id="${json._id + '-lastName'}">${json.lastName}</span>
          </div>
          <ul class="contact-numbers">
            <li class="number-item"><i class="fas fa-phone-alt"></i> 0709-629276</li>
            <li class="number-item"><i class="fas fa-phone-alt"></i> 1234-567890</li>
          </ul>
          <ul class="contact-emails">
            <li class="email-item"><i class="fas fa-envelope"></i> jesper.asplund95@gmail.com</li>
            <li class="email-item"><i class="fas fa-envelope"></i> thisismyemail@gmail.com</li>
          </ul>
        </div>
        <div class="bottom-buttons">
          <button class="btn reset-btn">Återställ</button>
          <button class="btn edit-btn">Redigera</button>
        </div>
        `
      history.pushState({}, null, '/kontakt/' + json._id);
      this.currentContact = json
    }
  }
}

/*${json.numbers.map(number => {
              return `<li class="number-item"><i class="fas fa-phone-alt"></i> ${number}</li>`
            })}*/

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