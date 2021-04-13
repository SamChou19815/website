import React, { ReactElement, useState } from 'react';

type Props = {
  readonly onSubmit: (url: string, accessLevel: AccessLevel, password: string) => void;
};

const LoginCard = ({ onSubmit }: Props): ReactElement => {
  const [url, setURL] = useState('http://localhost:8080');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('ADMIN');
  const [password, setPassword] = useState('');

  return (
    <div className="card vertical-margin-1em login-card">
      <div className="card__header">
        <h2>Login</h2>
      </div>
      <div className="card__body">
        <h3>Server URL</h3>
        <input
          className="text-input"
          type="text"
          value={url}
          placeholder="Server URL"
          onChange={(event) => setURL(event.currentTarget.value)}
        />
      </div>
      <div className="card__body">
        <h3>Access Level</h3>
        <div className="login-access-control">
          <label htmlFor="access-level-read">Read</label>
          <input
            type="radio"
            id="access-level-read"
            name="access-level"
            value="READ"
            checked={accessLevel === 'READ'}
            onChange={() => setAccessLevel('READ')}
          />
        </div>
        <div className="login-access-control">
          <label htmlFor="access-level-write">Write</label>
          <input
            type="radio"
            id="access-level-write"
            name="access-level"
            value="WRITE"
            checked={accessLevel === 'WRITE'}
            onChange={() => setAccessLevel('WRITE')}
          />
        </div>
        <div className="login-access-control">
          <label htmlFor="access-level-admin">Admin</label>
          <input
            type="radio"
            id="access-level-admin"
            name="access-level"
            value="ADMIN"
            checked={accessLevel === 'ADMIN'}
            onChange={() => setAccessLevel('ADMIN')}
          />
        </div>
      </div>
      <div className="card__body">
        <h3>Password</h3>
        <input
          className="text-input"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
      </div>
      <div className="card__footer">
        <button
          className="button button--primary"
          disabled={url.trim() === '' || password.trim() === ''}
          onClick={() => onSubmit(url, accessLevel, password)}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginCard;
