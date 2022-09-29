import * as React from "react";
import { useRouter } from "next/router";
import { auth } from "./firebase";
import { useRecoilState } from "recoil";
import { userItemState } from "../constants/atom";
import HomeIcon from "@mui/icons-material/Home";
import ComputerIcon from "@mui/icons-material/Computer";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";
import { ListItemIcon } from "@mui/material";
interface Props {
  window?: () => Window;
}

const drawerWidth = 240;
// const navItems = ["Top", "Profile", "Logout"];

// const MENU_LIST = [
//   {
//     title: "TOP",
//     icon: <HomeIcon />,
//     href: "/Top",
//   },
//   {
//     title: "PROFILE",
//     icon: <AssignmentIndIcon />,
//     href: "/Profile",
//   },
//   {
//     title: "LOGOUT",
//     icon: <LogoutIcon />,
//     href: "/",
//   },
//   {
//     title: 'BOOKMARK',
//     icon: <BookmarkIcon />,
//     href: `${userItem.uid}/Bookmark`,
//   },
// ];

const Header = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const router = useRouter();

  const MENU_LIST = [
    {
      title: "TOP",
      icon: <HomeIcon />,
      href: "/Top",
    },
    {
      title: "PROFILE",
      icon: <AssignmentIndIcon />,
      href: `/${userItem.uid}/Profile`,
    },
    {
      title: 'BOOKMARK',
      icon: <BookmarkIcon />,
      href: `/${userItem.uid}/Bookmark`,
    },
    {
      title: "LOGOUT",
      icon: <LogoutIcon />,
      href: "/",
    },
  ];

  //ログアウト処理
  const handleLogout = () => {
    auth.signOut();
    //初期化必要
    setUserItem({
      ...userItem,
      email: "",
      uid: "",
      displayName: "",
      photoURL: "",
    });
    router.push("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Engineer Record
      </Typography>
      <Divider />
      <List>
        {MENU_LIST.map((list) => (
          <ListItem
            key={list.title}
            disablePadding
            onClick={() => {
              setMobileOpen(false);
              router.push(list.href);
            }}
          >
            <ListItemButton sx={{ textAlign: "center" }}>
              <ListItemIcon sx={{ ml: 3 }}>{list.icon}</ListItemIcon>
              <ListItemText sx={{ mr: 9 }} primary={list.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <ComputerIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Engineer Record
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {/* {MENU_LIST.map((list) => {
              return(
                <Button
              sx={{
                color: "#fff",
                fontSize: 16,
                ":hover": { color: grey[400] },
              }}
              onClick={() => router.push(list.href)}
            >
              {list.title}
            </Button>
              )
            })} */}
            <Button
              sx={{
                color: "#fff",
                fontSize: 16,
                ":hover": { color: grey[400] },
              }}
              onClick={() => router.push("/Top")}
            >
              TOP
            </Button>
            <Button
              sx={{
                color: "#fff",
                fontSize: 16,
                ":hover": { color: grey[400] },
              }}
              onClick={() => router.push(`/${userItem.uid}/Profile`)}
            >
              PROFILE
            </Button>
            <Button
              sx={{
                color: "#fff",
                fontSize: 16,
                ":hover": { color: grey[400] },
              }}
              onClick={() => router.push(`/${userItem.uid}/Bookmark`)}
            >
              BOOKMARK
            </Button>
            <Button
              sx={{
                color: "#fff",
                fontSize: 16,
                ":hover": { color: grey[400] },
              }}
              onClick={handleLogout}
            >
              LOGOUT
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
};

export default Header;
