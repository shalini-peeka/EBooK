import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import AddBook from './components/Author/AddBook';
import ViewBooks from './components/Author/ViewBooks';
import Home from './components/Home';

import GetById from './components/Author/GetById';

import ViewRequests from './components/Author/ViewRequests';
import LoginForm from './components/User/LoginForm';
import Register from './components/User/Register';
import ResetPassword from './components/User/ResetPassword';
import Logout from './components/User/Logout';
import Request from './components/Admin/Request';
import ViewRequest from './components/Admin/ViewRequests';
import ViewRequestByStatus from './components/Admin/ViewRequestByStatus';
import UpdateRequest from './components/Admin/UpdateRequest';
import CreateEbook from './components/Admin/CreateEbook';
import ViewEbook from './components/Admin/ViewEbook';
import Completedbooks from './components/Author/Completedbooks';
import ViewIncompleteBooks from './components/Author/ViewIncompleteBooks';
import ViewALLEBooks from './components/Author/ViewALLEBooks';
import ViewBookByAdmin from './components/Admin/ViewBookByAdmin';
import ForgotPassword from './components/User/ForgotPassword';

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/add' element={<AddBook />} />
      <Route path='/viewBooks' element={<ViewBooks/>} />
      <Route path='/getById' element={<GetById/>} />
      <Route path='/login' element={<LoginForm/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/resetpassword' element={<ResetPassword/>} />
      <Route path='/logout' element={<Logout/>} />
      <Route path="/Request" element={<Request/>} />
      <Route path="/viewReq" element={<ViewRequest/>}/>
      <Route path="/viewReqByStatus" element={<ViewRequestByStatus/>}/>
      <Route path="/updateReq" element={<UpdateRequest/>}/>
      <Route path="/createEbook" element={<CreateEbook/>}/>
      <Route path="/viewEbooks" element={<ViewEbook/>}/>
      <Route exact path="/read" element= {<ViewIncompleteBooks/>}></Route>
      <Route exact path="/completedbooks" element= {<Completedbooks />}></Route>
      <Route path="/viewALLEbook" element={<ViewALLEBooks/>}/>
      <Route  exact path="/viewAd" element={<ViewBookByAdmin/>}/>
      <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
     </Routes>
     </BrowserRouter>
   
    </div>

  );
}

export default App;
