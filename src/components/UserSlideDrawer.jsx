import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme, styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import useToggleAuth from "@/utils/hooks/useToggleAuth";
import useDarkMode from "@/utils/hooks/useDarkMode";
import SlideDrawer from "./Drawer";
import CalculateOutlined from "@mui/icons-material/CalculateOutlined";
import Save from "@mui/icons-material/Save";
import Message from "@mui/icons-material/Message";
import Settings from "@mui/icons-material/Settings";
import Dashboard from "@mui/icons-material/Dashboard";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";

const StyledBtn = styled(Button)(({ theme }) => ({
  maxWidth: { xs: "150px", sm: "100%" },
  marginLeft: "auto",
  borderRadius: "1em",
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily.Manrope,
  backgroundColor: theme.palette.background.default,
  borderColor: theme.palette.grey[200],
  transition: "0.3s ease",
  boxShadow: theme.shadows[2],
  transition: "0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

function UserSlideDrawer({ showDrawer, toggleDrawer }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { Auth, loggedInUser, isLoggedIn, toggleAuth, logout } =
    useToggleAuth();
  const { isDarkModeActive, toggleDarkMode } = useDarkMode();

  const navigateTo = (link) => () => {
    router.push(link);
    toggleDrawer();
  };

  return (
    <SlideDrawer
      open={showDrawer}
      handleClose={toggleDrawer}
      title={
        !isLoggedIn ? "Welcome to ProperHomes" : `Hello ${loggedInUser?.name}`
      }
      position={isMobile ? "bottom" : "right"}
    >
      <Stack p={2} sx={{ height: "100%" }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center">
            <Typography
              color={theme.palette.text.primary}
              fontFamily={theme.typography.fontFamily.Monsterrat}
              fontWeight={600}
              fontSize={20}
              textAlign={"center"}
              mt={1}
              ml={{ xs: "1rem", md: 0 }}
            >
              {isLoggedIn
                ? `Hello, ${loggedInUser?.name}`
                : "Welcome to ProperHomes"}
            </Typography>

            {isDarkModeActive ? (
              <LightMode
                sx={{ marginLeft: "auto", cursor: "pointer" }}
                onClick={toggleDarkMode}
                htmlColor="#fff"
              />
            ) : (
              <DarkMode
                sx={{ marginLeft: "auto", cursor: "pointer" }}
                onClick={toggleDarkMode}
                htmlColor="#000"
              />
            )}
          </Stack>

          {isLoggedIn && (
            <>
              <StyledBtn
                startIcon={<Dashboard />}
                onClick={navigateTo("/dashboard")}
              >
                Dashboard
              </StyledBtn>
              <StyledBtn
                startIcon={<Message />}
                onClick={navigateTo("/dashboard/chat")}
              >
                Messages
              </StyledBtn>
              <StyledBtn
                startIcon={<Settings />}
                onClick={navigateTo("/dashboard/settings")}
              >
                Settings
              </StyledBtn>
              <StyledBtn
                startIcon={<Save />}
                onClick={navigateTo("/dashboard/saved")}
              >
                Saved Properties
              </StyledBtn>
            </>
          )}

          <StyledBtn
            startIcon={<CalculateOutlined />}
            onClick={navigateTo("/homeloan/emi-calculator")}
          >
            EMI Calculator
          </StyledBtn>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} mt="auto">
          {!isLoggedIn ? (
            <StyledBtn startIcon={<Login />} fullWidth onClick={toggleAuth}>
              Login or Signup
            </StyledBtn>
          ) : (
            <StyledBtn startIcon={<Logout />} fullWidth onClick={logout}>
              Logout
            </StyledBtn>
          )}
        </Stack>
      </Stack>
      {Auth}
    </SlideDrawer>
  );
}

export default UserSlideDrawer;
