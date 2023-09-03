"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Close from "@mui/icons-material/Close";
import * as yup from "yup";
import "yup-phone-lite";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import RentalAgreementPreview from "./Preview";

const STEP = {
  OWNER: "owner",
  TENANT: "tenant",
  PROPERTY: "property",
};

const SUFFIXES = ["Mr", "Ms", "Mrs"];

const personResolver = {
  suffix: yup.string().oneOf(SUFFIXES),
  name: yup.string().required("name is required"),
  phoneNumber: yup
    .string()
    .phone("IN", "Must be a valid phone number")
    .required("Phone number is required"),
  email: yup
    .string()
    .email("invalid email format")
    .trim()
    .required("Email is required"),
  pincode: yup.number().required("Pin code is required"),
  address: yup.string().required("address is required"),
  state: yup.string().required("state is required"),
  city: yup.string().required("city is required"),
};

const propertyResolver = {
  address: yup.string().required("Property address is required"),
  pincode: yup.number().required("Property Pin code is required"),
  state: yup.string().required("state is required"),
  city: yup.string().required("city is required"),
};

const StyledSelect = styled(Select)(({ theme, error }) => ({
  fontWeight: 500,
  fontSize: "0.8rem",
  "& fieldset": {
    borderColor: error ? "red" : theme.palette.grey[300],
  },
}));

export default function RentalAgreementCreator() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [currentStep, setCurrentStep] = useState(STEP.OWNER);
  const [owner, setOwner] = useState({});
  const [tenant, setTenant] = useState({});
  const [showAgreement, setShowAgreement] = useState(false);

  const togglePreviewAgreement = () => {
    setShowAgreement((prev) => !prev);
  };

  const isOwnerStep = currentStep === STEP.OWNER;
  const isTenantStep = currentStep === STEP.TENANT;
  const isPropertyStep = !isOwnerStep && !isTenantStep;

  const formValues = useForm({
    resolver: yupResolver(
      yup.object().shape(isPropertyStep ? propertyResolver : personResolver)
    ),
  });
  const { control, handleSubmit, reset } = formValues;

  const handleChange = (key, value, onChange) => (e) => {
    if (isOwnerStep) {
      setOwner((prev) => ({ ...prev, [key]: value }));
    } else if (isTenantStep) {
      setTenant((prev) => ({ ...prev, [key]: value }));
    }
    onChange(e.target.value);
  };

  const handleChangeToNextStep = (data) => {
    if (isOwnerStep) {
      setCurrentStep(STEP.TENANT);
      reset();
    } else if (isTenantStep) {
      setCurrentStep(STEP.PROPERTY);
      reset();
    } else {
      // Todo
    }
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="center"
      alignItems="center"
      spacing={4}
    >
      <Stack
        p={{ xs: 2, md: 4 }}
        spacing={2}
        sx={{ width: { xs: "100%", md: "50%" } }}
      >
        <Typography fontSize="1.2rem" gutterBottom>
          Step {isOwnerStep ? 1 : isTenantStep ? 2 : 3}: Enter{" "}
          {isOwnerStep ? "Owner" : isTenantStep ? "Tenant" : "Property"} details
        </Typography>
        {!isPropertyStep && (
          <Stack spacing={4}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Controller
                name="suffix"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <StyledSelect
                    displayEmpty
                    renderValue={(selected) => selected}
                    value={value ?? SUFFIXES[0]}
                    onChange={handleChange("suffix", value, onChange)}
                    error={!!error?.message}
                    sx={{ maxWidth: "100px" }}
                  >
                    {SUFFIXES.map((city) => {
                      return (
                        <MenuItem
                          key={city}
                          value={city}
                          style={{ fontWeight: 500, fontSize: "0.8rem" }}
                        >
                          {city}
                        </MenuItem>
                      );
                    })}
                  </StyledSelect>
                )}
              />

              <Controller
                name="name"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder={`Enter name of the ${
                      isOwnerStep ? "Owner" : "Tenant"
                    }`}
                    value={value ?? ""}
                    onChange={handleChange("name", value, onChange)}
                    error={!!error?.message}
                    helperText={error?.message ?? ""}
                  />
                )}
              />
            </Stack>

            <Controller
              name="phoneNumber"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Mobile Number"
                  type="text"
                  value={value ?? ""}
                  onChange={handleChange("phoneNumber", value, onChange)}
                  error={!!error?.message}
                  helperText={error?.message ?? ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography fontSize={"1.2rem"}>+91</Typography>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  placeholder={`Enter email id of the ${
                    isOwnerStep ? "Owner" : "Tenant"
                  }`}
                  value={value ?? ""}
                  onChange={handleChange("email", value, onChange)}
                  error={!!error?.message}
                  helperText={error?.message ?? ""}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  placeholder={`Enter permanent address of the ${
                    isOwnerStep ? "Owner" : "Tenant"
                  }`}
                  value={value ?? ""}
                  onChange={handleChange("address", value, onChange)}
                  error={!!error?.message}
                  helperText={error?.message ?? ""}
                />
              )}
            />

            <Controller
              name="pincode"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  placeholder="Enter Pin code"
                  value={value ?? ""}
                  onChange={handleChange("pincode", value, onChange)}
                  error={!!error?.message}
                  helperText={error?.message ?? ""}
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  placeholder={`Enter city of the ${
                    isOwnerStep ? "Owner" : "Tenant"
                  }`}
                  value={value ?? ""}
                  onChange={handleChange("city", value, onChange)}
                  error={!!error?.message}
                  helperText={error?.message ?? ""}
                />
              )}
            />

            <Controller
              name="state"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  placeholder={`Enter state of the ${
                    isOwnerStep ? "Owner" : "Tenant"
                  }`}
                  value={value ?? ""}
                  onChange={handleChange("state", value, onChange)}
                  error={!!error?.message}
                  helperText={error?.message ?? ""}
                />
              )}
            />
          </Stack>
        )}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          spacing={2}
        >
          <Button
            variant="contained"
            color="info"
            onClick={handleSubmit(handleChangeToNextStep)}
            endIcon={<ArrowForward />}
          >
            {isPropertyStep
              ? "Submit"
              : `Next Step: Enter ${
                  isOwnerStep ? "Tenant" : isTenantStep ? "Property" : ""
                } Details`}
          </Button>
          {isMobile && (
            <Button
              variant="contained"
              color="info"
              onClick={togglePreviewAgreement}
            >
              Preview Agreement
            </Button>
          )}
        </Stack>
      </Stack>

      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <RentalAgreementPreview owner={owner} tenant={tenant} />
      </Box>

      <Dialog
        fullScreen={isMobile}
        open={showAgreement}
        onClose={togglePreviewAgreement}
      >
        <DialogContent sx={{ padding: "20px 0 20px 0" }}>
          <IconButton
            onClick={togglePreviewAgreement}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              width: "1.2em",
              height: "1.2em",
              zIndex: 10,
              backgroundColor: "#00000020",
            }}
          >
            <Close />
          </IconButton>

          <RentalAgreementPreview owner={owner} tenant={tenant} />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
