import React, { useState } from "react";
import poster from "../../public/login.png";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        mobile: "",
        terms: false,
    });

    const [error, setError] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.username.trim()) newErrors.username = "Username is required";
        if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
        if (!formData.terms) newErrors.terms = "Please accept the terms";

        setError(newErrors);

        if (Object.keys(newErrors).length === 0) {
            localStorage.setItem("user", JSON.stringify(formData));
            toast.success("User created successfully");
            navigate("/genre");
        }
    };

    return (
        <div className="container">
            
            <div className="left-section">
                <img src={poster} alt="Background" />
                <h1>Discover new things on <br /> Superapp</h1>
            </div>

           
            <div className="right-section">
                <h1>Super App</h1>
                <h2>Create your new account</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ border: error.name ? "1px solid red" : "1px solid #72DB73" }}
                    />
                    {error.name && <p style={{ color: "red", fontSize: "0.8rem" }}>{error.name}</p>}

                    <input
                        type="text"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ border: error.email ? "1px solid red" : "1px solid #72DB73" }}
                    />
                    {error.email && <p style={{ color: "red", fontSize: "0.8rem" }}>{error.email}</p>}

                    <input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        style={{ border: error.username ? "1px solid red" : "1px solid #72DB73" }}
                    />
                    {error.username && <p style={{ color: "red", fontSize: "0.8rem" }}>{error.username}</p>}

                    <input
                        type="text"
                        placeholder="Mobile"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        style={{ border: error.mobile ? "1px solid red" : "1px solid #72DB73" }}
                    />
                    {error.mobile && <p style={{ color: "red", fontSize: "0.8rem" }}>{error.mobile}</p>}

                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={formData.terms}
                            onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                        />
                        <label>I agree to the <span>Terms of Service</span> and <span>Privacy Policy</span></label>
                    </div>
                    {error.terms && <p style={{ color: "red", fontSize: "0.8rem" }}>{error.terms}</p>}

                    <button type="submit">SIGN UP</button>

                    <p className="terms-text">
                        By clicking on Sign up, you agree to Superapp <span>Terms and Conditions of Use</span>
                    </p>
                    <p className="terms-text">
                        To learn more about how Superapp collects, uses, and protects your data, check our <span>Privacy Policy</span>.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
