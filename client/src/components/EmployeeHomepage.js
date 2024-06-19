import React, { useState } from "react";
import "../homepage.css";
import homepage from "./homepage.jpg";
import image0 from "./image0.png";
import image1 from "./image1.png";
import image2 from "./image2.png";
import image3 from "./image3.png";
import contact1 from "./contact1.jpeg";
import contact2 from "./contact2.jpeg";
import contact3 from "./contact3.jpeg";

function EmployeeHomepage() {
  const [isFormVisible, setFormVisible] = useState(false);

  const toggleForm = () => {
    setFormVisible(!isFormVisible);
  };

  return (
    <>
      <div className="homepage" style={{ backgroundImage: `url(${homepage})` }}>
        <section id="about-us">
          <div className="welcome">
            <div className="welcome-text">
              <h2>Professional Construction Services</h2>
              <p>
                <div className="centered-block1">Residential Construction</div>
                <div className="centered-block">
                  Custom homes, renovations, and additions.
                </div>
                <div className="centered-block1">Commercial Construction</div>
                <div className="centered-block">
                  Office buildings, retail spaces, and industrial projects.
                </div>
                <div className="centered-block1">Project Management</div>
                <div className="centered-block">
                  End-to-end project management services.
                </div>
                <div className="centered-block1">Consulting Services</div>
                <div className="centered-block">
                  Construction consulting and planning.
                </div>
              </p>
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
              <img src={image0} alt="Experienced Team" />
              <p>Skilled professionals with years of industry experience.</p>
            </div>
            <div className="why-card">
              <strong>Quality Assurance</strong>
              <br />
              <img src={image1} alt="Quality Assurance" />
              <p>
                Commitment to high standards and meticulous attention to detail.
              </p>
            </div>
            <div className="why-card">
              <strong>Timely Completion</strong>
              <br />
              <img src={image2} alt="Timely completion" />
              <p>
                Proven track record of completing projects on time and within
                budget.
              </p>
            </div>
            <div className="why-card">
              <strong>Customer Focused</strong>
              <br />
              <img src={image3} alt="Customer Focused" />
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
            <img src={contact1} alt="Phone icon" />
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="contact">
            <img src={contact2} alt="Email icon" />
            <p>Email: info@constructioncompany.com</p>
          </div>
          <div className="contact">
            <img src={contact3} alt="Address icon" />
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
                <input type="text" placeholder="Name" required />
              </label>
              <label>
                <input type="email" placeholder="Email" required />
              </label>
              <label>
                <textarea placeholder="Message" required />
              </label>
              <button type="submit" className="contact-submit-button">
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default EmployeeHomepage;
