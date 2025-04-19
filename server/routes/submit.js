const express = require('express')
const nodemailer = require('nodemailer')
const router = express.Router()
const Event = require('../models/Submission.js')

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
})

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, eventName, eventVenue, eventTime, formId } =
      req.body

    // Save event to DB
    const newEvent = new Event({
      name,
      email,
      phone,
      eventName,
      venue: eventVenue,
      time: eventTime,
      randomId: formId,
    })
    await newEvent.save()

    // Attach PDF if base64 sent from frontend
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Event Registration Confirmation',
      html: `<p>Hello ${name},</p><p>Thank you for registering for ${eventName}!</p>`,
      attachments: [
        {
          filename: 'event-registration.pdf',
          content: req.body.pdfBase64.split('base64,')[1],
          encoding: 'base64',
        },
      ],
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: 'Registration successful!' })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).send('Something went wrong.')
  }
})

module.exports = router
