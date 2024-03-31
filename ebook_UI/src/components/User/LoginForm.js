import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import '../login.css'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
});
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [disError,setDisError]=useState(false);
  const [dispError,setDispError]=useState();
  const [nav,setNav]=useState(false);
  const [disSuccess,setDisSuccess]=useState(false);
const navigate=useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    let emailErr="";
    let passwordErr="";
    validateEmail(email)
    validatePassword(password)
    if (!email) {
      emailErr='email is required';
    } else {
      emailErr='';
    }
    if (!password) {
      passwordErr='password is required';
    } else {
      passwordErr='';
    }

    if (emailErr == '' && passwordErr == '') {
     
      axios
    
        .get(`http://localhost:9001/Login/?email=${email}&password=${password}`)
        .then((response) => {
          console.log(response.data);
          localStorage.setItem('status', 'true');
          localStorage.setItem('role', response.data.role);
          localStorage.setItem('userName', response.data.userName);
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('mobileNumber', response.data.mobileNumber);
         handleSuccess();
          if(response.data.role==="AUTHOR")
          {
            console.log("disSuccess=",disSuccess);
            navigate('/');

          }
          else{
           
            navigate('/')
          }
        
        })
        .catch((err) => {
          console.log(err.response.data.message,"error occured");
     
        handleError(err);
         
        });
    }
  };
  const handleError=(err)=>{
if(emailError===''&& passwordError===''){
   console.log(emailError+" :email"+passwordError+":password");
  setDisError(!disError);
         setDispError(err.response.data.message)
         
}
  }
  const handleSuccess=()=>{
setDisSuccess(!disSuccess);
  }
 

  const validateEmail = (email) => {
    // email validation regex
    const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email) {
      setEmailError('email is required');
    } else if (!re.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('password is required');
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  return (
    <div className='box' >
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}/>
      <StyledForm onSubmit={handleSubmit}>
        <h3>Login</h3>
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          autoComplete="off"
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={!!passwordError}
          helperText={passwordError}
          style={{marginBottom:"0px"}}
        />
           <Button type="submit" variant="contained" disabled={emailError || passwordError}>
          Login
        </Button>
      </StyledForm>
      <h6>
        New User? <a href="Register"> SignUp </a> here! 
      </h6>
      <h6>
      <a href="ResetPassword" style={{color:"grey"}}>reset password</a>
      </h6>
      <h6>
      <a href='/ForgotPassword' style={{color:"grey"}}>ForgotPassword</a>
      </h6>
      

      {
  <Snackbar
  open={disError}
  autoHideDuration={3000}
  onClose={()=>setDisError(!disError)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <MuiAlert elevation={6} variant="filled" onClose={()=>setDisError(!disError)} severity="error">
   {dispError}
  </MuiAlert>
</Snackbar>
}
   
      </div>
  );
}

export default LoginForm;
