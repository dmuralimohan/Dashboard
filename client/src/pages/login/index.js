import React, { useState, useRef, useEffect } from "react";
import { SlideShow, Input, Toast, ToastContainer } from "components";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { submitLogin } from "services";
// import { getResourceValue } from "utils/resources";
import GuestImage from "../../assets/guest/gues_default.png";
import Slide1 from "../../assets/slide/slide1.jpg";
import Slide2 from "../../assets/slide/slide2.jpg";
import Slide3 from "../../assets/slide/slide3.jpg";
import Slide4 from "../../assets/slide/slide4.jpg";

import "./login.page.css";

const FormHeader = () => {
  return(
    <div className="header">
       <h1>Login</h1>
       <img src={ GuestImage } alt="guest_default" />
    </div>
  )
}

const Login = () => {

  /*const importAll = (r) => {
    const uniqueImages = new Set();

    r.keys().map(r).filter(image => !uniqueImages.has(image) ? uniqueImages.add(image) : undefined);

    return Array.from(uniqueImages);
  }
  const images = importAll(require.context("../../assets/slide", false, /\.(jpg|jpeg)$/));*/
  
  const images = [<Slide1 />, <Slide2 />, <Slide3 />, <Slide4 />];
  const { register, handleSubmit, formState: {errors}, setError} = useForm();
  const [passwordLabel, setPasswordLabel] = useState({icon: "bi bi-eye-slash-fill", type:"password"});
  const [duration, setDuration] = useState(2000);
  const targetRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const targetElement = entries[0];
      if (!targetElement.isIntersecting) {
        setDuration(0);
      }
      else setDuration(2000);
    }, [duration]);

    observer.observe(targetRef.current);

    // return () => {
    //   observer.unobserve(targetRef.current);
    // };
  }, []);

  const onSubmit = async (data) => {
    try{
        console.log(data);
        console.log(`Data before passing ${JSON.stringify(data)}`);
        const result = await submitLogin(data);
        console.log(result);

        if(result) {
          Toast({
            message: result.message || "Something went wrong please, try again later...",
            position: "top-center",
            type: result.error ? "error" : "success",
            themeType: "light",
            delay: 3000,
            pauseOnHover: true,
            closeIcon: true
          });

          if(!result.error) {
            setTimeout(() => {
              const { from } = location.state || { from: { pathname: '/' } };
        
              return navigate(from, { replace: true });
            }, 3000);
          }
        }
    }
    catch(err)
    {
      return setErrorMessage(err);
    }
  }
  
  const togglePassword = () => {
    const passwordIcon = passwordLabel.icon === "bi bi-eye-slash-fill" ? "bi bi-eye-fill" : "bi bi-eye-slash-fill";
    const passwordType = passwordLabel.type === "password" ? "text" : "password";
    setPasswordLabel( (prev) => ({
      ...prev,
      icon : passwordIcon,
      type : passwordType
    }));
  }

  return (
    <div className="container">

      <div id="slideShow" ref={targetRef}>
        <SlideShow imageData={images} duration={duration} isButton={false} />
      </div>

      <form method="post" onSubmit={handleSubmit(onSubmit)} className="form" autoComplete="on">
         <FormHeader />
         {errorMessage && <span className="error">{errorMessage}</span>}
          <Input
            type="text"
            name = "username"
            label = "Username (or) Email"
            register = {register("username", {
              required: "Please fill the Email",
              pattern: {
                value:/[a-z,0-9]/g,
                message: "Please fill the email correctly"
              }
            })}
            errors = {errors}
          />
          <Input
            type={ passwordLabel.type }
            name = "password"
            label = "Password"
            icon = { passwordLabel.icon }
            iconClick = { () => togglePassword()}
            register = { register("password", {
              required: "Please fill the Password",
            })}
            errors = {errors}
          />
          <a href="#" className="forgetPassword" >Forget Password?</a>
          <Input 
            type="submit"
            value="Login"
            className="submit"
          />
          <p className="newAccount">
            (or)
            <br />
            <NavLink to="/register">Click to Create a Account</NavLink>
          </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
