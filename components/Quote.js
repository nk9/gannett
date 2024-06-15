import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Link from 'src/Link';
import style from './Quote.module.scss';

export default function Quote({ children, sourceTitle, sourceHref }) {
    const theme = useTheme();
    var source;

    if (sourceTitle && sourceHref) {
        source = (<Box sx={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: "15pt",
            fontFamily: "Aleo",
            mb: 2
        }}>
            —&nbsp;<Link href={sourceHref}>{sourceTitle}</Link>
        </Box>)
    }
    return (
        <Box className={style.container}
            sx={{
                borderLeftColor: theme.palette.secondary.main
            }}>
            <Typography
                component="blockquote"
                className={style.blockquote}
                sx={{
                }}
            >
                {children}
            </Typography>
            {source}
        </Box>
    )
}
