import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MuiOtpInput } from 'mui-one-time-password-input'


const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
});

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [displayEmail,setDisplayEmail]=useState(true);
    const [displayOtp,setDisplayOtp]=useState(false);
    const [displayReset,setDisplayReset]=useState(false);
    const [emailError, setEmailError] = useState('');
    const [otpError,setOtpError]=useState('');
    const [otp,setOtp]=useState('');
    const [newPassword,setNewPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [newPasswordError,setNewPasswordError]=useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [bool,setBool]=useState('');
    const [error,setError]=useState();
    const [isError,setIsError]=useState(false);
    const [success,setSuccess]=useState();
    const [isSuccess,setIsSuccess]=useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLeave,setIsLeave]=useState(false);
    const [alerts,setAlerts]=useState(false);
    const navigate=useNavigate();
    const [msg,setMsg]=useState('');
  const [open,setOpen]=useState(false);
    const handleSubmitEmail = (e) => {
      e.preventDefault();
      validateEmail(email);
      let emailErr='';
      if (!email) {
        emailErr='email is required';
      }else{
        emailErr='';
      }
      console.log(emailErr)
     if(emailErr===''){
      console.log("inside");
      setOpen(!open);
      axios
      .post(`http://localhost:9001/Login/sendEmail?to=${email}`)
      .then((response)=>{
        setOpen(false);
        console.log(response.data)
        if(response.data==="mail sent successfully please enter otp"){
        setSuccess(response.data);
        setIsSuccess(!isSuccess);
        setDisplayEmail(!displayEmail);
        setDisplayOtp(!displayOtp);
        }
        else {
          setError(response.data.Message);
          setIsError(!isError);
          
        }
      })
      .catch((err)=>{
        console.log(err);
        setError(err.response.data.message);
        setIsError(!isError);
        setOpen(false);
      })
    }
  
    };
    const handleSubmitOtp=(e)=>{
      e.preventDefault();
      validateOtp(otp);
      let otpErr='';
      if(!otp){
       otpErr= "otp is required";
      }
      else{
        otpErr='';
    }
     if(otpErr===""){
      axios
      .delete(`http://localhost:9001/Login/verify?email=${email}&id=${otp}`) 
      .then((response)=>{
        if(response.data==="otp matched you can change the password"){
          setDisplayOtp(false);
          setDisplayReset(true);
          setSuccess(response.data);
          setIsSuccess(true);
        }
      })
      .catch((err)=>{
       setError(err.response.data.message);
       setIsError(!isError)
      })
    }
    }
    const handlePasswordReset=(e)=>{
        e.preventDefault();
        validateNewPassword(newPassword);
        validateConfirmPassword(confirmPassword);
        let newPassErr='';
        let confirmPassErr='';
        if(!newPassword){
          newPassErr="password is required";
        }
        else{
          newPassErr='';
        }
        if(!confirmPassword){
          confirmPassErr="Confirm password is required";
        }
        else{
          confirmPassErr=""
        }
        if(newPassErr==="" && confirmPassErr==="" ){
        axios
        .put(`http://localhost:9001/Login/updatePassword?email=${email}&Password=${newPassword}`) 
        .then((response)=>{
          if(response.data==="Password reset successfully"){
            
            setAlerts(true);
            setMsg(response.data);
            
          }
          else{
            console.log(response.data);
            setError(response.data);
            setIsError(true); 
          }
        })
        .catch((err)=>{
          setError(err.response.data.message);
          setIsError(true);
        })
      }
    }
  
    const handleCancel=(e)=>{
        e.preventDefault();
        axios
        .delete(`http://localhost:9001/Login/cancel?email=${email}`) 
        .then((response)=>{
          setIsLeave(false);
          setAlerts(true);
          setMsg(response.data)
        
        })
        .catch((err)=>{
          alert(err.Message);
        })
      
    }
    const handleLeave=(e)=>{
        setIsLeave(false);
        setAlerts(true);
        setMsg("request got cancelled")

    }
  
    const validateEmail = (email) => {
      // email validation regex
      const re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if(!email){
        setEmailError("Email is required")
      }
      else if (!re.test(email)) {
        setEmailError('Invalid email format');
      } else {
        setEmailError('');
       
      }
      if(bool){
        axios
        .get(`http://localhost:9001/Login/checkUser/${email}`)
        .then((response)=>{
         setEmailError(response.data);
         })
       .catch((err)=>{
        console.log(err.message)
        
      })
  
      }
    
    
    };
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
      validateEmail(e.target.value);
    };
    const handleOtpChange=(e)=>{
      console.log(e.target.value)
      setOtp(e.target.value);
      validateOtp(e.target.value);
    }
    const validateOtp =(otp)=>{
      if(!otp){
        setOtpError("otp is required");
      }
      else{
        setOtpError('');
    }
  }
    
    const handleNewPasswordChange = (e) => {
      setNewPassword(e.target.value);
      validateNewPassword(e.target.value);
    };
    const validateNewPassword = (newPassword) => {
      const re= /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
      if(!newPassword){
        setNewPasswordError("newPassword is required")
      }
      else if (!re.test(newPassword)) {
        setNewPasswordError('Password must be 6-20 characters long, contain at least one number, one letter, and one special character.');
      } 
      else {
        setNewPasswordError('');
      }
    };
    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
      validateConfirmPassword(e.target.value);
    };
    const validateConfirmPassword = (confirmPassword) => {
  
        if(!(confirmPassword===newPassword)){
       
         setConfirmPasswordError("passords did not match");
       }else if(!confirmPassword){
         setConfirmPasswordError('conform password is reqired');
       }
       else{
         setConfirmPasswordError("");
       }
     }
    const handleNav=()=>{
      navigate('/Login');
    }


    
  return (
    <div>
      {
      displayEmail&&(
      <div className='box'>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}/>
        <StyledForm onSubmit={handleSubmitEmail}>
          <h3>Forgot Password</h3>
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
            <Button type="submit" variant="contained" disabled={emailError}>
            send verification code
          </Button>
          <h6><a href="/Login"> go back to login</a></h6>
          </StyledForm>
      </div>
      )
    }
    {
      <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={open}
      onClick={()=>setOpen(false)}
      >
      <CircularProgress color="inherit" />
      </Backdrop>
    }
     {
      displayOtp&&(
      <div className='box'>
      <StyledForm>
        <h3>Enter Otp</h3>
      <TextField
            id="otp"
            label="otp"
            type="password"
            value={otp}
            onChange={handleOtpChange}
            error={!!otpError}
            helperText={otpError}
            autoComplete="off"
            required
          />
      <Button onClick={handleSubmitOtp} variant='contained'>Submit</Button>
      <Button varient ='contained' onClick={() => setShowConfirmation(true)}style={{backgroundColor:"red" ,color:"white"} } >cancel</Button>
      </StyledForm>
      </div>
      )} 
      {
        displayReset&&(
      <div className='box'>
        <StyledForm>
          <h3>Reset Password</h3>
          <TextField
          id="newPassword"
          label="newPassword"
          type="password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          error={!!newPasswordError}
          helperText={newPasswordError}
          autoComplete="off"
        />
         <TextField
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={Boolean(confirmPasswordError)}
          helperText={confirmPasswordError}
        />
          <Button variant='contained' onClick={handlePasswordReset}>submit</Button>
          <Button varient ='contained' onClick={() => setIsLeave(true)} style={{backgroundColor:"red" ,color:"white"} } >cancel</Button>
          </StyledForm>
      </div>
        )
     }
     {isError && (
        <Stack sx={{ width: '500px',margin:'auto',marginTop:'50px' }} spacing={2}>
          <Alert severity="error" action={
    <Button onClick={()=>setIsError(false)} color="inherit" size="small">
      OK
    </Button>
  }>{error}</Alert>
        </Stack>
      )}
    { isSuccess===true&&(
      <Stack sx={{width: '500px',margin:'auto',marginTop:'50px'}} spacing={2}>
            <Alert action={
    <Button onClick={()=>setIsSuccess(false)} color="inherit" size="small">
      OK
    </Button>
  } severity="success">{success}</Alert> 
    </Stack>

    ) }
    {
      showConfirmation&&(
        <Dialog
        open={showConfirmation}
        onClose={()=>setShowConfirmation(!showConfirmation)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
      <DialogContent>
      <DialogContentText id="alert-dialog-description" style={{color:"red"}}>
                  Are you sure to Cancel?
      </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button onClick={handleCancel}>Yes</Button>
      <Button onClick={()=>setShowConfirmation(!showConfirmation)} >
                  No
      </Button>
      </DialogActions>
      </Dialog>

      )
    }
    {
      isLeave &&(
        <Dialog
        open={isLeave}
        onClose={()=>setIsLeave(!isLeave)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
      <DialogContent>
      <DialogContentText id="alert-dialog-description" style={{color:"red"}}>
                  Are you sure you want to Cancel?
      </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button onClick={handleLeave}>Yes</Button>
      <Button onClick={()=>setIsLeave(!isLeave)} >
                  No
      </Button>
      </DialogActions>
</Dialog>

      )
    }{
      alerts&&(
        <Dialog
        open={alerts}
        onClose={()=>setAlerts(!alerts)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
      <DialogContent>
      <DialogContentText id="alert-dialog-description" style={{color:"green"}} >
                  {msg}
      </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button onClick={handleNav}>ok</Button>
      </DialogActions>
      </Dialog>
      )
    }
  
    </div>
  )
}

export default ForgotPassword
