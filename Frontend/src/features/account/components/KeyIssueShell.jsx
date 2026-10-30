import { ArrowUpRight, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import './key-issue.css';

const KeyIssueShell = ({ children, unlocked = false }) => (
  <main className={`key-world ${unlocked ? 'is-unlocked' : ''}`}>
    <div className="garage-shutter" aria-hidden="true" />
    <header className="key-header">
      <Link className="key-logo" to="/" aria-label="REVEX home">REVE<span>X</span><span className="logo-mark">®</span></Link>
      <span className="key-header-caption">THE DRIVER'S ENTRANCE</span>
      <Link className="key-exit" to="/">Back to showroom <ArrowUpRight size={16} /></Link>
    </header>

    <div className="garage-stage">
      <div className="garage-intro">
        <p className="key-kicker"><span /> PRIVATE ACCESS / 01</p>
        <h1>Good to <br />have you <br /><em>back.</em></h1>
        <p className="garage-description">Your next chapter.<br />Your favourite cars.<br />All behind one key.</p>
        <div className="garage-annotation"><span /> YOUR GARAGE IS WAITING</div>
      </div>

      <section className="key-fob" aria-label="Log in to your REVEX account">
        <div className="key-loop" aria-hidden="true"><span /></div>
        <div className="key-fob-inner">{children}</div>
        <div className="key-fob-base" aria-hidden="true"><span>REVEX</span><span>DRIVER'S KEY / 01</span></div>
      </section>

      <aside className="bay-marker" aria-label="Garage bay 01">
        <p>RESERVED FOR YOU</p>
        <span className="bay-number">01</span>
        <div className="bay-rule" />
        <p className="bay-label">A SPACE FOR<br />WHAT MOVES YOU.</p>
        <KeyRound className="bay-key" size={32} strokeWidth={1} aria-hidden="true" />
      </aside>
      <div className="parking-lines" aria-hidden="true"><span /><span /></div>
    </div>

    <footer className="key-footer">
      <span className="key-footer-note">BUILT AROUND THE DRIVE.</span>
      <div><Link to="/terms">Terms</Link><span>/</span><Link to="/privacy">Privacy</Link></div>
      <span className="key-footer-edition">REVEX — DRIVER ACCESS</span>
    </footer>
  </main>
);

export default KeyIssueShell;
