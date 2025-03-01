import React from "react";
import "./aboutMe.css";

const AboutMe = () => {
  return (
    <div className="about-me-container">
      <div className="container">
        <h1>About Me</h1>
        <h2>Assalamu Alaikum !</h2>

        <p id="about-me-msg">
          Welcome to my space! I'm <span className="bold">Mohammad Anas</span>, a freelance web developer dedicated to crafting customized digital solutions that meet your unique goals. I specialize in building modern, user-friendly websites designed to enhance your online presence and make a lasting impression. Whether you have a clear vision or need help shaping your ideas, I'm here to help turn your ideas into reality by building a website that not only meets your needs but also guides you through the process, ensuring your vision comes to life with clarity and confidence.
          <br />
          Feel free to reach out:
          <br />
          📞 Phone: +91 7603893276
          <br />
          📧 Email: <a href="mailto:mohammad.anas51@hotmail.com">mohammad.anas51@hotmail.com</a>
          <br />
          Let's create something amazing together!
        </p>
      </div>
    </div>
  );
};

export default AboutMe;
