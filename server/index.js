require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const QRCode = require('qrcode')

const Submission = require('./models/Submission')
const generatePdfFromHtml = require('./services/pdfService')
const sendMail = require('./utils/mailer')

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' })) // handle larger payloads
app.use(express.urlencoded({ extended: true, limit: '50mb' }))


// DB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err))

// POST /submit
app.post('/submit', async (req, res) => {
  const { name, email, phone, eventName, eventVenue, eventTime } = req.body
  const formId = Math.floor(Math.random() * 900000 + 100000).toString()

  const qrData = {
    name,
    email,
    phone,
    eventName,
    eventVenue,
    eventTime,
    formId,
  }
  const qrCode = await QRCode.toDataURL(JSON.stringify(qrData))

  const submission = new Submission({
    name,
    email,
    phone,
    eventName,
    eventVenue,
    eventTime,
    qrCode,
    formId,
  })

  await submission.save()

  // Generate PDF HTML
 const html = `
  <div style="font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333;">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://res.cloudinary.com/dr5kn8993/image/upload/v1744981658/My%20Images/banner_rkvild.png" alt="Event Banner" style="max-width: 100%; margin-top: 20px; border-radius: 8px;" />
    </div>

    <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <h2 style="text-align: center; color: #222; margin-bottom: 25px;">🎉 Event Registration</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Event:</strong> ${eventName}</p>
      <p><strong>Venue:</strong> ${eventVenue}</p>
      <p><strong>Time:</strong> ${eventTime}</p>
      <p><strong>Form ID:</strong> ${formId}</p>

      <div style="text-align: center; margin-top: 30px;">
        <h4 style="margin-bottom: 10px;">Your QR Code</h4>
        <img src="${qrCode}" width="250" height="250" style="border: 4px solid #333; border-radius: 8px;" />
      </div>
    </div>
  </div>
`




  const pdfBuffer = await generatePdfFromHtml(html)

  await sendMail(
    email,
    'Event Registration Confirmation',
    'See attached PDF.',
    [{ filename: 'registration.pdf', content: pdfBuffer }]
  )

  res.json({ message: 'Form submitted successfully!' })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
