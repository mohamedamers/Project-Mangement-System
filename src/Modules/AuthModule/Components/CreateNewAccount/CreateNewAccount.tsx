import { useState } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { InputGroup } from "react-bootstrap";

import Form from "react-bootstrap/Form";
import { http } from "../../../../Services/Api/httpInstance";

import { useNavigate } from "react-router-dom";

import { USERS_URL } from "../../../../Services/Api/ApisUrls";

export default function CreateNewAccount() {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setProfileImage(acceptedFiles[0]);
    }
  };

  let navigate = useNavigate();

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();

      // append form fields
      formData.append("userName", data.userName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("country", data.country);

      // append image
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      await http.post(USERS_URL.REGISTER, formData);

      toast.success("Account created successfully", { theme: "colored" });
      navigate("/auth/verify-account");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message, { theme: "colored" });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmPassword] = useState(false);

  <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
    {({ getRootProps, getInputProps }) => (
      <section>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </section>
    )}
  </Dropzone>;

  return (
    <div className="auth-container">
      <div className="container-fluid z-3">
        <div className="row justify-content-center align-items-center">
          <div className="bgtransparentCreate rounded-3 ">
            <div className="form-container">
              <div className="title-container">
                <p className="text-white mb-1">welcome to PMS</p>
                <h4 className="primary-color">Create New Account</h4>
              </div>

              <Dropzone onDrop={onDrop} accept={{ "image/*": [] }} maxFiles={1}>
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps()}
                    style={{
                      width: "110px",
                      height: "110px",
                      borderRadius: "50%",
                      border: "3px dashed #9ef0c1",
                      cursor: "pointer",
                      margin: "0 auto 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <input {...getInputProps()} />

                    {profileImage ? (
                      <img
                        src={URL.createObjectURL(profileImage)}
                        alt="profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="text-center text-white"
                        style={{ fontSize: "12px" }}
                      >
                        <i
                          className="fa fa-camera mb-2"
                          style={{ fontSize: "24px" }}
                        ></i>
                        <div>Upload</div>
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="auth-field">
                      <label className="auth-label" htmlFor="email">
                        User Name
                      </label>

                      <Form.Control
                        id="userName"
                        type="text"
                        className="auth-input"
                        placeholder="Enter your name"
                        {...register("userName", {
                          required: "Name is required",
                        })}
                      />

                      {errors.userName && (
                        <div className="alert alert-danger mt-2 p-2">
                          {errors.userName.message?.toString()}
                        </div>
                      )}
                    </div>
                    <div className="auth-field">
                      <label className="auth-label" htmlFor="email">
                        Country
                      </label>

                      <Form.Control
                        id="country "
                        type="text"
                        className="auth-input"
                        placeholder="Enter your Country "
                        {...register("country", {
                          required: "Country  is required",
                        })}
                      />

                      {errors.country && (
                        <div className="alert alert-danger mt-2 p-2">
                          {errors.country.message?.toString()}
                        </div>
                      )}
                    </div>
                    <div className="auth-field">
                      <label className="auth-label" htmlFor="email">
                        Password
                      </label>

                      <InputGroup className="auth-inputgroup">
                        <Form.Control
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="auth-input"
                          placeholder="Enter your Password"
                          {...register("password", {
                            required: "Password is required",
                          })}
                        />

                        <InputGroup.Text
                          as="button"
                          type="button"
                          className="auth-eye-btn"
                          onClick={() => setShowPassword((s) => !s)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          <i
                            className={`fa-solid ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                          />
                        </InputGroup.Text>
                      </InputGroup>

                      {errors.password && (
                        <div className="alert alert-danger mt-2 p-2">
                          {errors.password.message?.toString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="auth-field">
                      <label className="auth-label" htmlFor="email">
                        Email
                      </label>

                      <Form.Control
                        id="email"
                        type="text"
                        className="auth-input"
                        placeholder="Enter your E-mail"
                        {...register("email", {
                          required: "E-mail is required",
                        })}
                      />

                      {errors.email && (
                        <div className="alert alert-danger mt-2 p-2">
                          {errors.email.message?.toString()}
                        </div>
                      )}
                    </div>
                    <div className="auth-field">
                      <label className="auth-label" htmlFor="email">
                        Phone Number
                      </label>

                      <Form.Control
                        id="phoneNumber"
                        type="text"
                        className="auth-input"
                        placeholder="Enter your Phone Number "
                        {...register("phoneNumber", {
                          required: "Phone Number  is required",
                        })}
                      />

                      {errors.phoneNumber && (
                        <div className="alert alert-danger mt-2 p-2">
                          {errors.phoneNumber.message?.toString()}
                        </div>
                      )}
                    </div>
                    <div className="auth-field">
                      <label className="auth-label" htmlFor="email">
                        Confirm Password
                      </label>

                      <InputGroup className="auth-inputgroup">
                        <Form.Control
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className="auth-input"
                          placeholder="Enter your Password"
                          {...register("confirmPassword", {
                            required: "Confirm Password  is required",
                            validate: (value) =>
                              value === watch("password") ||
                              "Passwords do not match",
                          })}
                        />

                        <InputGroup.Text
                          as="button"
                          type="button"
                          className="auth-eye-btn"
                          onClick={() => setConfirmPassword((s) => !s)}
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          <i
                            className={`fa-solid ${
                              showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                            }`}
                          />
                        </InputGroup.Text>
                      </InputGroup>

                      {errors.confirmPassword && (
                        <div className="alert alert-danger mt-2 p-2">
                          {errors.confirmPassword.message?.toString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn primary-color-bg w-50 mt-4 rounded-5 d-block mx-auto"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
