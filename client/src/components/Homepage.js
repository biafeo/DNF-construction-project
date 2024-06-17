import React from "react";
import { NavLink } from "react-router-dom";

function Homepage() {
  return (
    <div className="homepage">
      <div>
        <NavLink to="/sign_in" className="nav-link" activeClassName="active">
          <button>Login</button>
        </NavLink>
      </div>
      <div className="welcome">
        <div className="welcome-text">
          <h2>Professional Construction Services with Quality and Integrity</h2>
          <p>
            Residential Construction: Custom homes, renovations, and additions.
            <br />
            Commercial Construction: Office buildings, retail spaces, and
            industrial projects.
            <br />
            Project Management: End-to-end project management services.
            <br />
            Consulting Services: Construction consulting and planning.
          </p>
          <h3>Why Choose Us?</h3>
          <p>
            <strong>Experienced Team:</strong> Skilled professionals with years
            of industry experience.
            <br />
            <strong>Quality Assurance:</strong> Commitment to high standards and
            meticulous attention to detail.
            <br />
            <strong>Timely Completion:</strong> Proven track record of
            completing projects on time and within budget.
            <br />
            <strong>Customer Focused:</strong> Personalized services tailored to
            meet individual client needs.
          </p>
          <button>Contact Us Today</button>
          <p>
            Phone: (123) 456-7890
            <br />
            Email: info@constructioncompany.com
            <br />
            Address: 123 Main St, Anytown, USA
          </p>
        </div>
        {/* <img src={homeImage} className="home-image" alt="Home" /> */}
      </div>
    </div>
  );
}

export default Homepage;
