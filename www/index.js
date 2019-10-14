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
    listen('click', '.edit-btn', e => {
      this.renderEditLayout(this.currentContact)
    })
    listen('click', '.save-btn', e => {
      this.saveUpdatedContact(this.currentContact)
    })
    listen('click', '.cancel-btn', e => {
      this.findContactAndOpen(this.currentContact._id)
    })
    listen('click', '.add-number', e => {
      this.addNumber()
    })
    listen('click', '.remove-number', e => {
      this.removeField(e)
    })
    listen('click', '.add-email', e => {
      this.addEmail()
    })
    listen('click', '.remove-email', e => {
      this.removeField(e)
    })
    listen('click', '.reset-btn', e => {
      this.renderHistory(this.currentContact)
    })
    listen('click', '.new-contact', e => {
      this.renderNewContactLayout()
    })
    listen('click', '.save-new-btn', e => {
      this.saveNewContact()
    })
    listen('click', '.reset-time', e => {
      this.renderOlderVersionLayout(e.target.innerHTML)
    })
    listen('click', '.delete-btn', e => {
      this.deleteContact(this.currentContact)
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
    let contactList = '<ul class="list">' + sortedByFirstName.map(contact => {
      return `<li class="list-item" id="${contact._id}">` + contact.firstName + (contact.lastName ? ' ' + contact.lastName : '') + '</li>'
    }).join('') + '</ul>'

    let newBtn = document.createElement('button')
    newBtn.setAttribute('class', 'new-contact')
    newBtn.innerHTML = '<i class="fas fa-plus"></i>'

    let listSection = document.querySelector('.contact-list')
    listSection.innerHTML = contactList
    listSection.append(newBtn)

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
    if (urlId === 'ny-kontakt') {
      this.renderNewContactLayout()
    } else if (urlId) {
      this.findContactAndOpen(urlId)
    }
  }
  addNumber = () => {
    let newNumberField = document.createElement('li')
    newNumberField.innerHTML = `<i class="fas fa-phone-alt"></i> <input class="number-input" placeholder="telefonnummer" type="text" /><button class="btn remove-number">X</button>`
    newNumberField.setAttribute('class', 'number-item')
    document.querySelector('.contact-numbers').append(newNumberField)
  }
  addEmail = () => {
    let newEmailField = document.createElement('li')
    newEmailField.innerHTML = `<i class="fas fa-envelope"></i> <input class="email-input" placeholder="telefonnummer" type="text" /><button class="btn remove-email">X</button>`
    newEmailField.setAttribute('class', 'email-item')
    document.querySelector('.contact-emails').append(newEmailField)
  }
  removeField = (e) => {
    e.target.parentNode.parentNode.removeChild(e.target.parentNode)
  }
  renderHistory = (contact) => {
    let contactInfo = document.querySelector('.contact-information')

    let content = `
      <div>
        <button class="btn back-btn">Stäng</button>
      </div>
      <ul class="contact-info">
        <p style="margin-bottom: 20px">Klicka på önskat datum för att öppna dåvarande version</p>
        <li class="reset-time"><b>${contact.lastChanged} (Nuvarande)</b></li>
        ${[...contact.history].reverse().map(data => {
      return `<li class="reset-time">${data.lastChanged}</li>`
    }).join('')}
      </ul>
      <div class="bottom-buttons">
        <button class="btn cancel-btn">Avbryt</button>
      </div>
    `
    contactInfo.innerHTML = content
  }
  deleteContact = async (contact) => {
    if (confirm(`Är du säker på att du vill ta bort kontakten ${contact.firstName + ' ' + contact.lastName}?`)) {
      await fetch(`/api/contacts/id/${contact._id}`, {
        method: 'DELETE'
      })
      this.loadAndMountContactsToList()
      this.clearContactSection()
    }
  }
  saveNewContact = async () => {
    let newContact = {}
    let numbers = [...document.querySelectorAll('.number-input')].map(number => number.value)
    let emails = [...document.querySelectorAll('.email-input')].map(number => number.value)
    newContact.firstName = document.querySelector('.firstName-input').value
    newContact.lastName = document.querySelector('.lastName-input').value
    newContact.numbers = numbers
    newContact.emails = emails
    newContact.lastChanged = new Date()

    let rawFetchData = await fetch(`/api/contacts`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newContact)
    })
    let savedContact = await rawFetchData.json();

    this.findContactAndOpen(savedContact._id)
    this.loadAndMountContactsToList()
  }
  saveUpdatedContact = async (contact) => {
    let newContact = { ...contact }
    let numbers = [...document.querySelectorAll('.number-input')].map(number => number.value)
    let emails = [...document.querySelectorAll('.email-input')].map(number => number.value)
    newContact.firstName = document.querySelector('.firstName-input').value
    newContact.lastName = document.querySelector('.lastName-input').value
    newContact.numbers = numbers
    newContact.emails = emails
    newContact.lastChanged = new Date()
    let oldContact = { ...contact }
    delete oldContact.history
    newContact.history.push({ ...oldContact })

    console.log(newContact);

    await fetch(`/api/contacts/edit`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newContact)
    })
    this.findContactAndOpen(contact._id)
    this.loadAndMountContactsToList()
  }
  findContactVersion = async (lastChangedStamp) => {
    // If "nuvarande" is pressed, only keep the timestamp
    let removeNuvarandeTag = lastChangedStamp.split(' ')[0]

    let rawContact = await fetch(`/api/contacts/id/${this.currentContact._id}`)
    let contactJSON = await rawContact.json()
    const found = await contactJSON.history.find(contact => { return contact.lastChanged === removeNuvarandeTag })
    return found;
  }
  renderOlderVersionLayout = async (lastChangedStamp) => {
    let contact = await this.findContactVersion(lastChangedStamp)
    let content = `
      <div>
        <button class="btn back-btn">Stäng</button>
      </div>
      <div class="contact-info">
        <div class="contact-names">
          <input class="text-field first firstName-input" value="${contact.firstName}" />
          <input class="text-field lastName-input" value="${contact.lastName}" />
        </div>
        <ul class="contact-numbers">
          ${contact.numbers.map((number) => {
      return `<li class="number-item"><i class="fas fa-phone-alt"></i> <input class="number-input" value="${number}" type="text" /><button class="btn remove-number">X</button></li>`
    }).join('')}
        </ul>
        <button class="btn add-number">Nytt nummer</button>
        <ul class="contact-emails">
          ${contact.emails.map((email) => {
      return `<li class="number-item"><i class="fas fa-envelope"></i> <input class="email-input" value="${email}" type="text" /><button class="btn remove-email">X</button></li>`
    }).join('')}
        </ul>
        <button class="btn add-email">Ny epost</button>
      </div>
      <div class="bottom-buttons">
        <button class="btn cancel-btn">Avbryt</button>
        <button class="btn save-btn">Spara</button>
      </div>
    `
    let contactInfo = document.querySelector('.contact-information')
    contactInfo.innerHTML = content

  }
  renderNewContactLayout = () => {
    let contactInfo = document.querySelector('.contact-information')
    contactInfo.setAttribute('class', 'contact-information open')

    let content = `
      <div>
        <button class="btn back-btn">Stäng</button>
      </div>
      <div class="contact-info">
        <div class="contact-names">
          <input class="text-field first firstName-input" placeholder="Förnamn" />
          <input class="text-field lastName-input" placeholder="Efternamn" />
        </div>
        <ul class="contact-numbers">
          <li class="number-item"><i class="fas fa-phone-alt"></i> <input class="number-input" placeholder="telefonnummer" type="text" /><button class="btn remove-number">X</button></li>
        </ul>
        <button class="btn add-number">Nytt nummer</button>
        <ul class="contact-emails">
          <li class="number-item"><i class="fas fa-envelope"></i> <input class="email-input" placeholder="epostadress" type="text" /><button class="btn remove-email">X</button></li>
        </ul>
        <button class="btn add-email">Ny epost</button>
      </div>
      <div class="bottom-buttons">
        <button class="btn save-new-btn">Spara</button>
      </div>
    `
    contactInfo.innerHTML = content
    history.pushState({}, null, '/ny-kontakt');

  }
  renderEditLayout = (contact) => {
    let contactInfo = document.querySelector('.contact-information')

    let content = `
      <div>
        <button class="btn back-btn">Stäng</button>
      </div>
      <div class="contact-info">
        <div class="contact-names">
          <input class="text-field first firstName-input" value="${contact.firstName}" />
          <input class="text-field lastName-input" value="${contact.lastName}" />
        </div>
        <ul class="contact-numbers">
          ${contact.numbers.map((number, i) => {
      return `<li class="number-item"><i class="fas fa-phone-alt"></i> <input class="number-input" value="${number}" type="text" /><button class="btn remove-number">X</button></li>`
    }).join('')}
        </ul>
        <button class="btn add-number">Nytt nummer</button>
        <ul class="contact-emails">
          ${contact.emails.map((email, i) => {
      return `<li class="number-item"><i class="fas fa-envelope"></i> <input class="email-input" value="${email}" type="text" /><button class="btn remove-email">X</button></li>`
    }).join('')}
        </ul>
        <button class="btn add-email">Ny epost</button>
      </div>
      <div class="bottom-buttons">
        <button class="btn cancel-btn">Avbryt</button>
        <button class="btn save-btn">Spara</button>
      </div>
    `
    contactInfo.innerHTML = content
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
            ${json.numbers.map(number => {
        return `<li class="number-item"><i class="fas fa-phone-alt"></i> ${number}</li>`
      }).join('')}
          </ul>
          <ul class="contact-emails">
            ${json.emails.map(email => {
        return `<li class="number-item"><i class="fas fa-envelope"></i> ${email}</li>`
      }).join('')}
          </ul>
        </div>
        <div class="bottom-buttons">
          <button class="btn reset-btn">Återställ</button>
          <button class="btn edit-btn">Redigera</button>
        </div>
        <div class="bottom-buttons">
          <button class="btn delete-btn">Ta bort</button>
        </div>
        `
      history.pushState({}, null, '/kontakt/' + json._id);
      this.currentContact = json
    }
  }
}

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