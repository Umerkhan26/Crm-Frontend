import React, { useState } from "react";
import { Row, Col, Input, Button, Container, Label, Spinner } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../../services/auth";
import { loginUserSuccessful } from "../../store/actions";
import { useDispatch } from "react-redux";

function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  React.useEffect(() => {
    document.body.classList.add("auth-body-bg");
    return () => {
      document.body.classList.remove("auth-body-bg");
    };
  }, []);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Handle null role case
      const userData = {
        ...data.user,
        role: data.user.role || {
          id: 0,
          name: "admin",
          Permissions: [
            // Default admin permissions
            { name: "user:create" },
            { name: "user:get" },
            { name: "user:update" },
            { name: "user:delete" },
            { name: "user:updateStatus" },
            // Add all other admin permissions here
          ],
        },
      };

      // Dispatch login success action
      dispatch(
        loginUserSuccessful({
          user: userData,
          token: data.token,
        })
      );

      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("authUser", JSON.stringify(userData));
      localStorage.setItem("userId", userData.id);
      localStorage.setItem(
        "permissions",
        JSON.stringify(userData.role.Permissions)
      );

      toast.success("Login successful!");
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div>
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4}>
              <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                <div className="w-100">
                  <Row className="justify-content-center">
                    <Col lg={9}>
                      <div>
                        <div className="text-center">
                          <h4 className="font-size-18 mt-4">Welcome Back!</h4>
                          <p className="text-muted">
                            Sign in to continue to Eraxon.
                          </p>
                        </div>

                        <div className="p-2 mt-5">
                          <form
                            className="form-horizontal"
                            onSubmit={handleSubmit(onSubmit)}
                          >
                            {/* Email Field */}
                            <div className="auth-form-group-custom mb-4">
                              <i className="ri-user-2-line auti-custom-input-icon"></i>
                              <Label htmlFor="email">Email</Label>
                              <Controller
                                name="email"
                                control={control}
                                rules={{ required: "Email is required" }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="text"
                                    className={`form-control ${
                                      errors.email ? "is-invalid" : ""
                                    }`}
                                    id="email"
                                    placeholder="Enter email"
                                    disabled={isLoading}
                                  />
                                )}
                              />
                              {errors.email && (
                                <div className="invalid-feedback">
                                  {errors.email.message}
                                </div>
                              )}
                            </div>

                            {/* Password Field */}
                            <div className="auth-form-group-custom mb-4">
                              <i className="ri-lock-2-line auti-custom-input-icon"></i>
                              <Label htmlFor="password">Password</Label>
                              <Controller
                                name="password"
                                control={control}
                                rules={{ required: "Password is required" }}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type="password"
                                    className={`form-control ${
                                      errors.password ? "is-invalid" : ""
                                    }`}
                                    id="password"
                                    placeholder="Enter password"
                                    disabled={isLoading}
                                  />
                                )}
                              />
                              {errors.password && (
                                <div className="invalid-feedback">
                                  {errors.password.message}
                                </div>
                              )}
                            </div>

                            {/* Remember me Checkbox */}
                            <div className="form-check">
                              <Input
                                type="checkbox"
                                className="form-check-input"
                                id="customControlInline"
                                disabled={isLoading}
                              />
                              <Label
                                className="form-check-label"
                                htmlFor="customControlInline"
                              >
                                Remember me
                              </Label>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-4 text-center">
                              <Button
                                color="primary"
                                className="w-md waves-effect waves-light"
                                type="submit"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <>
                                    <Spinner size="sm" className="me-2" />
                                    Logging in...
                                  </>
                                ) : (
                                  "Log In"
                                )}
                              </Button>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="mt-4 text-center">
                              <Link
                                to="/forgot-password"
                                className="text-muted"
                              >
                                <i className="mdi mdi-lock me-1"></i> Forgot
                                your password?
                              </Link>
                            </div>
                          </form>
                        </div>

                        {/* Register Link */}
                        <div className="mt-5 text-center">
                          <p>
                            © 2025 Eraxon.{" "}
                            <i className="mdi mdi-heart text-danger"></i>
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col lg={8}>
              <div className="authentication-bg">
                <div className="bg-overlay"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
}

export default Login;
