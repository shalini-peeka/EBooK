import React, { useState, useEffect } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { TablePagination } from "@mui/material";
import { useCallback } from "react";
 
const StyledTableCell = styled(TableCell)(({ theme }) => ({
 [`&.${tableCellClasses.head}`]: {
   backgroundColor: theme.palette.common.black,
   color: theme.palette.common.white,
 },
 [`&.${tableCellClasses.body}`]: {
   fontSize: 14,
 },
}));
 
const StyledTableRow = styled(TableRow)(({ theme }) => ({
 "&:nth-of-type(odd)": {
   backgroundColor: theme.palette.action.hover,
 },
 // hide last border
 "&:last-child td, &:last-child th": {
   border: 0,
 },
}));
function ViewALLEbooks() {
 const [ebooks, setEbooks] = useState([]);
 const [selectedEbook, setSelectedEbook] = useState(null);
 const [page, setPage] = useState(0);
 const [rowsPerPage, setRowsPerPage] = useState(5);
 const [isPdfViewOpen, setIsPdfViewOpen] = useState(false);
 
 useEffect(() => {
   axios
     .get(
       `http://localhost:9001/ebook/getAllEbooks/${localStorage.getItem("userName")}`
     )
     // .get(API.view)
     .then((response) => setEbooks(response.data))
     .catch((error) => console.log(error));
 }, []);
 
 const handleDownload = (ebook) => {
   const byteArray = new Uint8Array(
     atob(ebook.data)
       .split("")
       .map((char) => char.charCodeAt(0))
   );
   const blob = new Blob([byteArray], {
     type:
       ebook.format === "pdf"
         ? "application/pdf"
         : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
   });
   const url = URL.createObjectURL(blob);
   const link = document.createElement("a");
   link.href = url;
   link.download = ebook.eBookName + "." + ebook.format;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
 };
 const handleViewPdf = (ebook) => {
   setSelectedEbook(ebook);
   setIsPdfViewOpen(true);
 };
 
 const handleViewDocx = (ebook) => {
   const byteArray = new Uint8Array(
     atob(ebook.data)
       .split("")
       .map((char) => char.charCodeAt(0))
   );
   const blob = new Blob([byteArray], {
     type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
   });
 
   const reader = new FileReader();
   reader.onloadend = function () {
     const url = URL.createObjectURL(
       new Blob([reader.result], { type: blob.type })
     );
     window.open(url, "_blank");
   };
   reader.readAsArrayBuffer(blob);
 };
 
 const handleCloseViewer = useCallback(() => {
   setSelectedEbook(null);
 }, [setSelectedEbook]);
 
 const handleChangePage = (event, newPage) => {
   setPage(newPage);
 };
 
 const handleChangeRowsPerPage = (event) => {
   setRowsPerPage(parseInt(event.target.value, 10));
   setPage(0);
 };
 return (
   <div>
     <TableContainer>
       <Table
         style={{
           backgroundColor: "white",
           width: "50%",
           margin: "auto",
           marginTop: "70px",
         }}
         aria-label="customixed table"
       >
         <TableHead>
           <TableRow>
             <StyledTableCell align="center">Title</StyledTableCell>
             <StyledTableCell align="center">Format</StyledTableCell>
             <StyledTableCell align="center">View</StyledTableCell>
             <StyledTableCell align="center">Download</StyledTableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {ebooks
             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
             .map((p) => (
               <StyledTableRow key={p.ebookId}>
                 <StyledTableCell>{p.eBookName}</StyledTableCell>
                 <StyledTableCell>{p.format}</StyledTableCell>
                 <StyledTableCell>
                   {p.format === "PDF" ? (
                     <Button
                       variant="contained"
                       onClick={() => handleViewPdf(p)}
                     >
                       View
                     </Button>
                   ) : (
                     <Button
                       variant="contained"
                       onClick={() => handleViewDocx(p)}
                     >
                       View
                     </Button>
                   )}
                 </StyledTableCell>
                 <StyledTableCell>
                   <Button
                     variant="contained"
                     onClick={() => handleDownload(p)}
                   >
                     Download
                   </Button>
                 </StyledTableCell>
               </StyledTableRow>
             ))}
         </TableBody>
       </Table>
       <TablePagination
         style={{ backgroundColor: "white", width: "50%", margin: "auto" }}
         rowsPerPageOptions={[5, 10, 25]}
         component="div"
         count={ebooks.length}
         rowsPerPage={rowsPerPage}
         page={page}
         onPageChange={handleChangePage}
         onRowsPerPageChange={handleChangeRowsPerPage}
       />
     </TableContainer>
     {selectedEbook && selectedEbook.format === "PDF" && (
       <div
         style={{
           position: "fixed",
           top: 50,
           left: 0,
           right: 0,
           bottom: 0,
         }}
       >
         <iframe
           src={`data:application/pdf;base64,${selectedEbook.data}`}
           style={{ width: "100%", height: "100%" }}
         ></iframe>
         <Button
           variant="contained"
           style={{ position: "absolute", top: 10, right: 10 }}
           onClick={handleCloseViewer}
         >
           Close
         </Button>
       </div>
     )}
     {selectedEbook && selectedEbook.format === "DOCX" && (
       <div
         style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
       >
         <iframe
           src={`data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${selectedEbook.data}`}
           style={{ width: "100%", height: "100%" }}
         ></iframe>
         <Button
           variant="contained"
           style={{ position: "absolute", top: 10, right: 10 }}
           onClick={handleCloseViewer}
         >
           Close
         </Button>
       </div>
     )}
   </div>
 );
}
 
export default ViewALLEbooks;

