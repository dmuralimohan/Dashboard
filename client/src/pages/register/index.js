import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input, Button, Select, Option } from "components";
import countryCodes from "country-codes-list";
import { submitRegister } from "services";
import { DateInfo } from "common";

import "./register.page.css";

const InputComponent = ({type, placeholder, errors, name, label, value, register, children}) => {

    return(
        <>
        {errors && errors[name] && <p style= { { color: "#ff0000", width: "85%"} }>{ errors[name].message }</p>}
        <Input
            type= {type}
            placeholder= {placeholder}
            errors = {errors}
            name = {name}
            value = {value}
            register = {register}
            label= {label}
        >
            {children}
        </Input>
        </>
    )
}

const Header = ({title, content}) =>{
    return(
        <>
        <h2>{title}</h2>
        <p>{content}</p>
        </>
    )
}
const handleSubmit = async(event, trigger, name, callBack) =>{
    event.preventDefault();
    name.forEach(async (value, index) =>{
        if(!(await trigger(name[index]))){
            name = value;
        }
    });
    if(await trigger(name)){
        return callBack(name);
    }
    return false;
}
const Component = ({callBack, title, style, buttonValue= null, isInput, placeholder= undefined, label= undefined, value, type= undefined, name= undefined, content, register, errors, trigger, children}) =>{

    return(
        <div id="signUp" style={style}>
            <Header title={title} content={content} />
            {
                name && isInput && name.map((n,i) => {

                    return(
                        <InputComponent
                        key= {n+i}
                        type= {type[i] ?? type[0]}
                        placeholder= {placeholder[i] ?? placeholder[0]}
                        name= {n ?? name[0]}
                        register= {register[i]}
                        errors= {errors}
                        label= {label}
                        />
                    )
                })
            }
            {children}
            <br />
            <br />
            { buttonValue && 
                <Button
                key= {`${title}`}
                type="button"
                Click= {(e) => handleSubmit(e, trigger, name, callBack)}
                value= {buttonValue}
                />
            }
            <br />
            <br />
        </div>
    )
}

const DobComponent = ({register, errors, getValues, setValue}) =>{
    
    // const [dob, setUserDob] = useState("");
    const dateInfo = new DateInfo();
    const totalDates = dateInfo.getDates();
    const Months = dateInfo.getMonths();
    let userDob = "";

    // useEffect(() => setValue("dob", dob));

    const validateDate = () =>{
        const date = getValues("birthdate");
        const month = getValues("birthmonth");
        const year = getValues("birthyear");

        userDob = year + "-"+ month +"-"+ date;

        if(!date || !month || !year){
            return "The information is required.";
        }
        else if(!dateInfo.isValidDate(userDob)){
            return "The birth date entered is invalid.";
        }

        // setUserDob(userDob);

        return true;
    }
    
    return(
        <>
        <label id="doblabel">Birthdate</label>
        {errors && errors["birthdate"] && <p style= { { color: "#ff0000", width: "85%"} }>{ errors["birthdate"].message }</p>}
        <div className="dob">
            <Select className= "date" name= "birthdate" register={register("birthdate",{required:"The information is required.", validate: () => validateDate()})} required= {true}>
                {totalDates.map(d => <Option key={d} value={d}> {d} </Option>)}
            </Select>
            <Select className= "month" name= "birthmonth" register={register("birthmonth",{required:"The information is required.", validate: () => validateDate()})} required= {true}>
                <>
                <Option key="0" value="Month" disabled= {true} selected>Month</Option>
                {Object.keys(Months).map(m => <Option key={Months[m]} value= {Months[m]}> {m} </Option>)}
                </>
            </Select>
            <Input type= "number" className= "year" key= "year" name= "birthyear" placeholder= "Year" register={register("birthyear",{required:"The information is required.", validate: () => validateDate()})} />
        </div>
        </>
    )
}

