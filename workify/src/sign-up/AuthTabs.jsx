import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import "./AuthTabs.css";

const AuthTabs = () => {
    const [activeTab, setActiveTab] = useState("signup"); // "signup" or "login"

    return (
        <div className="auth-tabs">
            <div className="tab-header">
                <button
                className={activeTab === "signup" ? "tab active" : "tab"}
                onClick={() => setActiveTab("signup")}
                >
                    Sign Up
                </button>
                <button
                className={activeTab === "login" ? "tab active" : "tab"}
                onClick={() => setActiveTab("login")}
                >
                    Login
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "signup" ? <SignupForm /> : <LoginForm />}
            </div>
        </div>
    );
};

export default AuthTabs;
