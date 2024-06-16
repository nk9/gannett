import Typography from '@mui/material/Typography';
import { styled } from "@mui/system";
 
function Para({ className, children }) {
    return (
        <Typography
            variant='body1'
            className
            sx={{ mt: 1 }}>
            {children}
        </Typography>
    )
}
const StyledPara = styled(Para)``;
export default StyledPara;
