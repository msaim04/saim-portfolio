import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Cloud,
  Database,
  Github,
  Lock,
  Mail,
  Server,
  Shield,
  Terminal,
  UserCircle2
} from 'lucide-react';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const skillCards = [
  {
    icon: Cloud,
    title: 'Cloud Architecture',
    text: 'AWS-focused infrastructure design with scalable networking, load balancing, WAF protection, and resilient multi-region patterns.'
  },
  {
    icon: Server,
    title: 'DevOps Automation',
    text: 'Terraform, Docker, Kubernetes, GitHub Actions, observability stacks, and deployment automation for faster releases.'
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    text: 'Security hardening, threat-aware engineering, penetration testing workflows, OWASP practices, and secure platform delivery.'
  },
  {
    icon: Database,
    title: 'Data & Reliability',
    text: 'PostgreSQL-backed systems with operational discipline, clean API design, backups, and production-minded service architecture.'
  }
];

const timeline = [
  'AWS infrastructure design and automation',
  'Docker and Kubernetes deployment pipelines',
  'GitHub Actions CI/CD and release workflows',
  'Prometheus, Grafana, and system observability',
  'Infrastructure hardening and vulnerability reduction',
  'Penetration testing mindset for secure delivery'
];

const projects = [
  'Automated website security scanner with CI/CD integration',
  'Infrastructure automation with Kubernetes and Terraform',
  'AWS multi-region environment with monitoring and failover',
  'Pipeline-driven infrastructure deployment and rollback automation'
];

