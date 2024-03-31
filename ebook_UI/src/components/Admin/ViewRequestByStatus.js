import React, {useState,useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { IconButton,TextField ,Button, Grid,MenuItem, TablePagination} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Link } from 'react-router-dom';
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from '@mui/material/Paper';
import axios from "axios";


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


    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));
function ViewRequestByStatus() {
    const[requestStatus,setRequestStatus]=useState("");
    const [dataList,setdataList]=useState([]);
    const [dataCount, setdataCount] = useState(0);
    const [controller, setController] = useState({
        page: 0,
        rowsPerPage: 10
      });
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://localhost:9001/manageRequest/getrequestsbyStatus/${requestStatus}`
        const response = await axios.get(url);
        setdataList((response.data.sort((a, b) => a.requestId - b.requestId))); // Sort data by requestId
        setdataCount(response.data.count);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };
    return (
        <div className="btn">
            <div style={{ position: 'absolute', top: 60, right: 0 ,}}>
                <Button variant="contained" color="error" endIcon={<CancelIcon />} component={Link} to="/" />
            </div>
            <br></br>
            <br></br>
            <br></br>
            <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
            <Grid xs={6}  item>
                <TextField label="Status" select
                    type="Text"
                    autoFocus
                    placeholder="Type"
                    value={requestStatus}
                    onChange={e =>setRequestStatus(e.target.value)} fullWidth required>
                    <MenuItem value="false">Choose</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="APPROVED">Approved</MenuItem>
                </TextField>
                </Grid>
                <Grid item>
                    <Button variant="contained" color="primary" type="submit">Submit</Button>
                </Grid>
            </Grid>
            </form>
            <br></br>
            <br></br>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">RequestId</StyledTableCell>
                            <StyledTableCell align="left">Author Name</StyledTableCell>
                            <StyledTableCell align="left">FormatType</StyledTableCell>
                            <StyledTableCell align="left">Request Status</StyledTableCell>
                            <StyledTableCell align="left">Requested Date</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {dataList
                            ? dataList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
                                <StyledTableRow key={p.requestId}>
                                    <StyledTableCell component="th" scope="row">{p.requestId}</StyledTableCell>
                                    <StyledTableCell align="left">{p.autorName}</StyledTableCell>
                                    <StyledTableCell align="left"> {p.format}</StyledTableCell>
                                    <StyledTableCell align="left">{p.requestStatus.toString()}</StyledTableCell>
                                    <StyledTableCell align="left">{p.requestDate}</StyledTableCell>
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
        </div>
    );
}

export default ViewRequestByStatus;
