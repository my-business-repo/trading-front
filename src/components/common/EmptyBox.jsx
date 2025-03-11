import { Box } from "@mui/material";
import empty from '../../images/general/empty.png';
export default function EmptyBox(){
    return(
        <Box width='100%' height='100%' display='flex' justifyContent='center' alignItems='center'>
            <img src={empty} width={100}/>
        </Box>
    );
}
