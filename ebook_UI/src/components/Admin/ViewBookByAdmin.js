import React from "react";
import {  useState, useEffect } from "react";
import { useNavigate ,useLocation} from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Grid, TextField } from "@mui/material";

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
function ViewBookByAdmin({autorName,bookId}) {
  const[data,setData]=useState([]);
  const location = useLocation();
  autorName = new URLSearchParams(location.search).get('autorName');
  bookId = new URLSearchParams(location.search).get('bookId');
  useEffect(() => {
    const getData = async () => {
      const url = `http://localhost:9001/manageRequest/viewBookByAdmin/${autorName}/${bookId}`
      try {
        const response = await axios.get(url);
        if (response.status === 200) {
          setData((response.data));
        } else {
          throw new Error('Request failed')
        }
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

return (
    <div>
      <div style={{ position: 'absolute', top: 60, right: 0 ,}}>
                <Button variant="contained" color="error" endIcon={<CancelIcon />} component={Link} to="/viewReq" />
            </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="customized table" style={{width:"70%",marginLeft:"15%",marginTop:"6%"}}>
            <TableHead>
              <TableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Content</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((p,index)=>(
              <StyledTableRow key={index}>
                <StyledTableCell>{p.title}</StyledTableCell>
                <StyledTableCell>{p.content}</StyledTableCell>
              </StyledTableRow>
             ) )}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
  );
}

export default ViewBookByAdmin;

