import Head from "next/head";
import React from "react";
import type { NextPage } from "next";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import ComputerIcon from "@mui/icons-material/Computer";
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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;

const AuthHeader: NextPage = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();

  const MENU_LIST = [
    {
      title: "SignUp",
      icon: <LockOutlinedIcon />,
      href: "/Signup",
    },
    {
      title: "SignIn",
      icon: <LockOpenIcon />,
      href: "Signin",
    },
  ];

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
              <ListItemText
                sx={{ mr: 9, textAlign: "left" }}
                primary={list.title}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Head>
        <title>Engineer Record</title>
      </Head>
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
              <Button
                sx={{
                  color: "#fff",
                  fontSize: 18,
                  textTransform: "none",
                  ":hover": { color: grey[400] },
                }}
                onClick={() => router.push("/Signup")}
              >
                SignUp
              </Button>
              <Button
                sx={{
                  color: "#fff",
                  fontSize: 18,
                  textTransform: "none",
                  ":hover": { color: grey[400] },
                }}
                onClick={() => router.push("Signin")}
              >
                SignIn
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
    </>
  );
};

export default AuthHeader;
