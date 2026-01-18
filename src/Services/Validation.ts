export const getRequiredMessage = (fieldName: string) =>
  `${fieldName} is required`;

const validation = {
  USERNAME_VALIDATION: {
    required: "User Name Is Required",
    minLength: {
      value: 4,
      message: "Minimum 4 characters",
    },
    maxLength: {
      value: 8,
      message: "Maximum 8 characters",
    },
    pattern: {
      value: /^[A-Za-z]+[A-Za-z0-9]*\d$/,
      message: "Must end with numbers without spaces",
    },
  },
  EMAIL_VALIDATION: {
    required: "Email is required",
    pattern: {
      value: /\S+@\S{3,}\.\S{2,}/,
      message: "Enter a valid email",
    },
  },
  PASSWORD_VALIDATION: (required: string) => ({
    required,
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
    validate: {
      hasUppercase: (value: string) =>
        /[A-Z]/.test(value) ||
        "Password must contain at least one uppercase letter",
      hasLowercase: (value: string) =>
        /[a-z]/.test(value) ||
        "Password must contain at least one lowercase letter",
      hasNumber: (value: string) =>
        /\d/.test(value) || "Password must contain at least one number",
      hasSpecialChar: (value: string) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
        "Password must contain at least one special character",
    },
  }),
  CONFIRM_PASSWORD_VALIDATION: (
    getValues: (value: string) => string,
    // newPassword: string
  ) => ({
    required: "Confirm Password is required",
     validate: (value: string) =>
    value === getValues("newPassword") || "Passwords do not match",
  }),

  OTP_VALIDATION: {
    required: "Verification code is required",
    minLength: {
      value: 6,
      message: "OTP must be exactly 6 digits",
    },
    maxLength: {
      value: 6,
      message: "OTP must be exactly 6 digits",
    },
    pattern: {
      value: /^[0-9]+$/,
      message: "OTP must be numbers only",
    },
  },
};

export default validation;
