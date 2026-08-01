import {
    Menu,
    NotificationsNone,
    Search
} from "@mui/icons-material";

import {
    Avatar,
    Badge,
    IconButton,
    TextField
} from "@mui/material";

import "./Topbar.css";

function Topbar(){

    return(

        <div className="topbar">

            <div>

                <IconButton>

                    <Menu/>

                </IconButton>

            </div>

            <div className="search">

                <TextField

                    size="small"

                    placeholder="Search employees..."

                    inputprops={{
                        startAdornment:<Search/>
                    }}

                />

            </div>

            <div className="profile">

                <Badge badgeContent={3} color="error">

                    <NotificationsNone/>

                </Badge>

                <Avatar/>

                <div>

                    <strong>Admin User</strong>

                    <p>System Administrator</p>

                </div>

            </div>

        </div>

    )

}

export default Topbar;