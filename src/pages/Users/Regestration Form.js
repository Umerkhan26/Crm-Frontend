import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Row, Col, Card, CardBody, Button, Label, Container } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser, updateUserById } from "../../services/auth";
import { ClipLoader } from "react-spinners";
import { getAllRoles } from "../../services/roleService";
import VendorForm from "./Registration/VenderForm";

const RegisterUser = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state?.user || null;

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [selectedSubVendors, setSelectedSubVendors] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: user ? "" : "", // Initialize password only for new users
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

  // Static userrole options based on backend ENUM
  const userRoleOptions = [
    { value: null, label: "Select User Role" },
    { value: "vendor", label: "Vendor" },
    { value: "client", label: "Client" },
    { value: "admin", label: "Admin" },
  ];

  useEffect(() => {
    const loadRoles = async () => {
      setLoading(true);
      try {
        const response = await getAllRoles({ page: 1, limit: 100, search: "" });
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
            phone: user.user.phone || "",
            address: user.user.address || "",
            website: user.user.website || "",
            coverage: user.user.coverage || "",
            linkedin: user.user.linkedin || "",
            userImage: user.user.userImage || null,
            referred_to: user.user.referred_to || "",
            smtpemail: user.user.smtpemail || "",
            smtppassword: user.user.smtppassword || "",
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

          const userRoleOption = userRoleOptions.find(
            (option) => option.value === user.user.userrole?.toLowerCase()
          );
          if (userRoleOption) {
            setSelectedUserRole(userRoleOption);
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

  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: files ? files[0] : value,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRoleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
  };

  const handleUserRoleChange = (selectedOption) => {
    setSelectedUserRole(selectedOption);
  };

  const handleSubVendorChange = (selectedOptions) => {
    setSelectedSubVendors(selectedOptions || []);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      roleId: selectedRole?.value,
      roleName: selectedRole?.label,
      // userrole: selectedUserRole?.value || "",
      userrole: selectedUserRole?.value || null,
    };

    // Remove password from payload when updating
    if (user) {
      delete payload.password;
    }

    // if (selectedUserRole?.value) {
    //   payload.userrole = selectedUserRole.value;
    // }

    const formPayload = new FormData();

    // // Append all fields EXCEPT userImage first
    // for (const key in payload) {
    //   if (
    //     key !== "userImage" &&
    //     payload[key] !== null &&
    //     payload[key] !== undefined
    //   ) {
    //     formPayload.append(key, payload[key]);
    //   }
    // }

    for (const key in payload) {
      if (
        key !== "userImage" &&
        key !== "userrole" &&
        payload[key] !== null &&
        payload[key] !== undefined
      ) {
        formPayload.append(key, payload[key]);
      }
    }

    if (payload.userrole) {
      formPayload.append("userrole", payload.userrole);
    }
    // ONLY append userImage if it's a File (new image selected)
    if (formData.userImage instanceof File) {
      formPayload.append(
        "userImage",
        formData.userImage,
        formData.userImage.name
      );
    }
    // If userImage is explicitly set to null (remove image)
    else if (formData.userImage === null) {
      formPayload.append("userImage", "null");
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

      navigate("/allUsers");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Failed to ${user ? "update" : "register"} user: ${error.message}`
      );
    } finally {
      setLoading(false);
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
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#495057",
      padding: "8px",
    }),
    option: (provided, state) => ({
      ...provided,
      color: "#495057",
      backgroundColor: state.isSelected ? "#a6ace6" : "white",
      "&:hover": {
        backgroundColor: "#5664d2",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#495057",
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
                      {!user && (
                        <Col md="6">
                          <div className="mb-3">
                            <Label className="form-label">
                              Password <span className="text-danger">*</span>
                            </Label>
                            <input
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Password"
                              type="password"
                              className="form-control"
                              required
                            />
                          </div>
                        </Col>
                      )}
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
                              {formData.userImage instanceof File
                                ? formData.userImage.name
                                : "Choose file"}
                            </Label>
                          </div>

                          {/* Show current image if it exists and no new file is selected */}
                          {user?.user.userImage &&
                            !(formData.userImage instanceof File) && (
                              <div className="mt-2">
                                <p className="mb-2">Current image:</p>
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
                                <Button
                                  color="danger"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      userImage: null,
                                    }))
                                  }
                                  disabled={formData.userImage === null}
                                >
                                  Remove Image
                                </Button>
                              </div>
                            )}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">
                            Role <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="role"
                            options={roleOptions}
                            value={selectedRole}
                            onChange={handleRoleChange}
                            className="basic-single"
                            classNamePrefix="select"
                            styles={customStyles}
                            required
                            isClearable
                          />
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <Label className="form-label">
                            User Role <span className="text-danger">*</span>
                          </Label>
                          <Select
                            name="userrole"
                            options={userRoleOptions}
                            value={selectedUserRole}
                            onChange={handleUserRoleChange}
                            className="basic-single"
                            classNamePrefix="select"
                            isClearable
                            styles={customStyles}
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
