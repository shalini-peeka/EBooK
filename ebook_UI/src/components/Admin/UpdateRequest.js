import React, {  useState} from "react"
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import CancelIcon from '@mui/icons-material/Cancel';
import { Typography,Card,CardContent,Grid,TextField, MenuItem, Snackbar } from '@mui/material';
import axios from "axios";
import { useLocation,useNavigate } from 'react-router-dom';


const UpdateRequest = ({ requestId }) => {
    const [requestStatus, setRequestStatus] = useState("")
    const [successMessage, setSuccessMessage] = useState("");
    const location = useLocation();
    requestId = new URLSearchParams(location.search).get('requestId');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `http://localhost:9001/manageRequest/updateRequest/${requestId}/${requestStatus}`
        const response = await axios.put(url);
        setRequestStatus(response.data);
        setSuccessMessage("Request updated successfully");
        setTimeout(() => {
            setSuccessMessage(""); // Clear success message after a delay
            navigate(-1); // Navigate back to the previous page using navigate function with -1 as argument
          }, 1000);
    };
    const handleClose = () => {
        setSuccessMessage("");
      };
    return (
        <div>
            <Card style={{maxWidth:450,maxHeight:500,margin:"0 auto",padding:"20px 5px",align:"center",marginTop:"70px"}}>
                <CardContent>
                    <Typography gutterBottom variant='h5'>Update details</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                <div style={{ position: 'absolute', top: 60, right: 0 ,}}>
                <Button variant="contained" color="error" endIcon={<CancelIcon />} component={Link} to="/viewReq" />
            </div>
                <Grid xs={12} sm={6} item>
                    <TextField label="Request status" select
                    type="Text"
                    placeholder="requeststatus"
                    value={requestStatus}
                    onChange={e => setRequestStatus(e.target.value)}  fullWidth required>
                    <MenuItem value="false">Choose</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="APPROVED">Approved</MenuItem>
                    </TextField>
                 </Grid>   
                <Grid xs={12}  item>
                <Button type="submit" fullWidth>Submit </Button>
                </Grid>
                </Grid>
            </form>
           </CardContent>
           </Card>
           <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleClose}
        message={successMessage}
      />
        </div>
    )
}

export default UpdateRequest;