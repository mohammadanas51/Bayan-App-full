import React from "react";
import "./homepage.css" ; 
import { Link } from 'react-router-dom';
const Homepage = ()=>{
    return(
        <div className="header-logo">
            <header >
                <img src="/HeadLogo.jpg" alt="" />
            </header>
            <p id="ayat-tamil"> எவர் அல்லாஹ்வின் பக்கம் (மக்களை) அழைத்து(த் தானும்) நற்செயல்களைச் செய்து ‘‘நிச்சயமாக நான் அல்லாஹ்வுக்கு முற்றிலும் பணிந்து வழிப்பட்டவர்களில் ஒருவன்'' என்றும் கூறுகிறாரோ, அவரைவிட அழகான வார்த்தை கூறுபவர் யார்? <br />
            அல் குர்ஆன் - 41:33
            </p>

            <div className="btns">

            <Link to="/login">
            <button type="button" class="btn btn-success" id="login">Log In</button>
            </Link>

            <Link to="/signup">
            {/* <button type="button" class="btn btn-dark" id="signup">Signup</button> */}
            <button type="button" class="btn btn-light" id="signup">Sign Up</button>
            </Link>
            </div>
            </div>
    )
};

export default Homepage ; 