import Typography from '@mui/material/Typography';
import { styled } from "@mui/system";
 
function Para({ className, children, ...props }) {
    return (
        <Typography
            variant='body1'
            className={className}
            sx={{ mt: 2 }}
            {...props}
        >
            {children}
        </Typography>
    )
}
const StyledPara = styled(Para)``;
export default StyledPara;
