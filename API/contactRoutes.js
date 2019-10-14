const express = require("express")
const Contact = require("../schemas/Contact")

const router = express.Router()

router.get("/api/contacts", async (req, res) => {
  Contact.find().then(data => {
    res.status(200).send(data)
  })
})
router.get("/api/contacts/id/:id", async (req, res) => {  
  Contact.findById(req.params.id).then(data => {    
    res.status(200).send(data)
  })
})
router.delete("/api/contacts/id/:id", async (req, res) => {  
  let contact = await Contact.findById(req.params.id)
  console.log('DELETED: ', await contact.delete())
  res.status(200).send('Deleted')
})
router.post("/api/contacts/", async (req, res) => {  
  let contact = new Contact(req.body)
  await contact.save()
  res.status(200).send(contact)
})
router.put("/api/contacts/edit/", async (req, res) => {  
  let contact = await Contact.findById(req.body._id)
  contact.firstName = req.body.firstName
  contact.lastName = req.body.lastName
  contact.numbers = req.body.numbers
  contact.emails = req.body.emails
  contact.lastChanged = req.body.lastChanged
  contact.history = req.body.history

  await contact.save()
  res.status(200).send(contact)
  // let contact = req.body
})

router.post("/api/contacts/", (req, res) => {
  const contact = new Contact(req.body)
  contact.save(function(err) {
    if (err) {
      //next(err)
      console.log(err)
    } else {
      res.status(200).send(contact)
      console.log("SAVED: ", contact)
    }
  })
})

module.exports = router