import Typography from '@mui/material/Typography';
import style from './Quote.module.scss';
 
export default function Quote({ children }) {
    return (
        <Typography
            variant="body1"
            component="blockquote"
            className={style.blockquote}
        >
            {children}
        </Typography>
    )
}
