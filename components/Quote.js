import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import style from './Quote.module.scss';
 
export default function Quote({ children }) {
    const theme = useTheme();
    return (
        <Typography
            variant="body1"
            component="blockquote"
            className={style.blockquote}
            sx={{
                borderLeftColor: theme.palette.secondary.main
            }}
        >
            {children}
        </Typography>
    )
}
