import React from 'react'
import user from '../assests/user.png'
import {Link, Navigate, useNavigate,useLocation} from 'react-router-dom'
import { Dropdown, Nav } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import ebook from '../assests/ebook.jpg'
import '../components/Author/formstyle.css';
import { FormControl, Select } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

const Navbar = () => {
 const userStatus=localStorage.getItem("status");
 const userRole=localStorage.getItem("role");
 const userEmail=localStorage.getItem("userName");
  const userName=localStorage.getItem("name");
  const userMobileNumber=localStorage.getItem("mobileNumber");
  const location = useLocation();
const navigate=useNavigate();
const handleChange=(e)=>{
 
if(e.target.value==="incomplete"){
  navigate(`/read?authorId=${userEmail}`);
}
if(e.target.value==='complete'){
  navigate(`/completedbooks?authorId=${userEmail}`)
}
window.location.reload();
}

  return (
    <div>
     
      <nav className="navbar navbar-expand-lg " style={{backgroundColor: '#010110',height:'50px',position: 'fixed', top: '0', left: '0',width: '100%',zIndex:'999' }}>
  <div className="container-fluid">
    <a className="navbar-brand" href="#" style={{fontWeight:'bold',color:'white'}}>
      <img src={ebook} alt="" width="40px" height="35px" style={{borderRadius:"20px"}} />&nbsp; E-Book
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{marginLeft:'20%'}}>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
     {
      !userStatus&&(
      <div className="nav-item">
      <li>
         
      <Link to="/" style={{color:'white',textDecoration:'none',fontWeight:'bold' ,fontFamily:'cursive'}}><button style={{backgroundColor:'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px'}}>Home</button></Link>
     
   </li>
   <li>
     
      <Link to="/login" style={{color:'white',textDecoration:'none',fontWeight:'bold' ,fontFamily:'cursive'}}><button style={{backgroundColor:'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px'}}>Login</button></Link>
   
   </li>
   <li>
      <Link to="/register" style={{fontWeight:'bold' ,fontFamily:'cursive',color:'white',textDecoration:'none'}}><button style={{backgroundColor:'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px'}}>Register</button> </Link>
   </li>
   </div>
      )
     }
     
     
      {userRole==="AUTHOR"?(
        <div  className="nav-item">  
        <li >
         
           <Link to="/" style={{color:'white',textDecoration:'none',fontWeight:'bold' ,fontFamily:'cursive'}}><button style={{marginLeft:'70px',backgroundColor:location.pathname === '/' ? 'cadetblue' : 'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px'}}>Home</button></Link>
         
        </li>
        <li >
         
           <Link to="/add" style={{color:'white',textDecoration:'none',fontWeight:'bold' ,fontFamily:'cursive'}}><button style={{backgroundColor: location.pathname === '/add' ? 'cadetblue' : 'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px',width:'100px'}}> New Book</button></Link>
         
        </li>
        <li >
           <Link to="/viewBooks" style={{fontWeight:'bold' ,fontFamily:'cursive',color:'white',textDecoration:'none'}}><button style={{backgroundColor:location.pathname === '/viewBooks' ? 'cadetblue' : 'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px',width:'130px'}}>View Books</button> </Link>
        </li>
        <li>
           <Link to="/Request" style={{fontWeight:'bold' ,fontFamily:'cursive',color:'white',textDecoration:'none'}}><button style={{backgroundColor:location.pathname === '/Request' ? 'cadetblue' : 'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px',width:'160px'}}> Create Request</button> </Link>
        </li>
        <li >
           <Link to= '/viewALLEbook' style={{fontWeight:'bold' ,fontFamily:'cursive',color:'white',textDecoration:'none'}}><button style={{backgroundColor:location.pathname === '/viewALLEbook' ? 'cadetblue' : 'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px',width:'160px'}}>View Ebooks</button> </Link>
        </li>
        <div style={{ position: 'relative' }}>
        <Box sx={{ minWidth: 200 }} style={{backgroundColor:'white'}} >
        <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Filter</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    label="Filter"
   onChange={handleChange}
  >
    <MenuItem value="select">SELECT</MenuItem>
    <MenuItem value="incomplete">INCOMPLETE</MenuItem>
    <MenuItem value="complete">COMPLETE</MenuItem>
   
  </Select>
</FormControl>
</Box>

</div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{marginLeft:'10%',}}>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
       
        <li className="nav-item" marginRight="5px">
          <a className="nav-link" href="#">
           
           
            <Nav>
            <Dropdown >
            <Dropdown.Toggle variant="light" id="dropdown-basic" style={{backgroundColor:'transparent',borderColor:'transparent'}} >
              <img src={user} alt="profile" width="30" height="30" style={{filter:'invert(100%)'}} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#action/1.2"><i class="bi bi-person-fill"></i>{userName}</Dropdown.Item>
              <Dropdown.Item><i class="bi bi-envelope-fill"></i>{userEmail}</Dropdown.Item>
              <Dropdown.Item><i class="bi bi-telephone-fill"></i>{userMobileNumber}</Dropdown.Item>
               
              <Dropdown.Divider />
              <Dropdown.Item href="/Logout" ><i className="bi bi-box-arrow-right"  />
                 Logout</Dropdown.Item>
            </Dropdown.Menu>
           
            </Dropdown>
        </Nav>
          </a>
        </li>
        </ul>
   </div>

        </div>

      ):null
        }

