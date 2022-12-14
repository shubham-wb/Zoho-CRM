import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";

import styles from "../assets/css/signup.module.css"; //css file
//helper functions
import { validateEmail } from "../utils";
import { register } from "../api";
//signup component
export default function Signup(props) {
  let [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  //handle input change ---> controlled input
  function handleInputChange(event) {
    const { name, value } = event.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  //handle submit button
  async function handleSubmit() {
    let { email, password, confirmPassword, name } = userDetails;

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !name ||
      confirmPassword !== password
    ) {
      toast.error("Please enter valid details ");
      return;
    }
    //validate email
    if (validateEmail(userDetails.email)) {
      let response = await register(userDetails);
      if (response.success) {
        localStorage.setItem("token", response.data.data);
        toast.success("Registered Succesfully");
        window.location.href = "/dashboard";
      }

      if (response.message && response.message === "User Already exists") {
        toast.error("Email already exists ");
      }
    } else {
      toast.error("Please enter valid email");
      return;
    }
  }

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <div className={styles.signupForm}>
        {/* Name input */}

        <div className={styles.inputField}>
          <TextField
            id='outlined-basic'
            label='Name'
            name='name'
            variant='outlined'
            value={userDetails.name}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        {/* Email Input  */}
        <div className={styles.inputField}>
          <TextField
            id='outlined-basic'
            label='Email'
            name='email'
            variant='outlined'
            value={userDetails.email}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        {/* Password input  */}
        <div className={styles.inputField}>
          <TextField
            type='password'
            name='password'
            id='outlined-basic'
            label='Password'
            variant='outlined'
            value={userDetails.password}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        {userDetails.password.length !== 0 &&
        userDetails.password.length < 8 ? (
          <p className={styles.errorMessage}>
            Password must not be less than 8 characters
          </p>
        ) : null}
        {/* Confirm Password */}
        <div className={styles.inputField}>
          <TextField
            id='outlined-basic'
            type='password'
            name='confirmPassword'
            label='Confirm Password'
            variant='outlined'
            value={userDetails.confirmPassword}
            onChange={(e) => {
              handleInputChange(e);
            }}
          />
        </div>
        {userDetails.confirmPassword.length !== 0 &&
        userDetails.password.toLowerCase() !==
          userDetails.confirmPassword.toLowerCase() ? (
          <p className={styles.errorMessage}>
            Password and Confirm Password Must be Same
          </p>
        ) : null}
        {/* register button  */}
        <Button
          variant='contained'
          onClick={() => {
            handleSubmit();
          }}
        >
          Register
        </Button>
        <hr />
        <p>Existing User ?</p>
        {/* login button --> open login form */}
        <Button
          className={styles.loginBtn}
          variant='text'
          onClick={() => props.login()}
        >
          Login
        </Button>
      </div>
    </>
  );
}
