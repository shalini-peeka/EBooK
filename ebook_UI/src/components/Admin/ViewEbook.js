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
import { IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";


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
function ViewEbook() {

  const [ebooks, setEbooks] = useState([]);
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:9001/ebook/allEbooks")
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlesend = (ebook) => {
    const formData = new FormData();

    formData.append("to", ebook.userName);
    formData.append("subject", "Your Ebook is Ready ");
    formData.append("text", "Please find the attached book " + ebook.eBookName);

    const byteArray = new Uint8Array(
      atob(ebook.data)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([byteArray], {
      type:
        ebook.format === "pdf"
          ? "application/pdf"
          : // : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-word",
    });

    if (ebook.format.toLowerCase() === "pdf") {
      formData.append("pdfFile", blob, ebook.eBookName + ".pdf");
    } else {
      formData.append("wordFile", blob, ebook.eBookName + ".doc");
    }
    setLoad(true);
    axios
      .post("http://localhost:9001/email/send-email", formData)
      .then((response) => {
        console.log("Email sent successfully");
        setShowConfirmDialog(true);
        setLoad(false);
      })
      .catch((error) => {
        setLoad(false);
        setError(error.message);
        setShowErrorDialog(true);
      });
  };

  const handleOkButtonClick = () => {
    setShowConfirmDialog(false);
  };
return (
    <div>
      <TableContainer>
        <Table
          sx={{ minWidth: 500 }} aria-label="customized table" style={{width:"70%",marginLeft:"15%",marginTop:"6%"}}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Title</StyledTableCell>
              <StyledTableCell align="center">Format</StyledTableCell>
              <StyledTableCell align="center">AuthorName</StyledTableCell>
              <StyledTableCell align="center">Download</StyledTableCell>
              <StyledTableCell align="center">Send</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ebooks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ebook) => (
                <StyledTableRow key={ebook.ebookId}>
                  <StyledTableCell>{ebook.eBookName}</StyledTableCell>
                  <StyledTableCell>{ebook.format}</StyledTableCell>
                  <StyledTableCell>{ebook.userName}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleDownload(ebook)}
                    >
                      Download
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Dialog
                      open={showConfirmDialog}
                      onClose={() => setShowConfirmDialog(false)}
                    >
                      <DialogTitle>Success</DialogTitle>
                      <DialogContent>
                        Email sent successfully. Please check your Inbox
                      </DialogContent>
                      <DialogActions>
                        <Button
                          variant="secondary"
                          onClick={() => handleOkButtonClick()}
                        >
                          Ok
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Button
                      variant="contained"
                      endIcon={<EmailIcon />}
                      onClick={() => handlesend(ebook)}
                    >
                      Send
                    </Button>
                    <Dialog
                      open={showErrorDialog}
                      onClose={() => setShowErrorDialog(false)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Error"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Error While sending the Mail
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => setShowErrorDialog(false)}
                          color="primary"
                        >
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          style={{ backgroundColor: "white", width: "70%", margin: "auto" }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={ebooks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
       {load === true && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={load}
          onClick={() => setLoad(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
}

export default ViewEbook;


