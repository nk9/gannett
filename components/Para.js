import Typography from '@mui/material/Typography';
 
export default function Para({ children }) {
    return (
        <Typography variant='body1' sx={{ mt: 1 }}>
            {children}
        </Typography>
    )
}
