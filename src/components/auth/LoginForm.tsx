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
    <div className="max-w-[400px] mx-auto p-5 bg-black rounded-lg shadow-md">
      <form className="flex flex-col" onSubmit={onSubmit}>
        <div className="relative mb-5">
          <input
            type="email"
            id="email"
            value={email}
            onChange={onEmailChange}
            required
            autoComplete="email"
            placeholder=" "
            className="peer w-full p-2 border border-green-600 rounded-md bg-transparent text-white focus:outline-none focus:border-green-400"
          />
          <label
            htmlFor="email"
            className="absolute left-2 top-2 text-gray-500 text-lg bg-black px-1 transition-all 
            peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500
            peer-focus:top-[-10px] peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-400
            peer-valid:top-[-10px] peer-valid:left-2 peer-valid:text-sm peer-valid:text-gray-400"
          >
            Email address
          </label>
        </div>

        <div className="relative mb-5">
          <input
            type="password"
            id="password"
            value={password}
            onChange={onPasswordChange}
            required
            autoComplete="current-password"
            placeholder=" "
            className="peer w-full p-2 border border-green-600 rounded-md bg-transparent text-white focus:outline-none focus:border-green-400"
          />
          <label
            htmlFor="password"
            className="absolute left-2 top-2 text-gray-500 text-lg bg-black px-1 transition-all 
            peer-placeholder-shown:top-2 peer-placeholder-shown:left-2 peer-placeholder-shown:text-lg peer-placeholder-shown:text-gray-500
            peer-focus:top-[-10px] peer-focus:left-2 peer-focus:text-sm peer-focus:text-gray-400
            peer-valid:top-[-10px] peer-valid:left-2 peer-valid:text-sm peer-valid:text-gray-400"
          >
            Password
          </label>
        </div>

        <button
          type="submit"
          className="bg-green-700 text-white py-2 rounded-md cursor-pointer text-lg transition-colors hover:bg-green-500"
        >
          Login
        </button>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
