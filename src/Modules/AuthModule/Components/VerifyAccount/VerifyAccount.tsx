import { useState } from "react";
import type { AuthField } from "../../../../SharedComponents/Components/AuthForm/AuthForm";
import AuthForm from "../../../../SharedComponents/Components/AuthForm/AuthForm";
import { http } from "../../../../Services/Api/httpInstance";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type VerifyAccountForm = {
  email: string;
  code: string; 
};

export default function ResetPassword() {
  const [loading] = useState(false);
  let navigate = useNavigate();
  const onSubmit =  async (data: VerifyAccountForm) => {
     try {
          let response = await http.put("https://upskilling-egypt.com:3003/api/v1/Users/verify",
            data
          );
          
          navigate("/auth/login");
          toast.success("Account verifyied successfully ", {
            position: "top-right",
            autoClose: 4000,
            theme: "light",
          });
        } catch (error) {
          toast.error(error.response.data.message);
        }
    console.log("VerifyAccount submit", data);
  };

  const fields: AuthField<VerifyAccountForm>[] = [
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
      name: "code",
      label: "OTP Code",
      type: "text",
      placeholder: "Enter OTP Code",
      rules: {
        required: "OTP code is required",
      },
    },
  ];

  return (
    <AuthForm<VerifyAccountForm>
      title="Verify Account"
      subtitle="Reset your account password"
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Save"
      loading={loading}
    />
  );
}
