import React, { useEffect, useState,useMemo  } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from '@mui/material/Paper';
import CancelIcon from '@mui/icons-material/Cancel';
import  { useNavigate ,Link} from 'react-router-dom'
import { Button } from 'react-bootstrap';
import { Dialog, DialogActions, DialogContent, DialogTitle, TablePagination, TextField } from "@mui/material";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
         color: theme.palette.common.white,
         whiteSpace: 'nowrap',
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
    height: "2px",
}));
const WhiteTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: '#fff',
  },
});
function ViewRequest() {
    const navigate = useNavigate();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [dataList, setdataList] = useState([]);
    const [dataCount, setdataCount] = useState(0);
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
      const [searchTerm, setSearchTerm] = useState({
        requestId: '',
        autorName: '',
        format: '',
        requestStatus: '',
        requestDate: '',
      });
      const [selectedRequestId, setSelectedRequestId] = useState(null);

    const handleUpdateButtonClick = (requestId) =>()=> {
      setSelectedRequestId(requestId);
        setShowConfirmDialog(true);
      };
      const handleYesButtonClick = () => {
        setShowConfirmDialog(false);
        navigate(`/updateReq?requestId=${selectedRequestId}`);
      };
    
      const handleNoButtonClick = () => {
        setShowConfirmDialog(false);
      };
      const handleViewButton=(autorName,bookId)=>{
        navigate(`/viewAd?autorName=${autorName}&bookId=${bookId}`);
      };
      useEffect(() => {
        const getData = async () => {
          const url = "http://localhost:9001/manageRequest/getRequests"
          try {
            const response = await axios.get(url);
            if (response.status === 200) {
              setdataList((response.data.sort((a, b) => a.requestId - b.requestId))); // Sort data by requestId
            setdataCount(response.data.count);
            } else {
              throw new Error('Request failed')
            }
          } catch (error) {
            console.log(error);
          }
        };
        getData();
      }, []);
      const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
    const handleTextFieldChange = (event) => {
      setSearchTerm({
        ...searchTerm,
        [event.target.name]: event.target.value,
      });
    };
  const filteredData = dataList.filter((p) => {
    return (
      (searchTerm.requestId === '' || p.requestId.toString() === searchTerm.requestId.toString()) &&
      (searchTerm.autorName === '' || p.autorName.toLowerCase().includes(searchTerm.autorName.toLowerCase())) &&
      (searchTerm.format === '' || p.format.toLowerCase().includes(searchTerm.format.toLowerCase())) &&
      (searchTerm.requestStatus === '' || p.requestStatus.toString().toLowerCase().includes(searchTerm.requestStatus.toString().toLowerCase())) &&
      (searchTerm.requestDate === '' || p.requestDate.toString().includes(searchTerm.requestDate))
    );
  });
    return (
        <div className="btn">
            <br></br>
            <br></br>
            <br></br>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="customized table" style={{width:"70%",marginLeft:"15%"}}>
                <TableHead>
                        <TableRow>
                              <StyledTableCell align="left" > RequestId<br/>
                                  <WhiteTextField placeholder="search"
                                  name="requestId"
                                    value={searchTerm.requestId}
                                    onChange={handleTextFieldChange}
                                  />
                              </StyledTableCell> 
    
                            <StyledTableCell align="left">Author Name<br/>
                            <WhiteTextField 
                                placeholder="search"
                                name="autorName"
                                value={searchTerm.autorName}
                                onChange={handleTextFieldChange}
                              /></StyledTableCell>
                            <StyledTableCell align="left">FormatType<br/>
                            <WhiteTextField
                                placeholder="search"
                                name="format"
                                value={searchTerm.format}
                                onChange={handleTextFieldChange}
                              /></StyledTableCell>
                            <StyledTableCell align="left">Request Status<br/>
                            <WhiteTextField
                                placeholder="search"
                                name="requestStatus"
                                value={searchTerm.requestStatus}
                                onChange={handleTextFieldChange}
                              /></StyledTableCell>
                            <StyledTableCell align="left">Requested Date<br/>
                            <WhiteTextField
                                placeholder="search"
                                name="requestDate"
                                value={searchTerm.requestDate}
                                onChange={handleTextFieldChange}
                              /></StyledTableCell>
                            <StyledTableCell align="center">Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(filteredData)
                            ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
                                 <StyledTableRow key={p.requestId}>
                                    <StyledTableCell component="th" scope="row">{p.requestId}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row">{p.autorName}</StyledTableCell>
                                    <StyledTableCell > {p.format}</StyledTableCell>
                                    <StyledTableCell >{p.requestStatus.toString()}</StyledTableCell>
                                    <StyledTableCell >{p.requestDate}</StyledTableCell>
                                    <StyledTableCell >
                                      <div style={{ display: 'flex', gap: '10px' }}>
                                          <Button disabled={p.requestStatus === "APPROVED"} onClick={handleUpdateButtonClick(p.requestId)}>Update Request</Button>
                                          <Button onClick={() => handleViewButton(p.autorName,p.bookId)}>View Book</Button>
                                      </div>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                            : null}
                    </TableBody>

                </Table>
                <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: dataList.length }]}
        component="div"
        count={dataList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
            </TableContainer>
            <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to update the request?</DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={handleNoButtonClick}>
            No
          </Button>
          <Button variant="primary" onClick={handleYesButtonClick}>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
        </div>
    );
}

