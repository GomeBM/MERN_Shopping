import React from "react";
import "./About.css";
import { ReactComponent as Logo } from "../../assets/gambashop.svg";

const About = () => {
  return (
    <div className="about-page">
      <Logo width="100%" height="100%" />
      <section className="store-info">
        <h1 className="about-header">About Our Store</h1>
        <p>
          Welcome to <b>Gambashop!</b> We are dedicated to providing you with
          the best products at the best prices. Our store offers a very wide
          range of products, from your day to day grocery needs to home
          appliances and even cars and motorbikes! Take a look around our store,
          if there is anything you're searching for, we probably have it!
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
          Hello! My name is Gome Ben Moshe, and I am the founder of Gambashop.
          With a passion for building mock websites, I started this store to
          offer quality products and great service to our valued customers.
        </p>
        <p>
          When I’m not working on the store, I enjoy building other mock
          websites. Feel free to reach out if you have any questions or just
          want to say hello through the contact page.
        </p>
      </section>
    </div>
  );
};

export default About;