const initialForm = { name: '', email: '', subject: '', message: '' };
const initialAuth = { name: '', email: '', password: '' };

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState(initialAuth);
  const [contactForm, setContactForm] = useState(initialForm);
  const [authState, setAuthState] = useState({ token: '', user: null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('portfolio_token');
    const storedUser = localStorage.getItem('portfolio_user');
    if (storedToken && storedUser) {
      setAuthState({ token: storedToken, user: JSON.parse(storedUser) });
      setContactForm((prev) => ({ ...prev, name: JSON.parse(storedUser).name, email: JSON.parse(storedUser).email }));
    }
  }, []);

  const isLoggedIn = useMemo(() => Boolean(authState.token), [authState.token]);

  const callApi = async (url, method, body) => {
    const response = await fetch(`${API_BASE}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(authState.token ? { Authorization: `Bearer ${authState.token}` } : {})
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const route = authMode === 'login' ? '/auth/login' : '/auth/register';
      const payload =
        authMode === 'login'
          ? { email: authForm.email, password: authForm.password }
          : { name: authForm.name, email: authForm.email, password: authForm.password };
      const data = await callApi(route, 'POST', payload);
      localStorage.setItem('portfolio_token', data.token);
      localStorage.setItem('portfolio_user', JSON.stringify(data.user));
      setAuthState({ token: data.token, user: data.user });
      setContactForm((prev) => ({ ...prev, name: data.user.name, email: data.user.email }));
      setAuthForm(initialAuth);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const data = await callApi('/messages', 'POST', {
        ...contactForm,
        userId: authState.user?.id || null
      });
      setMessage(data.message);
      setContactForm((prev) => ({ ...prev, subject: '', message: '' }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_user');
    setAuthState({ token: '', user: null });
    setMessage('Logged out successfully.');
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar section">
        <div className="brand">
          <span className="brand-badge">SA</span>
          <div>
            <strong>Muhammad Saim Ali</strong>
            <span>DevOps • Cloud • Cybersecurity</span>
          </div>
        </div>
        <nav>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero section grid-2">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="eyebrow">Tech-forward portfolio</div>
            <h1>Secure infrastructure. Automated delivery. Calm, modern execution.</h1>
            <p className="lead">
              A light-phase, animated portfolio built to present a DevOps engineer and cybersecurity practitioner with
              real cloud depth, production automation, and a sharp security mindset.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary" href="#contact">
                Work with me <ArrowRight size={18} />
              </a>
              <a className="btn btn-secondary" href="/My CV.pdf" target="_blank" rel="noreferrer">
                View CV
              </a>
            </div>
            <div className="stat-row">
              <div className="stat-card">
                <BadgeCheck size={18} />
                AWS, Terraform, Kubernetes
              </div>
              <div className="stat-card">
                <Terminal size={18} />
                CI/CD, Monitoring, Hardening
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <img src="/profile.png" alt="Muhammad Saim Ali portrait" className="profile-image" />
            <div className="hero-card-content">
              <div className="chip-row">
                <span className="chip">DevOps Engineer</span>
                <span className="chip">Cloud Architect</span>
                <span className="chip">Pentester</span>
              </div>
              <p>
                Building production-ready systems with cloud automation, observability, container orchestration, and
                cybersecurity-first implementation.
              </p>
            </div>
          </motion.div>
        </section>

        <section className="section">
          <div className="panel grid-3 mini-grid">
            {timeline.map((item, index) => (
              <motion.div
                key={item}
                className="mini-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <span className="mini-index">0{index + 1}</span>
                <p>{item}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="section" id="skills">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Capabilities</span>
              <h2>Full-stack operations with a security-first edge</h2>
            </div>
            <p>
              This portfolio emphasizes cloud engineering, deployment automation, monitoring, and cybersecurity
              readiness in one cohesive experience.
            </p>
          </div>
          <div className="grid-4">
            {skillCards.map(({ icon: Icon, title, text }, index) => (
              <motion.article
                className="feature-card"
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon">
                  <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section grid-2" id="projects">
          <motion.div className="panel" initial={{ opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="eyebrow">Projects</span>
            <h2>Selected focus areas</h2>
            <div className="stack-list">
              {projects.map((project) => (
                <div key={project} className="stack-item">
                  <BrainCircuit size={18} />
                  <span>{project}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="panel auth-panel" initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="panel-header-row">
              <div>
                <span className="eyebrow">Account access</span>
                <h2>{authMode === 'login' ? 'Login' : 'Create account'}</h2>
              </div>
              {isLoggedIn && (
                <button className="logout-link" type="button" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>

            <form onSubmit={handleAuth} className="form-grid">
              {authMode === 'register' && (
                <label>
                  Full Name
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="Muhammad Saim Ali"
                    required
                  />
                </label>
              )}
              <label>
                Email
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  required
                />
              </label>
              <button className="btn btn-primary wide" disabled={busy}>
                <Lock size={18} /> {busy ? 'Please wait...' : authMode === 'login' ? 'Login now' : 'Register now'}
              </button>
            </form>
            <button
              className="toggle-auth"
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            >
              {authMode === 'login' ? 'Need an account? Register' : 'Already registered? Login'}
            </button>
          </motion.div>
        </section>

        <section className="section" id="contact">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Direct contact</span>
              <h2>Send a message</h2>
            </div>
            <p>Your message is stored in PostgreSQL and can also be delivered to SMTP email.</p>
          </div>

          <div className="grid-2 contact-grid">
            <motion.div className="panel contact-side" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="contact-item">
                <Mail size={18} />
                <span>saim@waxonit.co.uk</span>
              </div>
              <div className="contact-item">
                <UserCircle2 size={18} />
                <span>Available for DevOps, infrastructure, security, and deployment work</span>
              </div>
              <div className="contact-item">
                <Github size={18} />
                <span>Production-ready monolith prepared for server deployment</span>
              </div>
            </motion.div>

            <motion.form className="panel form-grid" onSubmit={handleSendMessage} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <label>
                Name
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                />
              </label>
              <label>
                Subject
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Project inquiry"
                  required
                />
              </label>
              <label>
                Message
                <textarea
                  rows="6"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell me about your project, infrastructure, or security needs."
                  required
                />
              </label>
              <button className="btn btn-primary wide" disabled={busy}>
                <Mail size={18} /> {busy ? 'Sending...' : 'Send message'}
              </button>
            </motion.form>
          </div>

          {(message || error) && <div className={`feedback ${error ? 'error' : 'success'}`}>{error || message}</div>}
        </section>
      </main>
    </div>
  );
}

export default App;
