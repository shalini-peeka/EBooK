import axios from "axios";
import React, {  useState } from "react";
import "./formstyle.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Snackbar,
  TextField,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  },
  (props, prevProps) => {
    return props.children === prevProps.children;
  }
);

const AddBook = () => {
  const [book, setBook] = useState({
    title: "",
    content: "",
    status: "",
    authorId: localStorage.getItem("userName"),
    startDate: new Date(),
    endDate: new Date(),
  });
  const [paused, setPaused] = useState(false);
  const [errors, setErrors] = useState({});
  const [titleError, setTitleError] = useState();
  const [titleErr, setTitleErr] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [open, setOpen] = useState(false);
// -----------------------------------------------Handling Pause-------------------------
  const handlePause = async (e) => {
    e.preventDefault();
    const resp = await axios.get(
      `http://localhost:9001/book/getIncompleteBooks/${book.authorId}`
    );
    if (resp.data.length < 3) {
      if (book.title === "" && book.content == "") {
        validationErrors.title = "Title is required";
        validationErrors.content = "Content is required";
        setErrors(validationErrors);
      } else if (book.title === "") {
        validationErrors.title = "Title is required";
        setErrors(validationErrors);
      } else if (book.content === "") {
        validationErrors.content = "Content is required";
        setErrors(validationErrors);
      } else {
        book.status = 0;
        book.endDate = new Date();
        try {
          const response = await axios.post(
            "http://localhost:9001/book/saveBook",
            book
          );
          console.log(response.data);
          setPaused(!paused);
          window.location.reload();
        } catch (error) {
          console.log(error);
          setTitleError(error.response.data.message);
          setTitleErr(!titleErr);
        }
      }
    } else {
      setOpen(!open);
      
    }
  };

  
// -------------------------------------------Handling Complete-------------------------------
  const validationErrors = {};
  const handleComplete = async (e) => {
    e.preventDefault();
    const resp = await axios.get(
      `http://localhost:9001/book/getIncompleteBooks/${book.authorId}`
    );

    if (resp.data.length < 3) {
      if (book.title === "" && book.content == "") {
        validationErrors.title = "Title is required";
        validationErrors.content = "Content is required";
        setErrors(validationErrors);
      } else if (book.content === "") {
        validationErrors.content = "Content is required";
        setErrors(validationErrors);
      } else if (book.title === "") {
        validationErrors.title = "Title is required";
        setErrors(validationErrors);
      } else {
        book.status = 2;
        book.endDate = new Date();
        try {
          const response = await axios.post(
            "http://localhost:9001/book/saveBook",
            book
          );
          
          setCompleted(true);
          console.log(response.data);
        } catch (error) {
          if (error.message === "Request failed with status code 400") {
           
            const errorMessages = Object.values(error.response.data.errors).map(
              (error) => error
            );
            setErrors(errorMessages);
           
            console.log(error);
          }
          console.log(error.response.data.message, "error occured");
          setTitleError(error.response.data.message);
          setTitleErr(!titleErr);
        }
      }
    } else {
      setOpen(!open);
      
    }
  };

  // -----------------------------------------------Handling input change-----------------------------

  console.log("validation errors set=", errors);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title" && value.trim() === "") {
      validationErrors.title = "Title is required";
    }
    if (name === "content" && value.trim() === "") {
      validationErrors.content = "Content is required";
    }
    if (name === "title" && value.trim() != "" && value.length < 5) {
      validationErrors.title = "Title should be atleast 5 characters";
    }
    if (name === "content" && value.trim() != "" && value.length < 100) {
      validationErrors.content = "Content is too short";
    }
    setErrors(validationErrors);
    setBook({ ...book, [name]: value });
  };

  return (
    <div className="parent-box">
      <div
        className="box-style"
        style={{ marginLeft: "30%", marginTop: "4.5%", height: "fitContent" }}
      >
        <FormControl>
          <TextField
            id="standard-basic"
            label="Title"
            value={book.title}
            name="title"
            onChange={handleChange}
            variant="standard"
            error={Boolean(errors.title)}
            helperText={errors.title}
          />

          <TextField
            id="outlined-multiline-static"
            label="Type Content here..."
            multiline
            name="content"
            value={book.content}
            error={Boolean(errors.content)}
            helperText={errors.content}
            onChange={handleChange}
            style={{ marginTop: "20px", width: 500 }}
            rows={15}
            variant="outlined"
          />
          <Stack spacing={2} direction="row" style={{ marginTop: "5px" }}>
            <Button variant="contained" onClick={handlePause}>
              Pause
            </Button>
            <Button variant="contained" onClick={handleComplete}>
              Completed
            </Button>
          </Stack>
        </FormControl>
      </div>
      {
        <Dialog
          open={completed}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setCompleted(!completed)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle></DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-slide-description"
              style={{ color: "green", fontSize: "21px" }}
            >
              🎉Your Book Successfully Completed!!!🎉
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                window.location.reload();
                setCompleted(false);
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      }

      {
        <Snackbar
          open={titleErr}
          autoHideDuration={1000}
          onClose={() => setTitleErr(!titleErr)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setTitleErr(!titleErr)}
            severity="warning"
          >
            {titleError}
          </MuiAlert>
        </Snackbar>
      }
      {
        <Snackbar
          open={paused}
          autoHideDuration={1000}
          onClose={() => setPaused(!paused)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setPaused(!paused)}
            severity="warning"
          >
            Book Paused
          </MuiAlert>
        </Snackbar>
      }
      {
        <Dialog
          open={open === true}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpen(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle
            style={{ color: "orange", fontWeight: "bold", textAlign: "center" }}
          >
            {"WARNING ⚠"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-slide-description"
              style={{ color: "red" }}
            >
              You are not Allowed to Write a Book...To Start a book either
              Complete an incomplete book
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
                window.location.reload();
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      }
    </div>
  );
};

export default AddBook;
