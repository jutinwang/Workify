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

    const onSubmit = async (e) => {
        e.preventDefault();

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
            <form className="login-form" onSubmit={onSubmit} noValidate>
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