export default ViewRequest;















































// import React, { useEffect, useState,useMemo  } from "react";
// import { styled } from "@mui/material/styles";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from '@mui/material/Paper';
// import CancelIcon from '@mui/icons-material/Cancel';
// import  { useNavigate ,Link} from 'react-router-dom'
// import { Button } from 'react-bootstrap';
// import { Dialog, DialogActions, DialogContent, DialogTitle, TablePagination, TextField } from "@mui/material";
// import axios from "axios";
// import UpdateRequest from "./UpdateRequest";

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//         backgroundColor: theme.palette.common.black,

//         color: theme.palette.common.white,
//     },

//     [`&.${tableCellClasses.body}`]: {
//         fontSize: 14,
//     },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     "&:nth-of-type(odd)": {
//         backgroundColor: theme.palette.action.hover,
//     },

//     // hide last border

//     "&:last-child td, &:last-child th": {
//         border: 0,
//     },
// }));
// function ViewRequest() {
//     const navigate = useNavigate();
//     const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//     const [dataList, setdataList] = useState([]);
//   const [dataCount, setdataCount] = useState(0);
//     const [controller, setController] = useState({
//         page: 0,
//         rowsPerPage: 10
//       });
//       const [page, setPage] = useState(0);
//       const [rowsPerPage, setRowsPerPage] = useState(10);
//       const [searchTerm, setSearchTerm] = useState('');
//       const [selectedRequestId, setSelectedRequestId] = useState(null);

//     const handleUpdateButtonClick = (requestId) =>()=> {
//       setSelectedRequestId(requestId);
//         setShowConfirmDialog(true);
//       };
//       const handleYesButtonClick = () => {
//         setShowConfirmDialog(false);
//         // navigate(`/updateReq`);
//         navigate(`/updateReq?requestId=${selectedRequestId}`);
//       };
    
//       const handleNoButtonClick = () => {
//         setShowConfirmDialog(false);
//       };
//       useEffect(() => {
//         const getData = async () => {
//           const url = `http://localhost:9001/manageRequest/getRequests?page=${controller.page}&size=${controller.rowsPerPage}`
//           try {
//             const response = await axios.get(url);
//             if (response.status === 200) {
//               setdataList(response.data);
//             setdataCount(response.data.count);
//             } else {
//               throw new Error('Request failed')
//             }
//           } catch (error) {
//             console.log(error);
//           }
//         };
//         getData();
//       }, [controller.page, controller.rowsPerPage]);
//       const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//       };
    
//       const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//       };
//       const handleSearchChange = (event) => {
//         setSearchTerm(event.target.value);
//         setPage(0);
//       };
//       const filteredData = searchTerm
//     ? dataList.filter((row) =>
//         Object.values(row)
//           .join(' ')
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       )
//     : dataList;
//         console.log(filteredData,"filteredData");
//     return (
//         <div className="btn">
//             <Button variant="contained" endIcon={<CancelIcon />} component={Link} to="/vieReq" />
//             <br></br>
//             <br></br>
//             <br></br>
//             <TextField
//         label="Search"
//         value={searchTerm}
//         onChange={handleSearchChange}
//         margin="normal"
//         variant="outlined"
//         fullWidth
//       />
//             <TableContainer component={Paper}>
//                 <Table sx={{ minWidth: 700 }}  aria-label="customized table">
//                     <TableHead>
//                         <TableRow>
//                             <StyledTableCell align="right">RequestId</StyledTableCell>
//                             <StyledTableCell align="right">Author Name</StyledTableCell>
//                             <StyledTableCell align="right">FormatType</StyledTableCell>
//                             <StyledTableCell align="right">Request Status</StyledTableCell>
//                             <StyledTableCell align="right">Requested Date</StyledTableCell>
//                             <StyledTableCell align="right">Action</StyledTableCell>
//                         </TableRow>
//                     </TableHead>

