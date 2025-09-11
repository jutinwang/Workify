import { useMemo, useState } from "react";
import './LoginForm.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    // const validate = () => {
    //     const e = {};
    //     if (!form.fullName.trim()) e.fullName = "Name required.";
    //     if (!emailRegex.test(form.email)) e.email = "Enter a valid email.";
    //     if (form.password.length < 8) e.password = "Min 8 characters.";
    //     if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    //     if (!form.agree) e.agree = "You must accept the terms.";
    //     return e;
    // };

    const onSubmit = async (e) => {
        e.preventDefault();
        // const v = validate();
        // setErrors(v);
        // if (Object.keys(v).length) return;

        setSubmitting(true);
        try {
            console.log("Submitting:", form);
            alert("Logged in! (replace with API call)");
        } catch (err) {
            alert("Login failed: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="form">
            <h1>Login to your account</h1>
            <form className="login-form" onSubmit={onSubmit} noValidate>
                <p><strong>Email</strong></p>
                <div className="field">
                    <label htmlFor="email" />
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <p><strong>Password</strong></p>
                <div className="field">
                    <label htmlFor="password" />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                    />
                        {/* <p className="pw-strength">Strength: {pwStrength}/5</p>
                    {errors.password && <p className="error">{errors.password}</p>} */}
                </div>

                <div className="login-button-container">
                    <button className="submitButton" type="submit" disabled={submitting}>
                        {submitting ? "Loging up..." : "Login"}
                    </button>
                </div>
                
            </form>
         </div>
    );
};

export default LoginForm;
