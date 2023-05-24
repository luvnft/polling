import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';

export default function DropDownMenu() {
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   return (
      <div>
         <button
            type='button'
            id="fade-button"
            aria-controls={open ? 'fade-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            className="font-medium hover:bg-gray-200 text-black py-2 px-4 rounded-lg"
         >
            Poll Types
         </button>
         <Menu
            id="fade-menu"
            MenuListProps={{
               'aria-labelledby': 'fade-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
         >
            <MenuItem onClick={handleClose}>Agree / Disagree</MenuItem>
            <MenuItem onClick={handleClose}>True / False</MenuItem>
            <MenuItem onClick={handleClose}>Real / Fake</MenuItem>
         </Menu>
      </div>
   );
}