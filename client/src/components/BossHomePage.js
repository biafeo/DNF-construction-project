import React, { useState } from "react";
import "../homepage.css";
import homepage from "./homepage.jpg";

function BossHomePage() {
  const [isFormVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Email sent successfully!");
          setFormVisible(false);
          setFormData({ name: "", email: "", message: "" });
        } else {
          alert("Failed to send email. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <>
      <div className="homepage" style={{ backgroundImage: `url(${homepage})` }}>
        <section id="about-us">
          <div className="welcome">
            <div className="welcome-text">
              <h2>Professional Construction Services</h2>
              <div className="service-section">
                <div className="centered-block1">Residential Construction</div>
                <div className="centered-block">
                  Custom homes, renovations, and additions.
                </div>
              </div>
              <div className="service-section">
                <div className="centered-block1">Commercial Construction</div>
                <div className="centered-block">
                  Office buildings, retail spaces, and industrial projects.
                </div>
              </div>
              <div className="service-section">
                <div className="centered-block1">Project Management</div>
                <div className="centered-block">
                  End-to-end project management services.
                </div>
              </div>
              <div className="service-section">
                <div className="centered-block1">Consulting Services</div>
                <div className="centered-block">
                  Construction consulting and planning.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section id="why-us">
        <div className="after-image-content">
          <h3 className="styled-h3">Why Choose Us?</h3>
          <div className="why-cards-container">
            <div className="why-card">
              <strong>Experienced Team</strong>
              <br />
              <img src="/image0.png" alt="Experienced Team" />
              <p>Skilled professionals with years of industry experience.</p>
            </div>
            <div className="why-card">
              <strong>Quality Assurance</strong>
              <br />
              <img src="/image1.png" alt="Quality Assurance" />
              <p>
                Commitment to high standards and meticulous attention to detail.
              </p>
            </div>
            <div className="why-card">
              <strong>Timely Completion</strong>
              <br />
              <img src="/image2.png" alt="Timely completion" />
              <p>
                Proven track record of completing projects on time and within
                budget.
              </p>
            </div>
            <div className="why-card">
              <strong>Customer Focused</strong>
              <br />
              <img src="/image3.png" alt="Customer Focused" />
              <p>
                Personalized services tailored to meet individual client needs.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="contact">
        <h3 className="styled-h3">Contact us</h3>
      </section>
      <div className="contact-form-container">
        <div className="contact-container">
          <div className="contact">
            <img src="/contact1.jpeg" alt="Phone icon" />
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="contact">
            <img src="/contact3.jpeg" alt="Email icon" />
            <p>Email: info@constructioncompany.com</p>
          </div>
          <div className="contact">
            <img src="/contact2.jpeg" alt="Address icon" />
            <p>Address: 123 Main St, Anytown, USA</p>
          </div>
        </div>
        <div>
          <button className="contact-us-button" onClick={toggleForm}>
            Contact Us Today
          </button>
          {isFormVisible && (
            <form className="contact-form">
              <label>
                <input
                  type="text"
                  placeholder="Name"
                  defaultValue=""
                  required
                />
              </label>
              <label>
                <input
                  type="email"
                  placeholder="Email"
                  defaultValue=""
                  required
                />
              </label>
              <label>
                <textarea placeholder="Message" defaultValue="" required />
              </label>
              <div className="button-container">
                <button type="submit" className="contact-submit-button">
                  Submit
                </button>
                <button
                  type="button"
                  className="contact-submit-button"
                  onClick={toggleForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
export default BossHomePage;
