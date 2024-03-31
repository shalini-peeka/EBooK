import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
const ViewRequests = () => {
  const [data, setData] = useState([]);
  const getRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9001/ManageBooks/getAllRequests`
      );
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [requestData, setRequestData] = useState({});
  const [viewData, setViewData] = useState(false);
  const [enableConvert, setEnableConvert] = useState(false);
  const [book, setBook] = useState({
    title: "",
    content: "",
  });
  const handleRequestStatus = async (requestData) => {
    console.log("The requested data has the forlling details... ", requestData);
    setRequestData(requestData);
    setViewData(!viewData);
    console.log(requestData, " Request data set");
    try {
      const response = await axios.get(
        `http://localhost:9001/book/getBook/${requestData.bookId}`
      );
      console.log("Book details are: ", response.data);
      setBook(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log("book title:"+book.title+"\n book content"+book.content);
  const handleUpdate = async (status) => {
    requestData.status = status === "APPROVED" ? "APPROVED" : "REJECTED";
    if (requestData.status === "APPROVED") setEnableConvert(!enableConvert);
    else if (requestData.status === "REJECTED") setEnableConvert(false);
    requestData.acceptedDate = new Date();
    const updatedData = {
      ...requestData,
    };
    try {
      const response = await axios.put(
        `http://localhost:9001/ManageBooks/updateRequest/${requestData.requestId}`,
        requestData
      );
      console.log(response, "-->Updated data");
      setViewData(!viewData);
    } catch (error) {
      console.log(error);
    }
  };

  const [popUp, setpopUp] = useState(false);
  const handleConversion = async (request) => {
    setRequestData(request);
    console.log("request format: ", request.format);
    // if(request.format==="PDF")
    // {
    //     axios({
    //         url: `http://localhost:9001/ebook/requestedBook/${request.requestId}`, // replace with your backend API URL
    //         method: 'GET',
    //         responseType: 'blob'
    //       }).then(response => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'ebook.pdf'); // replace with the downloaded file name
    //         document.body.appendChild(link);
    //         link.click();
    //       });
    //     //   window.location.reload();
    // }
    // else if(request.format==="WORD"){
    //     axios({
    //         url: `http://localhost:9001/ebook/requestedBook/${request.requestId}`, // replace with your backend API URL
    //         method: 'GET',
    //         responseType: 'blob'
    //       }).then(response => {
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.setAttribute('download', 'ebook.doc'); // replace with the downloaded file name
    //         document.body.appendChild(link);
    //         link.click();
    //       });
    //     //   window.location.reload();
    // }

    try {
      const response = await axios.post(
        `http://localhost:9001/ebook/createEbooks/${request.requestId}`
      );
      console.log(response);
      setpopUp(!popUp);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();
    console.log("Requested format to download is " + requestData.format);
    if (requestData.format === "PDF") {
      axios({
        url: `http://localhost:9001/ebook/requestedBook/${requestData.requestId}`, // replace with your backend API URL
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ebook.pdf"); // replace with the downloaded file name
        document.body.appendChild(link);
        link.click();
      });
      setpopUp(!popUp);
    } else if (requestData.format === "WORD") {
      axios({
        url: `http://localhost:9001/ebook/requestedBook/${requestData.requestId}`, // replace with your backend API URL
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ebook.doc"); // replace with the downloaded file name
        document.body.appendChild(link);
        link.click();
      });
      setpopUp(!popUp);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);
  return (
    <div>
      <table className="table" style={{ marginTop: "4%" }}>
        <thead>
          <tr style={{ boxShadow: "0px 1px 5px 3px #919091" }}>
            <th scope="col">S.No</th>
            <th scope="col">Request Id</th>
            <th scope="col">Book Id</th>
            <th scope="col">Format</th>
            <th scope="col">Request Status</th>
            <th scope="col">Requested Date</th>
          </tr>
        </thead>

        <tbody>
          {data &&
            data.map((request, index) => {
              return (
                <tr style={{ fontFamily: "Cambria" }} key={request.requestId}>
                  <th scope="row">{index + 1}</th>
                  <td>{request.requestId}</td>
                  <td>{request.bookId}</td>
                  <td>{request.format}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleRequestStatus(request)}
                    >
                      {request.status}
                    </button>
                    &nbsp;
                    {request.status === "PENDING" && (
                      <button className="btn btn-secondary" disabled="true">
                        Convert
                      </button>
                    )}
                    {request.status === "APPROVED" && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleConversion(request)}
                      >
                        Convert
                      </button>
                    )}
                    {request.status === "REJECTED" && (
                      <button className="btn btn-secondary" disabled="true">
                        Convert
                      </button>
                    )}
                  </td>
                  <td>{request.requestDate}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {
        <Modal show={viewData} onHide={() => setViewData(!viewData)} size="lg">
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
              value={book.title}
              name="title"
              // onChange={handleOnChange}
              placeholder="Enter title of Book"
            />
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <br />
            <textarea
              name="content"
              value={book.content}
              // onChange={handleOnChange}
              id="content"
              cols="100"
              rows="10"
              placeholder="Start your Book"
            ></textarea>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={() => handleUpdate("APPROVED")}>
              Approve
            </Button>
            <Button variant="danger" onClick={() => handleUpdate("REJECTED")}>
              Reject
            </Button>
          </Modal.Footer>
        </Modal>
      }

      {
        <Dialog open={popUp} onClose={() => setpopUp(!popUp)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>Do you want to download the Ebook?</DialogContent>
          <DialogActions>
            <Button onClick={handleDownload} className="btn btn-primary">
              Yes
            </Button>
            <Button variant="secondary" onClick={() => setpopUp(!popUp)}>
              No
            </Button>
          </DialogActions>
        </Dialog>
      }
    </div>
  );
};

export default ViewRequests;
