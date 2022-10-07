import React from "react";
import Head from "next/head";
import type { NextPage } from "next";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import HomeIcon from "@mui/icons-material/Home";
import ComputerIcon from "@mui/icons-material/Computer";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
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

const Home: NextPage = (props: Props) => {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();

  const MENU_LIST = [
    {
      title: "SignUp",
      icon: <HomeIcon />,
      href: "/Signup",
    },
    {
      title: "Login",
      icon: <AssignmentIndIcon />,
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
                Login
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

      <Box
        sx={{
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          mt: 6,
        }}
      >
        <Typography sx={{ mx: "auto", mb: 3 }} variant="h4">
          Engineer Recordへようこそ
        </Typography>
        <Typography sx={{ mx: "auto", mb: 2 }} variant="h5">
          学習記録を積み上げませんか？
        </Typography>
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2, width: 200, mx: "auto", fontSize: 18 }}
          onClick={() => router.push("/Signup")}
        >
          Get Started
        </Button>
      </Box>

      {/* <Box sx={{ display: "flex", justifyContent: 'space-around', mt: 8 }}>
          <Card variant="outlined" sx={{ minWidth: 320, display: "flex" }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 18,mb: 1.5 }}
                color="text.secondary"
              >
                こんな方に向いています
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }} >
              ・プログラミング学習中の方
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }} >
              ・プログラミング学習中の方
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5 }} >
              ・プログラミング学習中の方
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ minWidth: 320 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 18 }}
                color="text.secondary"
                gutterBottom
              >
                こんな方に向いています
              </Typography>
              <Typography variant="h5" component="div"></Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ minWidth: 320 }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 18 }}
                color="text.secondary"
                gutterBottom
              >
                こんな方に向いています
              </Typography>
              <Typography variant="h5" component="div"></Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                adjective
              </Typography>
              <Typography variant="body2">
                well meaning and kindly.
                <br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
          </Card>
        </Box> */}
    </>
  );
};

export default Home;
