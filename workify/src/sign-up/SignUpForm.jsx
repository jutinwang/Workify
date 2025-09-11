import { useMemo, useState } from "react";
import './SignUpForm.css';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordScore = (pwd) => {
    let score = 0;
    if (!pwd) return 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 5);
};

const SignupForm = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirm: "",
        agree: false,
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const pwStrength = useMemo(() => passwordScore(form.password), [form.password]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Name required.";
        if (!emailRegex.test(form.email)) e.email = "Enter a valid email.";
        if (form.password.length < 8) e.password = "Min 8 characters.";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
        if (!form.agree) e.agree = "You must accept the terms.";
        return e;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length) return;

        setSubmitting(true);
        try {
            console.log("Submitting:", form);
            alert("Signed up! (replace with API call)");
        } catch (err) {
            alert("Signup failed: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="signup-form" onSubmit={onSubmit} noValidate>
            <div className="field">
                <label htmlFor="fullName" />
                <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Full Name"
                />
                {errors.fullName && <p className="error">{errors.fullName}</p>}
            </div>

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

            <div className="field">
                <label htmlFor="confirm" />
                <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                />
                {errors.confirm && <p className="error">{errors.confirm}</p>}
            </div>

            <div className="field checkbox">
                <label>
                <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={handleChange}
                />
                    I agree to the Terms & Privacy Policy
                </label>
                {errors.agree && <p className="error">{errors.agree}</p>}
            </div>

            <div className="submit-button-container">
                <button type="submit" disabled={submitting}>
                    {submitting ? "Signing up..." : "Sign Up"}
                </button>
            </div>
            
        </form>
    );
};

export default SignupForm;
