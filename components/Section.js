import Typography from '@mui/material/Typography';
import Link from 'src/Link';
 
export default function Section({ children, anchor }) {
    var id = anchor;
    console.log("anchor:", anchor);
    if (anchor === undefined) {
        id = children.replace(/ /g, "_").toLowerCase();
    }

    return (
        <Typography variant="h5" sx={{ mt: 3 }} id={id}>
            {children}
        </Typography>
    )
}
