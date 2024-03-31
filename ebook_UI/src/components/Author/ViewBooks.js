import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import StatusButtons from "./Buttons/StatusButtons";
import "./formstyle.css";
import ReactPaginate from "react-paginate";
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
}, (props, prevProps) => {
  return props.children === prevProps.children;
});
const ViewBooks = () => {
  const [data, setData] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [idClick, setIdClick] = useState(false);
  const [idBook, setIdBook] = useState(null);
  const [value,setValue]=useState();
const [valuee,setValuee]=useState(false);
  const [sortParams, setSortParams] = useState({
    key: "bookId",
    direction: "asc",
  });

  const [pageNumber, setPageNUmber] = useState(0);
  const booksPerPage = 6;
  const pagesVisited = pageNumber * booksPerPage;
  const pageCount = Math.ceil(data.length / booksPerPage);
  const changePage = ({ selected }) => {
    setPageNUmber(selected);
  };

  const handleClose = () => setIdClick(!idClick);
  const userName = localStorage.getItem("userName");
  const handleResume = (book) => {
    setSelectedBook(book);
  };
  const getBookDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:9001/book/viewAllBooks/${userName}`);
      console.log(response.data);
      setData(response.data); //.sort((a,b)=>a.bookId-b.bookId)));
    } catch (error) {
      console.log(error);
    }
  };

  const handleIdClick = (book) => {
    setIdBook(book);
    setIdClick(true);
    console.log("Getting book data by id ", book);
  };

  const [requestStatus, setRequestStatus] = useState();
  const getStatus = async (bookId) => {
    try {
      const response = await axios.get(
       
        `http://localhost:9001/manageRequest/viewRequestStatusByBookId/${bookId}`
      );
      setRequestStatus(response.data);
      setValue(response.data);
      setValuee(!valuee)
      console.log(response.data, "response->");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  console.log(requestStatus, ": RequestStatus");

  useEffect(() => {
    getBookDetails();
  }, []);
  const sortData = (array, key, direction) => {
    const sortedArray = array.slice();
    sortedArray.sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      } else if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
    return sortedArray;
  };
  const handleSort = (key) => {
    const newDirection = sortParams.direction === "asc" ? "desc" : "asc";
    setSortParams({ key: key, direction: newDirection });
  };

  const sortedData = sortData(data, sortParams.key, sortParams.direction);
  return (
    <div className="view-books">
      <table className="table" style={{ marginTop: "6%" }}>
        <thead>
          <tr style={{ boxShadow: "0px 1px 5px 3px #919091" }}>
            <th scope="col">S.No</th>
            <th
              scope="col"
              onClick={() => handleSort("bookId")}
              style={{ cursor: "pointer" }}
            >
              Book Id{" "}
              {sortParams.key === "bookId" && sortParams.direction === "asc"
                ? "↑"
                : "↓"}
            </th>
            <th
              scope="col"
              onClick={() => handleSort("title")}
              style={{ cursor: "pointer" }}
            >
              Title{" "}
              {sortParams.key === "title" && sortParams.direction === "asc"
                ? "↑"
                : "↓"}
            </th>
            <th
              scope="col"
              onClick={() => handleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Status
              {sortParams.key === "status" && sortParams.direction === "asc"
                ? "↑"
                : "↓"}
            </th>
            <th scope="col">Request Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedData &&
            sortedData
              .slice(pagesVisited, pagesVisited + booksPerPage)
              .map((book, index) => {
                const { bookId, title, status } = book;
                let newstatus = status;
                if (status === "PAUSE") {
                  newstatus = "RESUME";
                }
                if (status === "COMPLETED") {
                  newstatus = "COMPLETED";
                }
                return (
                  <tr style={{ fontFamily: "Cambria" }} key={bookId}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <Link
                        to="#"
                        title="See the Content to this Book"
                        onClick={() => handleIdClick(book)}
                      >
                        {bookId}
                      </Link>
                    </td>
                    <td>{title}</td>
                    <td>
                      <StatusButtons
                        status={newstatus}
                        book={book}
                        onResume={handleResume}
                      />
                    </td>
                    <td><Button variant="contained" onClick={()=>getStatus(bookId)}>Check Status</Button></td>
                  </tr>
                );
              })}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />

      {idClick && (
        <Modal show={idClick} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Details of Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={idBook.title}
              name="title"
              placeholder="Enter title of Book"
            />
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <br />
            <textarea
              name="content"
              value={idBook.content}
              id="content"
              cols="100"
              rows="10"
              placeholder="Start your Book"
            ></textarea>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      )}
      {
  <Dialog
  open={valuee===true}
  TransitionComponent={Transition}
  keepMounted
  onClose={()=>setValuee(false)}
  aria-describedby="alert-dialog-slide-description"
>
  <DialogTitle>Your Request Status is</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-slide-description" style={{color:"red",textAlign:'center'}}>
   {value}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
  <Button variant="contained" onClick={()=>{setValuee(false)}}>OK</Button>
   
  </DialogActions>
</Dialog>
}
    </div>
  );
};

export default ViewBooks;


























// import axios from "axios";
// import React from "react";
// import { Link } from "react-router-dom";
// import { Modal } from "react-bootstrap";
// import { useEffect, useState } from "react";
// import StatusButtons from "./Buttons/StatusButtons";
// import RequestPopUp from "./RequestPopUp";
// import "./formstyle.css";
// import ReactPaginate from "react-paginate";
// import Button from '@mui/material/Button';

// const ViewBooks = () => {
//   const [data, setData] = useState([]);
//   const [selectedBook, setSelectedBook] = useState(null);
//   const [idClick, setIdClick] = useState(false);
//   const [idBook, setIdBook] = useState(null);
//   const [value,setValue]=useState("Check status");
//   const [sortParams, setSortParams] = useState({
//     key: "bookId",
//     direction: "asc",
//   });