{userRole==="ADMIN"?(
        <div  className="nav-item">
        <li >
         
           <Link to="/" style={{color:'white',textDecoration:'none',fontWeight:'bold' ,fontFamily:'cursive'}}><button style={{marginLeft:'50px',backgroundColor:location.pathname === '/' ? 'cadetblue' : 'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px'}}>Home</button></Link>
         
        </li>

       
        <li >
           <Link to="/viewReq" style={{fontWeight:'bold' ,fontFamily:'cursive',color:'white',textDecoration:'none'}}><button style={{backgroundColor:location.pathname === '/viewReq' ? 'cadetblue' : 'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px',width:'130px'}}>View Requests</button> </Link>
        </li>
        <li >
         
           <Link to="/viewReqByStatus" style={{color:'white',textDecoration:'none',fontWeight:'bold' ,fontFamily:'cursive'}}><button style={{backgroundColor:location.pathname === '/viewReqByStatus' ? 'cadetblue' : 'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px',width:'280px'}}> View Requests By Status</button></Link>
         
        </li>
        <li >
         
           <Link to="/createEbook" style={{color:'white',textDecoration:'none',fontWeight:'bold' ,fontFamily:'cursive'}}><button style={{backgroundColor: location.pathname === '/createEbook' ? 'cadetblue' : 'transparent',borderColor:'transparent',color:'#ffffff',borderRadius:'20px',width:'200px'}}>Create Ebook</button></Link>
         
        </li>
        <li >
         
           <Link to="/viewEbooks" style={{color:'white',textDecoration:'none',fontWeight:'bold' ,fontFamily:'cursive'}}><button style={{backgroundColor: location.pathname === '/viewEbooks' ? 'cadetblue' : 'transparent' ,borderColor:'transparent',color:'#ffffff',borderRadius:'20px',width:'200px'}}>View E-Books</button></Link>
         
        </li>
       
        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{marginLeft:'5%'}}>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
       
        <li className="nav-item">
          <a className="nav-link" href="#">
           
           
            <Nav>
            <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic" style={{backgroundColor:'transparent',borderColor:'transparent'}} >
              <img src={user} alt="profile" width="30" height="30" style={{filter:'invert(100%)'}} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#action/1.2"><i class="bi bi-person-fill"></i>{userName}</Dropdown.Item>
              <Dropdown.Item><i class="bi bi-envelope-fill"></i>{userEmail}</Dropdown.Item>
              <Dropdown.Item><i class="bi bi-telephone-fill"></i>{userMobileNumber}</Dropdown.Item>
               
              <Dropdown.Divider />
           
                 <Dropdown.Item href="/Logout" ><i className="bi bi-box-arrow-right"  />
                 Logout</Dropdown.Item>
            </Dropdown.Menu>
           
            </Dropdown>
        </Nav>
          </a>
        </li>
        </ul>
   </div>

        </div>
      ):null
        }
        </ul>
   </div>
   
   </div>
 
</nav>

    </div>
  )
}

export default Navbar

