import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, FormControl, Form } from "react-bootstrap";
import MuiAlert from "@mui/material/Alert";
import "../formstyle.css";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";

const StatusButtons = (props) => {
  const [updatedBook, setUpdatedBook] = useState({
    title: "",
    content: "",
    status: props.book.status,
    authorId: localStorage.getItem("userName"),
    startDate: new Date(),
    endDate: new Date(),
  });

  const [show, setShow] = useState(false);
  const [isDelete, setDelete] = useState(false);
  const handleDeleteClose = () => setDelete(false);
  const handleClose = () => setShow(!show);
  const [completed, setCompleted] = useState(false);
  const [titleError, setTitleError] = useState();
  const [titleErr, setTitleErr] = useState(false);
  const [errors, setErrors] = useState({});
  const [deleted, setDeleted] = useState(false);
  const [errored, setErrored] = useState();
  const [isError, setIsError] = useState(false);
  const [paused, setPaused] = useState(false);
  const validationErrors = {};
  const handleShow = () => {
    props.book.status = 0;
    setShow(true);
  };

  useEffect(() => {
    // Retrieve the book details when the component mounts
    fetch(`http://localhost:9001/book/getBook/${props.book.bookId}`)
      .then((response) => response.json())
      .then((data) => setUpdatedBook(data))
      .catch((error) => console.log(error));
  }, [props.book.bookId]);

  //-------- Start of DeleteHandling------------------------------

  const deleteHandle = () => {
    setDelete(!isDelete);
    console.log("delete handle= ", isDelete);
  };

  const handleDeleting = async (e) => {
    e.preventDefault();
    setDelete(false);
    const book_Id = props.book.bookId;
    try {
      const response = await axios.delete(
        `http://localhost:9001/book/${book_Id}`
      );

      console.log(response);
      setDeleted(!deleted);
      window.location.reload();
    } catch (error) {
      console.log(error.response.data.message);

      setIsError(!isError);
      setErrored(error.response.data.message);
    }
  };

  //-------- End of DeleteHandling--------------------------

  const handlePause = async (e) => {
    e.preventDefault();
    console.log("inside handle pause method");

    updatedBook.status = 0;
    updatedBook.endDate = new Date();
    console.log(updatedBook, "-----++++>>>>");
    try {
      console.log("inside try block--->", props.book.bookId);

      const response = await axios.put(
        `http://localhost:9001/book/updateBook/${props.book.bookId}`,
        updatedBook
      );
      console.log("pausing book--->", response);
      setPaused(!paused);
      window.location.reload();
    } catch (error) {
      console.log(error);
      setTitleError(error.response.data.message);
      setTitleErr(!titleErr);
    }
  };

  //--------start of Handling Update book details--------------------------
  const handleComplete = async (e) => {
    e.preventDefault();
    
    console.log(updatedBook);
    try {
      updatedBook.status = 2;
      updatedBook.endDate = new Date();
      const response = await axios.put(
        `http://localhost:9001/book/updateBook/${props.book.bookId}`,
        updatedBook
      );
      //  window.location.reload();
      setCompleted(!completed);
      props.book.status = 2;
      console.log(response.data);

      onclose();
    } catch (error) {
      console.log(error);
      setTitleError(error.response.data.message);
      setTitleErr(!titleErr);
    }
  };

  //--------end of Handling Update book details--------------------------

  //--------start of Handling input field data--------------------------

  const handleOnChange = (e) => {
    e.preventDefault();
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

    setUpdatedBook((previousState) => ({ ...previousState, [name]: value }));
    console.log("--->", updatedBook);
  };

  //--------end of Handling input field data--------------------------

  // -------------handling send request--------------------------------------

  //--------end of Update book details in form--------------------------
  return (
    <div>
      {props.status === "COMPLETED" && (
        <button
          className="btn btn-success"
          style={{ backgroundColor: "green" }}
        >
          COMPLETED
        </button>
      )}
      {props.status === "RESUME" && (
        <button
          className="btn btn-success"
          style={{ backgroundColor: "red" }}
          onClick={handleShow}
        >
          &nbsp;&nbsp;&nbsp;&nbsp;RESUME&nbsp;&nbsp;&nbsp;
        </button>
      )}

      {
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Continue writing book...</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label htmlFor="title">Title</Form.Label>
                <FormControl
                  type="text"
                  id="title"
                  value={updatedBook.title}
                  name="title"
                  onChange={handleOnChange}
                  placeholder="Enter title of Book"
                  isInvalid={errors.title}
                  style={{ width: "770px" }}
                />
                <FormControl.Feedback type="invalid">
                  {errors.title}
                </FormControl.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label htmlFor="content">Content</Form.Label>
                <FormControl
                  as="textarea"
                  name="content"
                  value={updatedBook.content}
                  onChange={handleOnChange}
                  id="content"
                  placeholder="Start your Book"
                  rows="10"
                  cols="100"
                  isInvalid={errors.content}
                />
                <FormControl.Feedback type="invalid">
                  {errors.content}
                </FormControl.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handlePause}>
              Pause
            </Button>
            <Button variant="primary" onClick={handleComplete}>
              Completed
            </Button>
          </Modal.Footer>
        </Modal>
      }

      <DeleteIcon
        onClick={deleteHandle}
        style={{ marginTop: "5%", marginLeft: "5%" }}
      />

      {isDelete == true && (
        <Dialog open={isDelete} onClose={() => setDelete(false)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            Are you sue you want to delete this Book?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleting} className="btn btn-primary">
              Delete
            </Button>
            <Button variant="secondary" onClick={handleDeleteClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {
        <Dialog open={completed} onClose={() => setCompleted(false)}>
          <DialogTitle style={{ color: "green", fontWeight: "bold" }}>
            {" "}
            Your Book Successfully Completed!!!
          </DialogTitle>

          <DialogActions>
            <Button
              variant="secondary"
              onClick={() => {
                setCompleted(false);
                window.location.reload();
              }}
              style={{ margin: "auto", backgroundColor: "green" }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
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
        <Snackbar
          open={deleted}
          autoHideDuration={3000}
          onClose={() => setDeleted(!deleted)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setDeleted(!deleted)}
            severity="success"
          >
            Book deleted successfully
          </MuiAlert>
        </Snackbar>
      }

      {
        <Dialog
          open={isError}
          onClose={() => setIsError(!isError)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            style={{ color: "orange", fontWeight: "bold", textAlign: "center" }}
          >
            {"WARNING ⚠"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: "red" }}>
              {errored}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setIsError(!isError)}>
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
    </div>
  );
};

export default StatusButtons;
