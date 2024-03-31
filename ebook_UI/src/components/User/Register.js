
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useHistory, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
});
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));
function Register() {
  const [values, setValues] = useState({
    userName: "",
    firstName: "",
    lastname: "",
    gender: "",
    dateOfBirth: "",
    mobileNumber: "",
    role: 0,
    password: "",
    conformPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [bool,setBool]=useState(false);
  const [emailError,setEmailError]=useState();
  const [dispError,setDispError]=useState();
  const classes = useStyles();
  const [err,setErr]=useState(false);
  const [isSuccess,setIsSuccess]=useState(false);
  const [msg,setMsg]=useState('');
  const navigate=useNavigate();
 

  
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(validate(values));
    setIsSubmit(true);
    const errors = validate(values);
    console.log(values);
   
      axios
      .post(`http://localhost:9001/Login/register`,values)
      .then((response)=>{
      console.log(response.data);
      setIsSuccess(true)
      setMsg(response.data);
   

       })
     .catch((err)=>{
      console.log(err)
    
  
      
    })
  

  };
  useEffect(() => {
   // console.log(errors);
    if (Object.keys(errors).length === 0 && isSubmit) {
       console.log(errors);
}}, [errors]);
const handleChange = (event) => {
  const { name, value } = event.target;
  setValues({ ...values, [name]: value });
  setErrors({ ...errors, [name]: '' });
  
};

  const validate = (values) => {
    let errors = {};
    const nameRegex=/^[a-zA-Z]{3,20}$/;
    if (!values.userName) {
     // errors.userName ="email is required";
     setEmailError("email is required");
    }

    if (!values.firstName) {
      errors.firstName = "First name is required";
    }else if(!nameRegex.test(values.firstName)){
      errors.firstName="enter valid first name"
    }

    if (!values.lastname) {
      errors.lastname = "Last name is required";
    }else if(!nameRegex.test(values.lastname)){
      errors.lastname="enter valid first name"
    }

    if (!values.gender) {
      errors.gender = "Gender is required";
    }

    if (!values.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }

    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    }
   
    if (!values.password) {
      errors.password = "Password is required";
    }

    if (!values.conformPassword) {
      errors.conformPassword = "Confirm password is required";
    } 

    return errors;
  };
  const validateEmail = (email) => {
    // email validation regex
    const re = /\S+@\S+\.\S+/;
    if (!email) {
      //errors.userName=('email is required');
      setEmailError('email is required');
    } else if(!re.test(email)) {
      //errors.userName=('Invalid email format');
      setEmailError('Invalid email format')
    }else{
      //errors.userName=('');
      setEmailError('')
      setBool(true)
    }
    if(bool){
      axios
      .get(`http://localhost:9001/Login/checkUser?username=${email}`)
      .then((response)=>{
       setEmailError(response.data);
       })
     .catch((err)=>{
      console.log(err.message)
      
    })

    }
  };

  const handleEmailChange = (e) => {
    setValues(prevValues => ({
      ...prevValues,
      userName: (e.target.value)
    }));
    validateEmail(e.target.value);
  };

  const validateMobileNumber = (mobileNumber) => {
    // email validation regex
    const phoneNumberRegex =/^[+0-9][-0-9 \d]{7,}$/; 
    if (!values.mobileNumber) {
      errors.mobileNumber = "Mobile number is required";
    }else if(!phoneNumberRegex.test(values.mobileNumber)){
      errors.mobileNumber = "enter valid mobile number";
    }else{
      errors.mobileNumber = "";
    }
    }

  const handleMobileNumberChange = (e) => {
    setValues(prevValues => ({
      ...prevValues,
      mobileNumber: (e.target.value)
    }));
    validateMobileNumber(e.target.value);
  };
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
    if (!values.password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(values.password)) {
      errors.password = "Password must be 6-20 characters long, contain at least one number, one letter, and one special character.";
    }else{
      errors.password ="";
    }
    };
    const handlePasswordChange = (e) => {
      setValues(prevValues => ({
        ...prevValues,
        password: (e.target.value)
      }));
      const newPassword=e.target.value;
      validatePassword(e.target.value);
    };
    const handleConfirmPasswordChange = (e) => {
      setValues(prevValues => ({
        ...prevValues,
        conformPassword : (e.target.value)
      }));
      validateConfirmPassword(e.target.value);
    };
    const validateConfirmPassword = (confirmPassword) => {
         
    if (!confirmPassword) {
      errors.conformPassword = "Confirm password is required";
    } else if (values.password !== confirmPassword) {
      errors.conformPassword = "Passwords do not match";
    }else{
      errors.conformPassword = "";
    }
     }
     
     const handleSnackbarClose = () => {

       setOpenSnackbar(false);
  
     }
     const validateDob=(dateOfBirth)=>{
      var today = new Date();
      var birthDate = new Date(dateOfBirth);
     var age_now = today.getFullYear() - birthDate.getFullYear();
     var m = today.getMonth() - birthDate.getMonth();
     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
     {
         age_now--;
     }
     console.log("age= "+age_now);
        if(age_now<13&&age_now>0){
         errors.dateOfBirth = "your age should more than 13";
       }
       else if(age_now<=0){
         errors.dateOfBirth="enter valid date of birth";
       }
       else{
         errors.dateOfBirth = "";
       }
     }
 
     const handleDob= (e) => {
      setValues(prevValues => ({
        ...prevValues,
        dateOfBirth : (e.target.value)
      }));
      validateDob(e.target.value);
    };

 
     const handleRoleChange=(e)=>{
      setValues(prevValues => ({
        ...prevValues,
        role: parseInt(e.target.value)
      }));
      ValidateRole(e.target.value);
     }
     const ValidateRole=(role)=>{
      if(!role){
        errors.role="role is required";
      }
      else{
        errors.role="";
      }
     }
     const handleNav=()=>{
      navigate('/Login');
    }

  return (
    <div className='box'>
      <StyledForm className="forms"onSubmit={handleSubmit}>
        <h3>Register</h3>
          <TextField
          id="userName"
          label="Email"
          type="email"
          value={values.userName}
          onChange={handleEmailChange}
          error={!!emailError}
          helperText={emailError}
          autoComplete="off"
        />

        <div className='parent'>
          <div className='child'>
           <TextField
          id="firstName"
          label="firstName"
          type="text"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          autoComplete="off"
          style={{width:"105px"}}
        />

          </div>
          <div className='child'>
        
           <TextField
          id="lastname"
          label="lastName"
          type="text"
          name="lastname"
          value={values.lastname}
          onChange={handleChange}
          error={!!errors.lastname}
          helperText={errors.lastname}
          autoComplete="off"
          style={{width:"105px"}}
        />
 
          </div>
          </div>
           <TextField
          id="mobileNumber"
          label="mobileNumber"
          type="text"
          name="mobileNumber"
          value={values.mobileNumber}
          onChange={handleMobileNumberChange}
          error={!!errors.mobileNumber}
          helperText={errors.mobileNumber}
          autoComplete="off"
        />
      <div className='parent'>
      <div className='child'>
        
      <Box sx={{ minWidth: 110 }}>
      <FormControl fullWidth>
        <InputLabel id="gender">Gender</InputLabel>
        <Select
          labelId="gender"
          id="gender"
          name="gender"
          value={values.gender}
          label="gender"
          onChange={handleChange}
           >
          <MenuItem value="female" >female</MenuItem>
          <MenuItem value="male">Male</MenuItem>
        </Select>
        
      {errors.gender && <span  className="error">{errors.gender}</span>}
      </FormControl>
    </Box>

          
        </div>
        <div className='child'>
             <Box sx={{ minWidth: 110 }}>
      <FormControl fullWidth>
        <InputLabel id="role">Role</InputLabel>
        <Select
          labelId="role"
          id="role"
          name="role"
          value={values.role}
          label="role"
          onChange={handleRoleChange}
         
        >
          <MenuItem value="0">ADMIN</MenuItem>
          <MenuItem value="1">AUTHOR</MenuItem>
        </Select>
      
      {errors.role && <span  className="error">{errors.role}</span>}
      </FormControl>
    </Box>
        </div>
        
        </div>
       
        <TextField
        id="dateOfBirth"
        type="date"
        name="dateOfBirth"
        label="DOB"
        value={values.dateOfBirth}
        onChange={handleDob}
        error={!!errors.dateOfBirth}
        helperText={errors.dateOfBirth}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        style={{width:"225px"}}
      />
         <TextField
          id="password"
          label="password"
          type="password"
          name="password"
          value={values.password}
          onChange={handlePasswordChange}
          error={!!errors.password}
          helperText={errors.password}
          autoComplete="off"
        />
       
         <TextField
          id="conformPassword"
          label="confirmPassword"
          type="password"
          name="conformPassword"
          value={values.conformPassword}
          onChange={handleConfirmPasswordChange}
          error={!!errors.conformPassword}
          helperText={errors.conformPassword}
          autoComplete="off"
        />
        <button type="submit" >submit</button>
        <h6><a href="Login" >go back to login!</a></h6>
       </StyledForm>
       
      {isSuccess&&(
         <Dialog
         open={isSuccess}
         onClose={()=>setIsSuccess(!isSuccess)}
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

      </div> 
       )
      }
      
      export default Register