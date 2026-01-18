import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { USERS_URL } from "../../../../Services/Api/ApisUrls";
import { http } from "../../../../Services/Api/httpInstance";
import validation from "../../../../Services/Validation";
import type { AuthField } from "../../../../SharedComponents/Components/AuthForm/AuthForm";
import AuthForm from "../../../../SharedComponents/Components/AuthForm/AuthForm";

// تعديل النوع ليقبل الإيميل فقط لأنها مرحلة الطلب
type ForgetPasswordForm = {
  email: string;
};

export default function ForgetPassword() {
  const navigate = useNavigate();

  const fields: AuthField<ForgetPasswordForm>[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your E-mail",
      rules: { required: validation.EMAIL_VALIDATION.required },
    },
  ];

  const onSubmit = async (data: ForgetPasswordForm) => {
    try {
      // استخدام RESET_REQUEST بناءً على ملف الـ URLs الخاص بك
      const res = await http.post(USERS_URL.RESET_REQUEST, data);

      toast.success(res.data?.message || "OTP sent to your email ✅");

      navigate("/auth/reset-password");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Failed to send request ❌"
        : "Something went wrong ❌";

      toast.error(msg);
      console.log(err);
    }
  };

  return (
    <AuthForm<ForgetPasswordForm>
      title="Forget Password"
      fields={fields}
      onSubmit={onSubmit}
      submitLabel="Verify" 
    />
  );
}
