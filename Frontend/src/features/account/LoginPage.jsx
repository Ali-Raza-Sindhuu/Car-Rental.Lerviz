import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, UnlockKeyhole } from 'lucide-react';
import KeyIssueShell from '@/features/account/components/KeyIssueShell';
import GoogleButton from '@/features/account/components/GoogleButton';
import { emailPattern } from '@/features/account/validation';
import { authRequest } from '@/features/account/authApi';

const LoginPage = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = {};
    if (!emailPattern.test(values.email)) nextErrors.email = 'Enter a valid email address';
    if (!values.password) nextErrors.password = 'Enter your password';
    setErrors(nextErrors);
    setStatus('');
    if (Object.keys(nextErrors).length) return;
    setIsSubmitting(true);
    try {
      const session = await authRequest('login', values);
      sessionStorage.setItem('revexAccessToken', session.accessToken);
      setIsUnlocked(true);
      setStatus('You are logged in. Your garage is unlocked.');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoogle = () => {
    // TODO: start Google sign-in using the configured Google client.
  };

  return (
    <KeyIssueShell unlocked={isUnlocked}>
      <div className="fob-overline"><span>PERSONAL ACCESS KEY</span><span className="fob-led">{isUnlocked ? 'UNLOCKED' : 'LOCKED'}</span></div>
      <h2 className="fob-title">{isUnlocked ? 'Welcome to your garage.' : 'Your key. Your world.'}</h2>
      <p className="fob-subtitle">{isUnlocked ? 'A new drive starts here.' : 'Log in to pick up where you left off.'}</p>
      {status && <p role={isUnlocked ? 'status' : 'alert'} className={`key-status ${isUnlocked ? '' : 'is-error'}`}>{status}</p>}
      {isUnlocked ? (
        <Link className="key-unlock" to="/">ENTER THE SHOWROOM <UnlockKeyhole size={20} /></Link>
      ) : (
        <>
          <div className="key-google"><GoogleButton onClick={handleGoogle} /></div>
          <div className="key-divider">or unlock with email</div>
          <form onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
            <div className="key-fields">
              <div className="key-field">
                <label htmlFor="email"><span className="key-field-number">01</span> EMAIL ADDRESS</label>
                <div className="key-input-wrap">
                  <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
                </div>
                {errors.email && <p className="key-error" id="email-error">{errors.email}</p>}
              </div>
              <div className="key-field">
                <label htmlFor="password"><span className="key-field-number">02</span> PASSWORD</label>
                <div className="key-input-wrap">
                  <input id="password" name="password" type={isVisible ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={values.password} onChange={handleChange} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} />
                  <button type="button" aria-label={isVisible ? 'Hide password' : 'Show password'} aria-pressed={isVisible} onClick={() => setIsVisible((previous) => !previous)}>{isVisible ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </div>
                {errors.password && <p className="key-error" id="password-error">{errors.password}</p>}
              </div>
            </div>
            <div className="key-options">
              <label><input type="checkbox" name="remember" /> Keep me logged in</label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <button className="key-unlock" type="submit" disabled={isSubmitting}><span>{isSubmitting ? 'UNLOCKING…' : 'UNLOCK MY GARAGE'}</span><LockKeyhole size={20} strokeWidth={1.7} /></button>
          </form>
          <p className="key-create">No key yet? <Link to="/signup">Get yours <span aria-hidden="true">↗</span></Link></p>
        </>
      )}
    </KeyIssueShell>
  );
};

export default LoginPage;
