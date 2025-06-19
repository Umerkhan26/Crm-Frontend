import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Row, Col, Card, CardBody, Button, Label, Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import VendorForm from "./Registration/VenderForm";
import ClientForm from "./Registration/ClientForm";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser, updateUserById } from "../../services/auth";
import { ClipLoader } from "react-spinners";
import { getAllRoles } from "../../services/roleService";

const RegisterUser = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state?.user || null;

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSubVendors, setSelectedSubVendors] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(false); // Unified loading state
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    website: "",
    coverage: "",
    linkedin: "",
    userImage: null,
    referred_to: "",
    smtpemail: "",
    smtppassword: "",
    smtpincomingserver: "",
    smtpoutgoingserver: "",
    smtpport: "",
    branchname: "",
    branchcountry: "",
    branchaddress: "",
    brancheader: "#ffffff",
    branchnavbar: "#000000",
    branchnavtext: "#ffffff",
    branchnavhover: "#000000",
    branchlogo: null,
    branchlogoheight: "",
    branchlogowidth: "",
    branchslug: "",
    adminNote: "",
  });

  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true);
      try {
        const response = await getAllRoles();
        console.log("ALL ROLES", response);
        const roles = Array.isArray(response.data) ? response.data : [];
        const options = roles.map((role) => ({
          value: role.id,
          label: role.name,
        }));
        options.unshift({ value: "", label: "Select Role" });
        setRoleOptions(options);

        if (user) {
          setFormData((prev) => ({
            ...prev,
            firstname: user.user.firstname || "",
            lastname: user.user.lastname || "",
            email: user.user.email || "",
            password: "", // Do not prefill for security
            phone: user.user.phone || "",
            address: user.user.address || "",
            website: user.user.website || "",
            coverage: user.user.coverage || "",
            linkedin: user.user.linkedin || "",
            userImage: null,
            referred_to: user.user.referred_to || "",
            smtpemail: user.user.smtpemail || "",
            smtppassword: "",
            smtpincomingserver: user.user.smtpincomingserver || "",
            smtpoutgoingserver: user.user.smtpoutgoingserver || "",
            smtpport: user.user.smtpport || "",
            branchname: user.user.branchname || "",
            branchcountry: user.user.branchcountry || "",
            branchaddress: user.user.branchaddress || "",
            brancheader: user.user.brancheader || "#ffffff",
            branchnavbar: user.user.branchnavbar || "#000000",
            branchnavtext: user.user.branchnavtext || "#ffffff",
            branchnavhover: user.user.branchnavhover || "#000000",
            branchlogo: null,
            branchlogoheight: user.user.branchlogoheight || "",
            branchlogowidth: user.user.branchlogowidth || "",
            branchslug: user.user.branchslug || "",
            adminNote: user.user.adminNote || "",
          }));

          const userRole = roles.find(
            (role) =>
              role.id === user.user.roleId ||
              role.name.toLowerCase() === user.user.userrole?.toLowerCase()
          );
          if (userRole) {
            setSelectedRole({ value: userRole.id, label: userRole.name });
          }
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, [user]);

  const subVendorOptions = [
    { value: "subVendor1", label: "subVendor1" },
    { value: "subVendor2", label: "subVendor2" },
  ];

  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
  };

  const handleSubVendorChange = (selectedOptions) => {
    setSelectedSubVendors(selectedOptions || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loader

    const payload = {
      ...formData,
      roleId: selectedRole?.value,
      roleName: selectedRole?.label,
    };

    const formPayload = new FormData();
    for (const key in payload) {
      if (key === "userImage" && payload[key] instanceof File) {
        formPayload.append(key, payload[key], payload[key].name);
      } else if (payload[key] !== null && payload[key] !== undefined) {
        formPayload.append(key, payload[key]);
      }
    }

    // Debug: Log FormData entries
    for (let [key, value] of formPayload.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const token = localStorage.getItem("token");
      let result;

      if (user) {
        result = await updateUserById(user.user.id, formPayload, token);
        toast.success("User updated successfully!");
      } else {
        result = await registerUser(formPayload);
        toast.success("User registered successfully!");
      }

      console.log("Server response:", result);
      navigate("/allUsers");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Failed to ${user ? "update" : "register"} user: ${error.message}`
      );
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "42px",
      border: "1px solid #ced4da",
      "&:hover": {
        borderColor: "#ced4da",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e9ecef",
      borderRadius: "4px",
      padding: "2px 8px",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#495057",
      fontWeight: "normal",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#6c757d",
      ":hover": {
        backgroundColor: "transparent",
        color: "#dc3545",
      },
    }),
  };

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumbs
          title={user ? "Update User" : "User Registration"}
          breadcrumbItems={[
            { title: "Dashboard", link: "#" },
            { title: "Users", link: "#" },
            { title: user ? "Update User" : "User Registration", link: "#" },
          ]}
        />
        <Row>
          <Col xl="12">
            <Card>
              <CardBody>
                {loading ? (
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "200px" }}
                  >
                    <ClipLoader
                      color="#5664d2"
                      size={40}
                      loading={loading}
                      aria-label="Loading Spinner"
                    />
                  </div>
                ) : (
                  <form className="needs-validation" onSubmit={handleSubmit}>
                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">
                            First Name <span className="text-danger">*</span>
                          </Label>
                          <input
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            placeholder="First name"
                            type="text"
                            className="form-control"
                            required
                          />
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">
                            Last Name <span className="text-danger">*</span>
                          </Label>
                          <input
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            placeholder="Last name"
                            type="text"
                            className="form-control"
                            required
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Email</Label>
                          <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            type="email"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Password</Label>
                          <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            type="password"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Phone</Label>
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            type="tel"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Address</Label>
                          <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Website</Label>
                          <input
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="Website"
                            type="url"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Coverage Area</Label>
                          <input
                            name="coverage"
                            value={formData.coverage}
                            onChange={handleChange}
                            placeholder="Coverage Area"
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">LinkedIn Profile</Label>
                          <input
                            name="linkedin"
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="LinkedIn Profile"
                            type="url"
                            className="form-control"
                          />
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Display Picture</Label>
                          <div className="custom-file">
                            <input
                              type="file"
                              name="userImage"
                              onChange={handleChange}
                              className="custom-file-input rounded"
                              style={{
                                border: "1px solid #ced4da",
                                padding: "0.375rem 0.75rem",
                                width: "100%",
                              }}
                              id="displayPicture"
                              accept="image/*"
                            />
                            <Label
                              className="custom-file-label"
                              htmlFor="displayPicture"
                            >
                              {formData.userImage?.name || "Choose file"}{" "}
                              {/* Fixed typo */}
                            </Label>
                          </div>
                          {user?.user.userImage && !formData.userImage && (
                            <div>
                              <p className="mb-2 ">Current image:</p>
                              <div
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "50%",
                                  overflow: "hidden",
                                  border: "2px solid #dee2e6",
                                }}
                              >
                                <img
                                  src={user.user.userImage}
                                  alt="Current profile"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "top",
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">Role</Label>
                          <Select
                            name="role"
                            options={roleOptions}
                            value={selectedRole}
                            onChange={handleRoleChange}
                            className="basic-single"
                            classNamePrefix="select"
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                minHeight: "38px",
                                border: "1px solid #ced4da",
                                "&:hover": {
                                  borderColor: "#ced4da",
                                },
                              }),
                              dropdownIndicator: (provided) => ({
                                ...provided,
                                color: "#495057",
                                padding: "8px",
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                color: "#495057",
                                backgroundColor: state.isSelected
                                  ? "#a6ace6"
                                  : "white",
                                "&:hover": {
                                  backgroundColor: "#5664d2",
                                },
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                color: "#495057",
                              }),
                            }}
                          />
                        </div>
                      </Col>
                    </Row>

                    <VendorForm
                      formData={formData}
                      handleChange={handleChange}
                      selectedSubVendors={selectedSubVendors}
                      handleSubVendorChange={handleSubVendorChange}
                      subVendoptions={subVendorOptions}
                      customStyles={customStyles}
                    />
                    {/* <ClientForm
                      selectedSubVendors={selectedSubVendors}
                      handleSubVendorChange={handleSubVendorChange}
                      subVendoptions={subVendorOptions}
                      customStyles={customStyles}
                    /> */}

                    <div className="mt-3 d-flex">
                      <Button
                        color="primary"
                        type="submit"
                        className="w-100"
                        style={{ maxWidth: "150px" }}
                        disabled={loading}
                      >
                        {loading ? (
                          <ClipLoader
                            color="#fff"
                            size={20}
                            loading={loading}
                            aria-label="Loading Spinner"
                          />
                        ) : user ? (
                          "Update"
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterUser;
