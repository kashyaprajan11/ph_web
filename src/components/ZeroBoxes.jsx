"use client";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";

const infoBoxes = [
  {
    title: "Zero Spam",
    color: "#faf6ff",
    Icon: PhoneDisabledIcon,
    description: `No calls or spam messages without your explicit consent.`,
  },
  {
    title: "Zero Brokerage",
    color: "#eaf9f5",
    Icon: MoneyOffIcon,
    description: `  100% Real Owner Verified Properties. No brokers or middlemen
    involved.`,
  },
  {
    title: "Zero Paperwork",
    color: "#f0f8ff",
    Icon: ContentPasteOffIcon,
    description: ` 100% Digital experience. Even if its Aadhar verification or Police
    Verification.`,
  },
  {
    title: "Zero Issues",
    color: "#f9f7e7",
    Icon: ThumbUpIcon,
    description: `From services to refunds, every process happens seamlessly.`,
  },
];

export default function ZeroBoxes() {
  const theme = useTheme();
  return (
    <Box
      py={2}
      px={{ xs: 2, md: 0 }}
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "2em",
        [theme.breakpoints.down("md")]: {
          gridTemplateColumns: "1fr 1fr",
        },
        [theme.breakpoints.down("sm")]: {
          gridTemplateColumns: "1fr",
        },
      }}
    >
      {infoBoxes.map(({ color, Icon, title, description }) => {
        return (
          <Stack
            key={color}
            px={4}
            py={2}
            spacing={1}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: "1rem",
              backgroundColor: color,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Icon fontSize="medium" />
              <Typography
                fontSize="1.4rem"
                fontWeight={theme.typography.fontWeightBold}
                gutterBottom
              >
                {title}
              </Typography>
            </Stack>

            <Typography variant="subtitle2">{description}</Typography>
          </Stack>
        );
      })}
    </Box>
  );
}
