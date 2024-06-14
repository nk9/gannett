import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from 'src/Link';
 
export default function Section({ children, anchor }) {
    var id = anchor;

    if (anchor === undefined) {
        id = children.replace(/ /g, "-").toLowerCase();
    }

    return (
        <Box sx={{ position: "relative" }}>
            <Typography variant="h5" sx={{
                mt: 3,
                "&:hover:before": {
                    content: "'§'",
                    position: "absolute",
                    left: "-1.5rem"
                }
            }} id={id}>
                <Link href={`#${id}`} sx={{
                    textDecoration: "none",
                    color: "black"
                }}>{children}</Link>
            </Typography>
        </Box>
    )
}
