import React from "react";
import "./About.css"; // Import the CSS file for styling

const About = () => {
  return (
    <div className="about-page">
      <section className="store-info">
        <h1 className="about-header">About Our Store</h1>
        <p>
          Welcome to [Store Name]! We are dedicated to providing you with the
          best products at the best prices. Our store offers a wide range of
          [products/services], carefully selected to meet your needs.
        </p>
        <p>
          Our mission is to deliver exceptional customer service and ensure that
          every shopping experience is pleasant and satisfying. Thank you for
          choosing us!
        </p>
      </section>
      <section className="about-me">
        <h1 className="about-header">About Me</h1>
        <p>
          Hello! My name is [Your Name], and I am the founder of [Store Name].
          With a passion for [your passion or industry], I started this store to
          offer quality products and great service to our valued customers.
        </p>
        <p>
          When I’m not working on the store, I enjoy [your hobbies/interests].
          Feel free to reach out if you have any questions or just want to say
          hello!
        </p>
      </section>
    </div>
  );
};

export default About;