//                     <TableBody>
//                         {filteredData
//                             ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
//                                  <StyledTableRow key={p.requestId}>
//                                     <StyledTableCell component="th" scope="row">{p.requestId}</StyledTableCell>
//                                     <StyledTableCell component="th" scope="row">{p.autorName}</StyledTableCell>
//                                     <StyledTableCell align="right"> {p.format}</StyledTableCell>
//                                     <StyledTableCell align="right">{p.status}</StyledTableCell>
//                                     <StyledTableCell align="right">{p.requestDate}</StyledTableCell>
//                                     <StyledTableCell align="right"><Button  onClick={handleUpdateButtonClick(p.requestId)} >Update Request</Button></StyledTableCell>
//                                 </StyledTableRow>
//                             ))
//                             : null}
//                     </TableBody>

//                 </Table>
//                 <TablePagination
//         rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
//         component="div"
//         count={dataList.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//             </TableContainer>
//             <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
//         <DialogTitle>Confirmation</DialogTitle>
//         <DialogContent>Are you sure you want to update the request?</DialogContent>
//         <DialogActions>
//           <Button variant="secondary" onClick={handleNoButtonClick}>
//             No
//           </Button>
//           <Button variant="primary" onClick={handleYesButtonClick}>
//         Yes
//       </Button>
//     </DialogActions>
//   </Dialog>
//         </div>
//     );
// }

// export default ViewRequest;











// // import React, { useEffect, useState } from "react";
// // import { styled } from "@mui/material/styles";
// // import Table from "@mui/material/Table";
// // import TableBody from "@mui/material/TableBody";
// // import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// // import TableContainer from "@mui/material/TableContainer";
// // import TableHead from "@mui/material/TableHead";
// // import TableRow from "@mui/material/TableRow";
// // import Paper from '@mui/material/Paper';
// // import CancelIcon from '@mui/icons-material/Cancel';
// // import  { useNavigate ,Link} from 'react-router-dom'
// // import { Button } from 'react-bootstrap';
// // import { Dialog, DialogActions, DialogContent, DialogTitle, TablePagination, TextField } from "@mui/material";
// // import axios from "axios";

// // const StyledTableCell = styled(TableCell)(({ theme }) => ({
// //     [`&.${tableCellClasses.head}`]: {
// //         backgroundColor: theme.palette.common.black,

// //         color: theme.palette.common.white,
// //     },

// //     [`&.${tableCellClasses.body}`]: {
// //         fontSize: 14,
// //     },
// // }));

// // const StyledTableRow = styled(TableRow)(({ theme }) => ({
// //     "&:nth-of-type(odd)": {
// //         backgroundColor: theme.palette.action.hover,
// //     },

// //     // hide last border

// //     "&:last-child td, &:last-child th": {
// //         border: 0,
// //     },
// // }));
// // function ViewRequest() {
// //     const navigate = useNavigate();
// //     const [prop,setProp]=useState();
// //     const [showConfirmDialog, setShowConfirmDialog] = useState(false);
// //     const [dataList, setdataList] = useState([]);
// //   const [dataCount, setdataCount] = useState(0);
// //     const [controller, setController] = useState({
// //         page: 0,
// //         rowsPerPage: 10
// //       });
// //       const [page, setPage] = React.useState(0);
// //       const [rowsPerPage, setRowsPerPage] = React.useState(10);
// //     const handleUpdateButtonClick = () => {
// //         setShowConfirmDialog(true);
// //       };
    
// //       const handleYesButtonClick = () => {
// //         setShowConfirmDialog(false);
// //         navigate("/updateReq");
// //       };
    
