import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

export default function LogoHeader({ headline }) {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Image alt="Diving Gannet logo"
                    src={"/logo-dive.svg"}
                    width={100}
                    height={130}
                    sizes='100vw' />
            </Box>
            <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700, fontSize: "30pt" }}>
                {headline}
            </Typography>
        </>
    )
}
