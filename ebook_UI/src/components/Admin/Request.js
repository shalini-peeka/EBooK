import React, { useState, useEffect } from "react"
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import {useNavigate }  from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import { Typography,Card,CardContent,Grid,TextField, MenuItem, Snackbar } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import MuiAlert from "@mui/material/Alert";
import {Grow} from "@mui/material";

const Request = () => {
  const[autorName,setAuthorName]=useState("")
  const[bookId,setBookId]=useState("")
  const [format, setFormat] = useState("")
  const requestDate = new Date().toISOString().slice(0, 10);
  const [bookIdError, setBookIdError] = useState("");
  const [formatError, setFormatError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const[bookIds,setBookIds]=useState([]);
  useEffect(() => {
    // Fetch book IDs for a particular author when autorName changes
    if (localStorage.getItem("userName")) {
      axios
        .get(`http://localhost:9001/book/getBookIds/${localStorage.getItem("userName")}`)
        .then((response) => {
          setBookIds(response.data);
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    }
  }, [autorName]);
  const handleInput = (e, setState, setErrorState) => {
    setState(e.target.value);
    setErrorState("");
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    // if (!autorName) {
    //   setAuthorNameError("Please enter author name");
    // } else {
    //   setAuthorNameError("");
    // }

    if (!bookId) {
      setBookIdError("Please enter book ID");
    } else {
      setBookIdError("");
    }

    if (!format) {
      setFormatError("Please select format type");
    } else {
      setFormatError("");
    }
    if (bookId  && format ) {
    const requestData = {
      autorName: autorName,
      bookId: bookId,
      format: format,
      requestDate:requestDate
    };

    axios
      .post(`http://localhost:9001/manageRequest/addRequest/${bookId}/${localStorage.getItem("userName")}`, requestData)
      .then((response) => {
        console.log(response.data);
        // Handle success response
        setSuccessMessage(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
        // Handle error response
        setErrorMessage("The author does not hold the bookId");
      });
  }
};
const [showConfirmDialog, setShowConfirmDialog] = useState(false);
const navigate = useNavigate();
const handleCancelButtonClick = () => {
    setShowConfirmDialog(true);
  };

  const handleYesButtonClick = () => {
    setShowConfirmDialog(false);
    navigate("/");
  };

  const handleNoButtonClick = () => {
    setShowConfirmDialog(false);
  };
  const handleClose = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };
  return (
    <div>
    <Card style={{maxWidth:450,maxHeight:500,margin:"0 auto",padding:"20px 5px",align:"center",marginTop:"80px"}}>
    <CardContent>
        <Typography gutterBottom variant='h5'>Create Request</Typography>
        <form onSubmit={handleSubmit}>
    <Grid container spacing={1}>
    {/* <Grid xs={12}  item>
        <TextField label="Author name"
        type="Text"
        placeholder="author name"
        value={autorName}
        onChange={e =>  handleInput(e, setAuthorName, setAuthorNameError)}  fullWidth  error={Boolean(authorNameError)}
        helperText={authorNameError} />
     </Grid>  */}
     <Grid xs={12}  item>
        <TextField label="Book Id"  select
        type="Number"
        placeholder="book id"
        value={bookId}
        onChange={e => handleInput(e, setBookId, setBookIdError)}  fullWidth error={Boolean(bookIdError)}
        helperText={bookIdError}>
        {bookIds.map((bookId,index) => (
        <MenuItem key={bookId} value={bookId}>{index+1}</MenuItem>
        ))}
        </TextField>
     </Grid>
    <Grid xs={12}  item>
        <TextField label="FormatType" select
        type="Text"
        placeholder="Type"
        value={format}
        onChange={e =>handleInput(e, setFormat, setFormatError)} fullWidth   error={Boolean(formatError)}
        helperText={formatError}>
        <MenuItem value="false">Choose</MenuItem>
        <MenuItem value="PDF">PDF</MenuItem>
        <MenuItem value="DOCX">DOCX</MenuItem>
        </TextField>
    </Grid>
    <Grid xs={12}  item>
    <Button type="submit" variant="contained" endIcon={<SendIcon />}>Send</Button>
    </Grid>
    <Grid xs={12}  item>
    <Button variant="contained" color="error" endIcon={<CancelIcon />} onClick={handleCancelButtonClick}>Cancel</Button>
    </Grid>
    </Grid>
</form>
</CardContent>
</Card>
<Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>Are you sure you want to cancel?</DialogContent>
        <DialogActions>
          <Button  variant="secondary" onClick={handleNoButtonClick}>
            No
          </Button>
          <Button  onClick={handleYesButtonClick}>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
  <Snackbar open={successMessage !== "" || errorMessage !== ""} autoHideDuration={3000} onClose={handleClose} TransitionComponent={Grow}>
        <MuiAlert severity={errorMessage !== "" ? "error" : "success"} onClose={handleClose}>
          {errorMessage !== "" ? errorMessage : successMessage}
        </MuiAlert>
  </Snackbar>
</div>
  )
}

export default Request;

