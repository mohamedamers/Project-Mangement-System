import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { USERS_URL } from "../../../../Services/Api/ApisUrls";
import { http } from "../../../../Services/Api/httpInstance";
import validation from "../../../../Services/Validation";

import { useState } from "react";
import { useAuth } from "../../../../Context/AuthContext";
import type { AuthField } from "../../../../SharedComponents/Components/AuthForm/AuthForm";
import AuthForm from "../../../../SharedComponents/Components/AuthForm/AuthForm";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { saveLoginData } = useAuth()!;

  const fields: AuthField<LoginForm>[] = [
    {
      name: "email",
      label: "E-mail",
      type: "email",
      placeholder: "Enter your E-mail",
      rules: {
        required: validation.EMAIL_VALIDATION.required,
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your Password",
      rules: { required: "Password is required" },
    },
  ];

  function decodeJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(base64))));
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      const res = await http.post(USERS_URL.LOGIN, data);

      toast.success("Login successful ");
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      const decoded = decodeJwt(res.data.token);
      localStorage.setItem("userGroup", decoded.userGroup);
      console.log(res.data.token);
      saveLoginData();
      navigate("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        toast.error(serverMessage);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm<LoginForm>
      title="Login"
      fields={fields}
      onSubmit={onSubmit}
      loading={loading}
      submitLabel="Login"
      footer={
        <div className="d-flex justify-content-between mt-3 ">
          <Link
            to="/auth/createaccount"
            className="text-decoration-none text-white"
          >
            Register Now ?
          </Link>

          <Link
            to="/auth/forget-password"
            className="text-decoration-none text-white"
          >
            Forget password?
          </Link>
        </div>
      }
    />
  );
}
