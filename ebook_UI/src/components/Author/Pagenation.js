import axios from "axios";
import { useState, useEffect } from "react";
import ReactPaginate from 'react-paginate';

const Pagenation = () => {
  const [data, setData] = useState([]);
  
 const [pageNumber,setPageNUmber]=useState(0);
 const booksPerPage=5;
const pagesVisited=pageNumber*booksPerPage;
const displayedBooks=data.slice(pagesVisited,pagesVisited+booksPerPage).map(data=>{
  return (
    <div style={{backgroundColor:'green',color:'black',border:'1px solid black',width:'50%',margin:'auto',marginBottom:'2%'}}>
      <h3>{data.bookId}</h3>
      <h3>{data.title}</h3>
      {/* <h3>{data.content}</h3> */}
    </div>
  ) 
})


  const getBookDetails = async () => {
    const userName="Abc@gmail.com";
    try {
      const response = await axios.get(
        `http://localhost:9001/book/viewAllBooks/${userName}`
      );
      console.log("After pagination", response.data);
      setData(response.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBookDetails();
  }, []);
const pageCount=Math.ceil(data.length/booksPerPage);
const changePage=({selected})=>{
setPageNUmber(selected);
}
  return (
    <div className="view-books">
      {displayedBooks}
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

      
      {/* <table className="table" style={{ marginTop: "4%" }}>
        <thead>
          <tr style={{ boxShadow: "0px 1px 5px 3px #919091" }}>
            <th scope="col">S.No</th>
            <th scope="col">Book Id</th>
            <th scope="col">Title</th>
            <th scope="col">Status</th>
            <th scope="col">Request Status</th>
          </tr>
        </thead>

        <tbody> */}
      {/* {data &&
            data.map((book, index) => {
              const { bookId, title,content} = book;
              
              return (
                <tr style={{ fontFamily: "Cambria" }} key={bookId}>
                  <th scope="row">{index + 1}</th>
                  <td> */}
                    {/* <Link
                      to="#"
                      title="See the Content to this Book"
                      onClick={() => handleIdClick(book)}
                    > */}
                      {/* {bookId} */}
                    {/* </Link> */}
                  {/* </td>
                  <td>{title}</td>
                  <td>
                    {content}
                  </td>
                  <td>Approved/Rejected</td>
                </tr>
              );
            })}
            </tbody>
      </table> */}
    </div>
  );
};
export default Pagenation;


