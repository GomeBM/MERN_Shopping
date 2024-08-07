import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./Contact.css";
import Popup from "../../components/Popup";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [popup, setPopup] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send(
        process.env.REACT_APP_EMAIL_SERVICE_ID,
        process.env.REACT_APP_CONTACT_TEMPLATE_ID,
        {
          sender_name: formData.fullName,
          from_email: formData.email,
          message: formData.message,
        },
        process.env.REACT_APP_EMAIL_PUBLIC_KEY // Public key here
      );

      // On success
      setPopup({
        message: "Your message has been sent successfully.",
        productImage: null,
      });
      setFormData({
        fullName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      // On error
      console.error("EmailJS Error:", error);
      setPopup({
        message: "Failed to send message. Please try again.",
        productImage: null,
      });
    }
  };

  const handleClosePopup = () => {
    setPopup(null);
  };

  return (
    <div className="contact-page">
      <h1>Fill out the form bellow in order to contact us</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">E-mail adress:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />

        <button type="submit">Send Message</button>
      </form>
      {popup && <Popup message={popup.message} onClose={handleClosePopup} />}
    </div>
  );
};

export default Contact;
