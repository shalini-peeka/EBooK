import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from "axios";
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';


const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
});
function ResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [newPasswordError,setNewPasswordError]=useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [msg,setMsg]=useState('');
  const navigate=useNavigate();
  const [disSuccess,setDisSuccess]=useState(false);
  const [disError,setDisError]=useState(false);
  const [dispError,setDispError]=useState();
  const handleSubmit = (e) => {
    e.preventDefault();
    let emailErr='';
    let passwordErr='';
    let newPassErr='';
    let confirmPassErr='';
    if (!email) {
      emailErr='email is required';
    }else{
      emailErr='';
    }
    if (!password) {
      passwordErr='password is required';
    } else{
      passwordErr='';
    }
    if(!newPassword){
      newPassErr='password is reqired';
    }else{
      newPassErr='';
    }
     if(!confirmPassword){
      confirmPassErr='conform password is reqired';
    }
    else{
      confirmPassErr='';
    }
validateEmail(email);
validateConfirmPassword(confirmPassword);
validateNewPassword(newPassword);
validatePassword(password);
    
    if(passwordErr=="" && emailErr=="" && confirmPassErr==""&& newPassErr==""){
      axios
      
      .put(`http://localhost:9001/Login/resetpassword?email=${email}&password=${password}&newPassword=${newPassword} `)
      .then((response)=>{
        setMsg(response.data)
        console.log(response.data);
        setDisSuccess(!disSuccess);

      })
    .catch((err)=>{
      console.log(err.response.data.message);
      setDispError(err.response.data.message);
      setDisError(!disError)
    })}
  };
    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
      validateConfirmPassword(e.target.value);
    };
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
      validateEmail(e.target.value);
    };
    const handleNewPasswordChange = (e) => {
      setNewPassword(e.target.value);
      validateNewPassword(e.target.value);
    };


  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    if(!email){
      setEmailError('email is required');
    }
    else if (!re.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };
  
  const validateNewPassword = (newPassword) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/;
    if(!newPassword){
      setNewPasswordError('password is reqired');
    }
    else if(newPassword===password){
      setNewPasswordError('new password cannot be your previous password');
    }
    else if (!(re.test(newPassword))) {
      setNewPasswordError('Password must be 6-20 characters long, contain at least one number, one letter, and one special character.');
    } 
    else {
      setNewPasswordError('');
    }
  };
  const validateConfirmPassword = (confirmPassword) => {
   console.log(newPassword);
   console.log(confirmPassword)
     if(!(confirmPassword===newPassword)){
      setConfirmPasswordError("passords did not match");
    }else if(!confirmPassword){
      setConfirmPasswordError('conform password is reqired');
    }
    else{
      setConfirmPasswordError("");
    }
  }
  const validatePassword = (password) => {
 
      if (!password) {
        setPasswordError('password is required');
      } else{
        setPasswordError('');
      }
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
      validatePassword(e.target.value);
    };
    const handleNav=()=>{
      navigate('/Login');
    }
  
 


  return (
    <div className='box'>
       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <StyledForm onSubmit={handleSubmit}>
      <h3>Reset Password</h3>
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          error={!!(emailError)}
          helperText={emailError}
          autoComplete="off"
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          error={!!(passwordError)}
          helperText={passwordError}
        />
        <TextField
          id="newPassword"
          label="New Password"
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={!!(newPasswordError)}
          helperText={newPasswordError}
        />
        <TextField
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!!(confirmPasswordError)}
          helperText={confirmPasswordError}
        />
        <Button type="submit" variant="contained" disabled={emailError || newPasswordError || confirmPasswordError || passwordError}>
          Reset Password
        </Button>
      </StyledForm>
      <h6>
        <a href="Login">go back to Home!</a>
      </h6>{disSuccess&&(
         <Dialog
         open={disSuccess}
         onClose={()=>setDisSuccess(!disSuccess)}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description">
       <DialogContent>
       <DialogContentText id="alert-dialog-description" style={{color:"green"}}>
                   {msg}
       </DialogContentText>
       </DialogContent>
       <DialogActions>
       <Button onClick={handleNav}>ok</Button>
       </DialogActions>
       </Dialog>
      )
        
      }
    </Box>
   
{
  <Snackbar
  open={disError}
  autoHideDuration={3000}
  onClose={()=>setDisError(!dispError)}
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

export default ResetPassword;
