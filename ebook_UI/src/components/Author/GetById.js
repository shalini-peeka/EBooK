import React from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const GetById = () => {
    const location=useLocation();
    const book=location.state.book;
    console.log("book",location.state.book);
  return (
    <div className='view-books'>
    {/* <h1>View Books</h1> */}
    <table className="table" style={{marginTop:'4%'}}>
<thead>
  <tr style={{boxShadow:'0px 1px 5px 3px #814bef'}}>
    <th scope="col">S.No</th>
    <th scope="col">Book Id</th>
    <th scope="col">Title</th>
    <th scope="col">Status</th>
    <th scope='col'>Request Status</th>
  </tr>
</thead>

<tbody>

  
 
   
    return (
    <tr style={{fontFamily:'Cambria'}} >
   
    <td>{book.bookId}</td>
    <td>{book.title}</td>
    <td>{book.status}</td>
    <td>Approved/rejected</td>
  </tr>
    )
 
  

</tbody>

</table>



  </div>
  )
}

export default GetById
