import { http } from "../../../../Services/Api/httpInstance";
import AuthForm from "../../../../SharedComponents/Components/AuthForm/AuthForm";
import type { AuthField } from "../../../../SharedComponents/Components/AuthForm/AuthForm";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import validation, {
  getRequiredMessage,
} from "../../../../Services/Validation";

import { USERS_URL } from "../../../../Services/Api/ApisUrls";
import { useForm } from "react-hook-form";

type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
export default function ChangePassword() {
  let navigate = useNavigate();
  const form = useForm<ChangePasswordForm>();
  const { getValues } = form;

  const fields: AuthField<ChangePasswordForm>[] = [
    {
      name: "oldPassword",
      label: "Old Password",
      type: "password",
      placeholder: "Enter old password",
      rules: validation.PASSWORD_VALIDATION(getRequiredMessage("oldPassword")),
    },
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "Enter new password",
      rules: validation.PASSWORD_VALIDATION(getRequiredMessage("newPassword")),
    },
    {
      name: "confirmNewPassword",
      label: "Confirm New Password",
      type: "password",
      placeholder: "Confirm new password",
      rules: validation.CONFIRM_PASSWORD_VALIDATION(getValues),
    },
  ];
  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      const res = await http.put(USERS_URL.CHANGE_PASSWORD, data);

      toast.success("ChangePassword successful ✅");
      console.log(res.data);
      navigate("/auth/login");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Login failed ❌"
        : "Something went wrong ❌";

      toast.error(msg);
      console.log(err);
    }
  };
  return (
    <div className="con mt-5 bg-dark w-50 rounded-3 m-auto ">
      <AuthForm<ChangePasswordForm>
        title="Change Password"
        fields={fields}
        onSubmit={onSubmit}
        submitLabel="Change"
      />
    </div>
  );
}
