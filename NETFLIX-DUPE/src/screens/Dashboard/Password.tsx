import React, { useState } from 'react';

const Password: React.FC = () => {
    const [password, setPassword] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle password submission logic here
        console.log('Password submitted:', password);
    };

    return (
        <div>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    New Password:
                    <input type="password" value={password} onChange={handleChange} />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Password;