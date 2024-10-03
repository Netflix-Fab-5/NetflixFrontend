import React from "react";

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  error,
}) => {
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmit}>
        <div className="form-group floating-label">
          <input
            type="email"
            id="email"
            value={email}
            onChange={onEmailChange}
            required
            autoComplete="email"
            placeholder=" "
          />
          <label htmlFor="email">Email address</label>
        </div>

        <div className="form-group floating-label">
          <input
            type="password"
            id="password"
            value={password}
            onChange={onPasswordChange}
            required
            autoComplete="current-password"
            placeholder=" "
          />
          <label htmlFor="password">Password</label>
        </div>

        <button type="submit" className="btn-submit">
          Login
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
