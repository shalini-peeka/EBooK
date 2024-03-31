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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

function CreateEbook() {
  const [ebookRequests, setEbookRequests] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:9001/manageRequest/getRequests');
      const data = await response.json();
      const sortedData = data.filter(request => request.requestStatus === 'APPROVED').sort((a, b) => a.requestId - b.requestId);
      setEbookRequests(sortedData);
    }
    fetchData();
  }, []);
 

  const handleConvert = (requestId) => {
    setSelectedRequestId(requestId);
    setDialogOpen(true);
  };

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
    if (confirmed) {
      const convertBtn = document.getElementById(`convert-btn-${selectedRequestId}`);
      convertBtn.disabled = true;
      fetch(`http://localhost:9001/ebook/${selectedRequestId}`, {
        method: 'POST',
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(data => {
        setSuccessSnackbarOpen(true);
        setTimeout(() => {
          setSuccessSnackbarOpen(false);
          convertBtn.disabled = true;
          localStorage.setItem(`converted-${selectedRequestId}`, true);
        }, 3000);
      })
      .catch(error => {
        console.error('There was a problem converting the ebook:', error);
        alert('There was a problem converting the ebook. Please try again later.');
        convertBtn.disabled = false;
      });
    }
  };

  return (
    <div>
  <TableContainer>
    <Table style={{ backgroundColor: "white", width: "50%", margin: "auto", marginTop: "70px" }} aria-label="customixed table">
      <TableHead>
        <TableRow>
          <StyledTableCell align="center">Request Id</StyledTableCell>
          <StyledTableCell align="center">Author Name</StyledTableCell>
          <StyledTableCell align="center">Format</StyledTableCell>
          <StyledTableCell align="center">Action</StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {(rowsPerPage > 0
  ? ebookRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  : ebookRequests
).map((request) => (
  <StyledTableRow key={request.requestId}>
    <StyledTableCell align="center">{request.requestId}</StyledTableCell>
    <StyledTableCell align="center">{request.autorName}</StyledTableCell>
    <StyledTableCell align="center">{request.format}</StyledTableCell>
    <StyledTableCell align="center">
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleConvert(request.requestId)}
        id={`convert-btn-${request.requestId}`}
        disabled={localStorage.getItem(`converted-${request.requestId}`)}
      >
        Convert
      </Button>
    </StyledTableCell>
  </StyledTableRow>
))}

      </TableBody>
    </Table>
    <TablePagination
  style={{ backgroundColor: "white", width: "50%", margin: "auto" }}
  component="div"
  count={ebookRequests.length}
  page={page}
  onPageChange={(event, newPage) => setPage(newPage)}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={(event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }}
  rowsPerPageOptions={[5, 10, 25]}
/>
  </TableContainer>
  <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
    <DialogTitle>Confirm Conversion</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to convert this ebook?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
      <Button onClick={() => handleDialogClose(true)}>Convert</Button>
    </DialogActions>
  </Dialog>
  <Snackbar
    open={successSnackbarOpen}
    autoHideDuration={3000}
    onClose={() => setSuccessSnackbarOpen(false)}
    message="Ebook successfully converted!"
  />
</div>
);
}

export default CreateEbook;

