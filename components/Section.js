import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Link from 'src/Link';
 
export default function Section({ children, anchor }) {
    const theme = useTheme();
    var id = anchor;

    if (anchor === undefined) {
        id = children.replace(/ /g, "-").toLowerCase();
    }

    return (
        <Box sx={{ position: "relative" }}>
            <Typography variant="h5" sx={{
                mt: 3,
            }} id={id}>
                <Link href={`#${id}`} sx={{
                    fontFamily: "Aleo",
                    textDecoration: "none",
                    fontWeight: 600,
                    color: "black",
                    "&:hover:after": {
                        content: "'§'",
                        marginLeft: ".7rem",
                        color: theme.palette.secondary.main
                    }

                }}>{children}</Link>
            </Typography>
        </Box>
    )
}
