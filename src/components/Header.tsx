import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ComputerIcon from "@mui/icons-material/Computer";
import { useRouter } from "next/router";
import { auth } from "./firebase";
import { useRecoilState } from "recoil";
import { userItemState } from "../constants/atom";

const navItems = ["Home", "Profile", "Logout"];

const Header = () => {
  const [userItem, setUserItem] = useRecoilState(userItemState);
  const router = useRouter();

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
    router.push("/Signup");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <ComputerIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Engineer Record
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button sx={{ color: "#fff" }} onClick={() => router.push("/Top")}>
              TOP
            </Button>
            <Button
              sx={{ color: "#fff" }}
              onClick={() => router.push("/Profile")}
            >
              PROFILE
            </Button>
            <Button sx={{ color: "#fff" }} onClick={handleLogout}>
              LOGOUT
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ mb: 4 }} />
    </Box>
  );
};

export default Header;