// //       const handleNoButtonClick = () => {
// //         setShowConfirmDialog(false);
// //       };
// //     //   useEffect(()=>{
// //     //     loadData();
// //     //   },[]);
// //     //   const  loadData=async()=>{
// //     //     const result=await axios.get(`http://localhost:9000/manageRequest/getRequests`);
// //     //     setProp(result.data);
// //     //   }
// //       useEffect(() => {
// //         const getData = async () => {
// //           const url = `http://localhost:9000/manageRequest/getRequests?page=${controller.page}&size=${controller.rowsPerPage}`
// //           // if (searchQuery) {
// //           //   url = `http://localhost:9000/manageRequest/getRequests?page=${controller.page}&size=${controller.rowsPerPage}&search=${searchQuery}`;
// //           // }
// //           try {
// //             const response = await axios.get(url);
// //             if (response.status === 200) {
// //             //   const data = await response.json();
// //               setdataList(response.data);
// //             //   setdataCount(data.totalData);
// //             setdataCount(response.data.count);
// //             } else {
// //               throw new Error('Request failed')
// //             }
// //           } catch (error) {
// //             console.log(error);
// //           }
// //         };
// //         getData();
// //       }, [controller]);
// //       const handleChangePage = (event, newPage) => {
// //         setPage(newPage);
// //       };
    
// //       const handleChangeRowsPerPage = (event) => {
// //         setRowsPerPage(+event.target.value);
// //         setPage(0);
// //       };

// //     return (
// //         <div className="btn">
// //             <Button variant="contained" endIcon={<CancelIcon />} component={Link} to="/vieReq" />
// //             <br></br>
// //             <br></br>
// //             <br></br>
// //             <TableContainer component={Paper}>
// //                 <Table sx={{ minWidth: 700 }} aria-label="customized table">
// //                     <TableHead>
// //                         <TableRow>
// //                             <StyledTableCell align="right">RequestId</StyledTableCell>
// //                             <StyledTableCell align="right">Author Name</StyledTableCell>
// //                             <StyledTableCell align="right">FormatType</StyledTableCell>
// //                             <StyledTableCell align="right">Request Status</StyledTableCell>
// //                             <StyledTableCell align="right">Requested Date</StyledTableCell>
// //                             <StyledTableCell align="right">Action</StyledTableCell>
// //                         </TableRow>
// //                     </TableHead>

// //                     <TableBody>
// //                         {dataList
// //                             ? dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
// //                                  <StyledTableRow key={p.requestId}>
// //                                     <StyledTableCell component="th" scope="row">{p.requestId}</StyledTableCell>
// //                                     <StyledTableCell component="th" scope="row">{p.authorName}</StyledTableCell>
// //                                     <StyledTableCell align="right"> {p.formatType}</StyledTableCell>
// //                                     <StyledTableCell align="right">{p.requestStatus.toString()}</StyledTableCell>
// //                                     <StyledTableCell align="right">{p.requestDate}</StyledTableCell>
// //                                     <StyledTableCell align="right"><Button  onClick={handleUpdateButtonClick} >Update Request</Button></StyledTableCell>
// //                                 </StyledTableRow>
// //                             ))
// //                             : null}
// //                     </TableBody>
// //                      {/* <TableBody>
// //                                  <StyledTableRow >
// //                                     <StyledTableCell component="th" scope="row"></StyledTableCell>
// //                                     <StyledTableCell component="th" scope="row"></StyledTableCell>
// //                                     <StyledTableCell align="right"></StyledTableCell>
// //                                     <StyledTableCell align="right"></StyledTableCell>
// //                                     <StyledTableCell align="right"></StyledTableCell>
// //                                     <StyledTableCell align="right"><Button  onClick={handleUpdateButtonClick} >Update Request</Button></StyledTableCell>
// //                                 </StyledTableRow>
// //                     </TableBody> */}
// //                 </Table>
// //             </TableContainer>
// //             <TablePagination
// //         rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
// //         component="div"
// //         count={dataList.length}
// //         rowsPerPage={rowsPerPage}
// //         page={page}
// //         onPageChange={handleChangePage}
// //         onRowsPerPageChange={handleChangeRowsPerPage}
// //       />
// //             <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
// //         <DialogTitle>Confirmation</DialogTitle>
// //         <DialogContent>Are you sure you want to update the request?</DialogContent>
// //         <DialogActions>
// //           <Button variant="secondary" onClick={handleNoButtonClick}>
// //             No
// //           </Button>
// //           <Button variant="primary" onClick={handleYesButtonClick}>
// //         Yes
// //       </Button>
// //     </DialogActions>
// //   </Dialog>
// //         </div>
// //     );
// // }

// // export default ViewRequest;













