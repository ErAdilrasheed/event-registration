import React, { useState, useRef } from 'react'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { v4 as uuidv4 } from 'uuid'

const eventOptions = [
  {
    name: 'AI Effect On Job',
    venue: 'Hall A, Hyderabad Convention Center',
    time: '10:00 AM - 1:00 PM',
  },
  {
    name: 'Startup Expo',
    venue: 'Mudra Banquet, Hyderabad',
    time: '2:00 PM - 6:00 PM',
  },
  {
    name: 'Google Summit',
    venue: 'Hitech-City, Hyderabad',
    time: '8:00 PM - 11:00 PM',
  },
]

const EventForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventName: '',
    eventVenue: '',
    eventTime: '',
  })

  const [confirmationMessage, setConfirmationMessage] = useState('')
  const formRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const { name, email, phone, eventName } = formData
    if (!name || !email || !phone || !eventName) {
      alert('All fields are required.')
      return false
    }
    const emailValid = /\S+@\S+\.\S+/.test(email)
    const phoneValid = /^\d{10}$/.test(phone)
    if (!emailValid || !phoneValid) {
      alert('Invalid email or phone number')
      return false
    }
    return true
  }

  const generatePDFBase64 = async () => {
    const input = formRef.current
    const canvas = await html2canvas(input, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'pt', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    return pdf.output('datauristring')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const newFormId = uuidv4().slice(0, 8)

    try {
      const pdfBase64 = await generatePDFBase64()

      await axios.post('https://adil-event-registration.onrender.com', {
        ...formData,
        formId: newFormId,
        pdfBase64,
      })

      setConfirmationMessage(
        '🎉 Congratulations! Your registration is confirmed.'
      )

      // Reset form and confirmation after 5 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventName: '',
          eventVenue: '',
          eventTime: '',
        })
        setConfirmationMessage('')
      }, 5000)
    } catch (err) {
      console.error(err)
      alert('Form submission failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 p-4 sm:p-10">
      <div
        ref={formRef}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10 space-y-6"
      >
        <img
          src="https://res.cloudinary.com/dr5kn8993/image/upload/v1744981658/My%20Images/banner_rkvild.png"
          alt="Event Banner"
          className="w-full h-48 sm:h-64 object-cover rounded-md shadow-md mb-4"
        />
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Event Registration
        </h2>

        {!confirmationMessage ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone (10 digits)"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            />

            <div>
              <label className="font-semibold block mb-1">Select Event:</label>
              <select
                className="w-full border rounded-md p-2"
                onChange={(e) => {
                  const selected = eventOptions.find(
                    (ev) => ev.name === e.target.value
                  )
                  setFormData((prev) => ({
                    ...prev,
                    eventName: selected.name,
                    eventVenue: selected.venue,
                    eventTime: selected.time,
                  }))
                }}
                value={formData.eventName}
              >
                <option value="">-- Choose an event --</option>
                {eventOptions.map((event, index) => (
                  <option key={index} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.eventName && (
              <div className="bg-gray-100 rounded-md p-3 text-sm text-gray-700">
                <p>
                  <strong>Venue:</strong> {formData.eventVenue}
                </p>
                <p>
                  <strong>Time:</strong> {formData.eventTime}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="text-center mt-6">
            <h3 className="text-2xl font-bold text-green-600">
              {confirmationMessage}
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventForm
