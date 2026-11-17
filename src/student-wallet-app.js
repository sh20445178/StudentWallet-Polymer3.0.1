import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import './student-registration.js';
import './student-profiles.js';
import './student-profile-detail.js';

class StudentWalletApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          min-height: 100vh;
        }
        header {
          background: linear-gradient(90deg, #283593, #3f51b5);
          color: #fff;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        h1 {
          font-size: 20px;
          margin: 14px 0;
        }
        nav a {
          color: #c5cae9;
          text-decoration: none;
          padding: 18px 14px;
          display: inline-block;
          font-weight: 600;
          border-bottom: 3px solid transparent;
        }
        nav a:hover { color: #fff; }
        nav a[active] {
          color: #fff;
          border-bottom-color: #ffca28;
        }
        main {
          max-width: 1000px;
          margin: 24px auto;
          padding: 0 16px;
        }
        [hidden] { display: none !important; }
      </style>

      <header>
        <h1>🎓 Student Wallet</h1>
        <nav>
          <a href="#register" active$="[[_isActive(page, 'register')]]">Register Student</a>
          <a href="#profiles" active$="[[_isActive(page, 'profiles')]]">Student Profiles</a>
        </nav>
      </header>

      <main>
        <student-registration hidden$="[[!_equals(page, 'register')]]"></student-registration>
        <student-profiles hidden$="[[!_equals(page, 'profiles')]]"></student-profiles>
        <student-profile-detail hidden$="[[!_equals(page, 'profile')]]"
            student-id="[[studentId]]"></student-profile-detail>
      </main>
    `;
  }

  static get properties() {
    return {
      page: {type: String, value: 'register'},
      studentId: {type: String, value: ''},
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._onHashChange = this._onHashChange.bind(this);
    window.addEventListener('hashchange', this._onHashChange);
    this._onHashChange();
  }

  disconnectedCallback() {
    window.removeEventListener('hashchange', this._onHashChange);
    super.disconnectedCallback();
  }

  _onHashChange() {
    const [page, id] = (window.location.hash.slice(1) || 'register').split('/');
    if (page === 'profile' && id) {
      this.studentId = decodeURIComponent(id);
      this.page = 'profile';
    } else {
      this.page = page === 'profiles' ? 'profiles' : 'register';
    }
    window.scrollTo(0, 0);
  }

  _equals(a, b) {
    return a === b;
  }

  // Keep the "Profiles" tab highlighted while viewing an individual profile.
  _isActive(page, name) {
    return page === name || (name === 'profiles' && page === 'profile');
  }
}

customElements.define('student-wallet-app', StudentWalletApp);