const Register = ({email}) => {
    const defaultValues = {
        country: "IN",
        email: "dmuralimohan2001@gmail.com",
        password: "Murali@333",
        firstname: "Muralimohan",
        lastname: "D",
        dob: ""
    }
    const {register, handleSubmit, formState:{errors}, setError, trigger, getValues, setValue} = useForm({defaultValues});
    const [showPassword, setShowPassword] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState(undefined);
    const [animation, setAnimation] = useState("forward 0.25s linear");

    const isNewAccount = async () =>{
        return false;
    }
    const handlePreview = () =>{
        setAnimation("backward 0.25s linear");
        return setCurrentIndex(prev => -- prev);
    }
    const handleNext = () =>{
        setAnimation("forward 0.25s linear");
        return setCurrentIndex(prev => ++ prev);
    }

    const handleEmailSubmit = async (name) =>{
        setLoading(true);
        const email = getValues(name);
        setUserEmail(email);
        const alreadyExisted = await isNewAccount(email);
        if(alreadyExisted){
            setLoading(false);
            return setError("email", {
                message: `${email} is already an account. Please try a different email address.`
            });
        }else{
            setTimeout(() =>{
                handleNext();
                setLoading(false);
            }, 2000);
        }
    }
    if(email){
        register({name: "email"}, {value: email});
        //handleEmailSubmit(email);
    }
    const onFormSubmit = async (d) => {
        d.dob = `${d.birthdate}-${d.birthmonth}-${d.birthyear}`;
        delete d.birthdate;
        delete d.birthmonth;
        delete d.birthyear;

        console.log(d);
        const result = await submitRegister(d);
        console.log(result);
    }
    return(
        <form className={isLoading ? "register loading" : "register"} disabled = {isLoading} method= "post" onSubmit={handleSubmit(onFormSubmit)}>
            <div className= "LoadingContent" style={{display: isLoading ? "block" : "none"}}></div>
            { currentIndex >= 1 && <div className="header">
                <p id= "userEmail">
                    <span onClick={handlePreview}>&#8592;</span>
                    {userEmail}
                </p>
            </div> }
            <div className= "signUpContent">
                { currentIndex === 0 && 
                    <Component
                    key= "EmailInput"
                    callBack= {handleEmailSubmit}
                    title= "Create account"
                    isInput = {true}
                    placeholder= {["someone@example.com"]}
                    type= {["email"]}
                    name= {["email"]}
                    register= {[register("email", {
                        required: "An email address is required",
                        pattern:{
                            value: /^[a-z-A-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                            message: "Enter the email address in the format someone@example.com."
                        }
                    })]}
                    buttonValue= "Next"
                    errors= {errors}
                    trigger= {trigger}
                    >
                        <a href="#" id="phoneLink" key="phoneLink">Use a phone number instead</a>
                    </Component>
                }
                { currentIndex === 1 &&
                    <Component
                    key= "PasswordInput"
                    style={{animation: animation}}
                    callBack= {handleNext}
                    isInput = {true}
                    type={[showPassword ? "text" : "password"]}
                    placeholder= {["Create password"]}
                    title= "Create a Password"
                    content= "Enter the password you would like to use with your account."
                    name= {["password"]}
                    register= {[register("password",{
                        required: "A password is required.",
                        pattern:{
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g,
                            message:"Passwords must have at least 8 characters and contain at least two of the following: uppercase letters, lowercase letters, numbers, and symbols."
                        }
                    })]}
                    trigger= {trigger}
                    buttonValue= "Next"
                    errors= {errors}
                    >
                            <Input
                                key= "showpswd"
                                type= "checkbox"
                                className = "showpswd"
                                onClick = {() => setShowPassword(prev => !prev)}
                                id="showPassword"
                            >
                                <label htmlFor="showPassword">ShowPassword</label>
                            </Input>
                    </Component>
                }
                { currentIndex === 2 &&
                    <Component
                    key= "userNameInput"
                    style= {{animation: animation}}
                    callBack= {handleNext}
                    isInput = {true}
                    type= "text"
                    title= "What's your name?"
                    content= "We need just a little more info to set up your account."
                    buttonValue= "Next"
                    placeholder= {["First name","Last name"]}
                    name= {["firstname","lastname"]}
                    register= {
                        [register("firstname",{
                        required: "The information is required."
                    }),register("lastname",{
                        required: "The information is required."
                    }) ]
                }
                    trigger= {trigger}
                    errors = {errors}
                    />
                }
                {
                    currentIndex === 3 &&
                    <Component
                    key= "userPhone"
                    isInput= {false}
                    style= {{animation: animation}}
                    name= {["birthdate"]}
                    trigger = { trigger }
                    callBack= {handleNext}
                    buttonValie = "Next"
                    title= "What's your birthdate?"
                    content= "If a child uses this device, select their date of birth to create a child account."
                    >
                        <Select
                        label= "Country/region"
                        key= "selectCountry"
                        labelFor= "chooseCountry"
                        title= "Select Country"
                        id= "choseCountry"
                        name= "country"
                        className= "countrySelect"
                        register= {
                            register("country", {
                                required: true
                            })
                        }
                        >
                            {
                                countryCodes && countryCodes.all().map(country =>
                                    <Option key={country.countryCode} value={country.countryCode}>
                                        {country.countryNameEn}
                                    </Option>
                                )
                            }
                        </Select>
                        <DobComponent register= {register} errors= {errors} getValues= {getValues} setValue= {setValue} />
                        <small id= "bottomSmall">
                            A child account enables you to enforce parental controls and impose usage limits for this device for reasons of privacy and safety.
                            You can manage these settings using our Family Safety app. 
                            Learn more at <a href="#">https://aka.ms/family-safety-app</a>
                        </small>
                    </Component>
                }
            </div>
            { currentIndex === 3 &&
                <Button type= "submit" value= "Next" className= "registerButton" />
            }
        </form>
    )
}

export default Register;