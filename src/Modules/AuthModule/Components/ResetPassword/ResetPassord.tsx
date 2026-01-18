import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { USERS_URL } from "../../../../Services/Api/ApisUrls";
import { http } from "../../../../Services/Api/httpInstance";
import type { AuthField } from "../../../../SharedComponents/Components/AuthForm/AuthForm";
import AuthForm from "../../../../SharedComponents/Components/AuthForm/AuthForm";

type ResetPasswordForm = {
  email: string;
  seed: string;
  password: string;
  confirmPassword: string;
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fields: AuthField<ResetPasswordForm>[] = [
    {
      name: "email",
      label: "E-mail",
      type: "email",
      placeholder: "Enter your E-mail",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Please enter a valid email address",
        },
      },
    },
    {
      name: "seed",
      label: "OTP Code",
      type: "text",
      placeholder: "Enter OTP Code",
      rules: {
        required: "OTP code is required",
      },
    },
    {
      name: "password",
      label: "New Password",
      type: "password",
      placeholder: "Enter your New Password",
      rules: {
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      },
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "Confirm New Password",
      rules: {
        required: "Please confirm your password",
        validate: (value, formValues) =>
          value === formValues.password || "Passwords do not match",
      },
    },
  ];

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setLoading(true);

      // استخدام USERS_URL.RESET (الذي يشير إلى /Users/Reset)
      await http.post(USERS_URL.RESET, data);

      toast.success("Password reset successful ✅");

      // التوجه لصفحة تسجيل الدخول
      navigate("/auth/login");
    } catch (err) {
      let errorMessage = "Password reset failed ❌";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm<ResetPasswordForm>
      title="Reset Password"
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Reset Password"
      loading={loading}
    />
  );
}