//   const [pageNumber, setPageNUmber] = useState(0);
//   const booksPerPage = 6;
//   const pagesVisited = pageNumber * booksPerPage;
//   const pageCount = Math.ceil(data.length / booksPerPage);
//   const changePage = ({ selected }) => {
//     setPageNUmber(selected);
//   };

//   const handleClose = () => setIdClick(!idClick);
//   const userName = localStorage.getItem("userName");
//   const handleResume = (book) => {
//     setSelectedBook(book);
//   };
//   const getBookDetails = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:9001/book/viewAllBooks/${userName}`
//       );
//       console.log(response.data);
//       setData(response.data); //.sort((a,b)=>a.bookId-b.bookId)));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleIdClick = (book) => {
//     setIdBook(book);
//     setIdClick(true);
//     console.log("Getting book data by id ", book);
//   };

//   const [requestStatus, setRequestStatus] = useState();
//   const getStatus = async (bookId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:9001/ManageBooks/getStatus/${bookId}`
//       );
//       setRequestStatus(response.data);
//       setValue(response.data);
//       console.log(response.data, "response->");
//       return response.data;
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   console.log(requestStatus, ": RequestStatus");

//   useEffect(() => {
//     getBookDetails();
//   }, []);
//   const sortData = (array, key, direction) => {
//     const sortedArray = array.slice();
//     sortedArray.sort((a, b) => {
//       if (a[key] < b[key]) {
//         return direction === "asc" ? -1 : 1;
//       } else if (a[key] > b[key]) {
//         return direction === "asc" ? 1 : -1;
//       } else {
//         return 0;
//       }
//     });
//     return sortedArray;
//   };
//   const handleSort = (key) => {
//     const newDirection = sortParams.direction === "asc" ? "desc" : "asc";
//     setSortParams({ key: key, direction: newDirection });
//   };

//   const sortedData = sortData(data, sortParams.key, sortParams.direction);
//   return (
//     <div className="view-books">
//       <table className="table" style={{ marginTop: "7%" }}>
//         <thead>
//           <tr style={{ boxShadow: "0px 1px 5px 3px #919091" }}>
//             <th scope="col">S.No</th>
//             <th
//               scope="col"
//               onClick={() => handleSort("bookId")}
//               style={{ cursor: "pointer" }}
//             >
//               Book Id{" "}
//               {sortParams.key === "bookId" && sortParams.direction === "asc"
//                 ? "↑"
//                 : "↓"}
//             </th>
//             <th
//               scope="col"
//               onClick={() => handleSort("title")}
//               style={{ cursor: "pointer" }}
//             >
//               Title{" "}
//               {sortParams.key === "title" && sortParams.direction === "asc"
//                 ? "↑"
//                 : "↓"}
//             </th>
//             <th
//               scope="col"
//               onClick={() => handleSort("status")}
//               style={{ cursor: "pointer" }}
//             >
//               Status
//               {sortParams.key === "status" && sortParams.direction === "asc"
//                 ? "↑"
//                 : "↓"}
//             </th>
//             <th scope="col">Request Status</th>
//           </tr>
//         </thead>

//         <tbody>
//           {sortedData &&
//             sortedData
//               .slice(pagesVisited, pagesVisited + booksPerPage)
//               .map((book, index) => {
//                 const { bookId, title, status } = book;
//                 let newstatus = status;
//                 if (status === "PAUSE") {
//                   newstatus = "RESUME";
//                 }
//                 if (status === "COMPLETED") {
//                   newstatus = "COMPLETED";
//                 }
//  return (
//                   <tr style={{ fontFamily: "Cambria" }} key={bookId}>
//                     <th scope="row">{index + 1}</th>
//                     <td>
//                       <Link
//                         to="#"
//                         title="See the Content to this Book"
//                         onClick={() => handleIdClick(book)}
//                       >
//                         {bookId}
//                       </Link>
//                     </td>
//                     <td>{title}</td>
//                     <td>
//                       <StatusButtons
//                         status={newstatus}
//                         book={book}
//                         onResume={handleResume}
//                       />
//                     </td>
//                     <td><Button variant="contained" onClick={()=>getStatus(bookId)}>{value}</Button></td>
//                   </tr>
//                 );
//               })}
//         </tbody>
//       </table>
//       <ReactPaginate
//         previousLabel={"Previous"}
//         nextLabel={"Next"}
//         pageCount={pageCount}
//         onPageChange={changePage}
//         containerClassName={"paginationBttns"}
//         previousLinkClassName={"previousBttn"}
//         nextLinkClassName={"nextBttn"}
//         disabledClassName={"paginationDisabled"}
//         activeClassName={"paginationActive"}
//       />
//       {selectedBook && (
//         <RequestPopUp
//           book={selectedBook}
//           onClose={() => setSelectedBook(null)}
//         />
//       )}

//       {idClick && (
//         <Modal show={idClick} onHide={handleClose} size="lg">
//           <Modal.Header closeButton>
//             <Modal.Title>Details of Book</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <label htmlFor="title" className="form-label">
//               Title
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               id="title"
//               value={idBook.title}
//               name="title"
//               placeholder="Enter title of Book"
//             />
//             <label htmlFor="content" className="form-label">
//               Content
//             </label>
//             <br />
//             <textarea
//               name="content"
//               value={idBook.content}
//               id="content"
//               cols="100"
//               rows="10"
//               placeholder="Start your Book"
//             ></textarea>
//           </Modal.Body>
//           <Modal.Footer></Modal.Footer>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default ViewBooks;


