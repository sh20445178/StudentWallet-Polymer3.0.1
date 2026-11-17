import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import {sharedStyles} from './shared-styles.js';
import {StudentStore} from './student-store.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;

function emptyForm() {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    course: '',
    year: '',
    initialDeposit: '',
  };
}

class StudentRegistration extends PolymerElement {
  static get template() {
    return html`
      ${sharedStyles}
      <style>
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 20px;
        }
        @media (max-width: 600px) {
          .grid { grid-template-columns: 1fr; }
        }
        .actions {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
        .success a { color: #1b5e20; font-weight: 600; }
      </style>

      <div class="card">
        <h2>Student Registration</h2>

        <template is="dom-if" if="[[registered]]">
          <div class="success" id="success">
            ✅ <strong>[[registered.firstName]] [[registered.lastName]]</strong>
            registered successfully with ID <strong>[[registered.id]]</strong>.
            <a href="#profile/[[registered.id]]">View profile</a>
          </div>
        </template>

        <form id="form" on-submit="_submit" novalidate>
          <div class="grid">
            <div>
              <label for="firstName">First name *</label>
              <input id="firstName" value="{{form.firstName::input}}" invalid$="[[errors.firstName]]">
              <div class="error">[[errors.firstName]]</div>
            </div>
            <div>
              <label for="lastName">Last name *</label>
              <input id="lastName" value="{{form.lastName::input}}" invalid$="[[errors.lastName]]">
              <div class="error">[[errors.lastName]]</div>
            </div>
            <div>
              <label for="email">Email *</label>
              <input id="email" type="email" value="{{form.email::input}}" invalid$="[[errors.email]]">
              <div class="error">[[errors.email]]</div>
            </div>
            <div>
              <label for="phone">Phone *</label>
              <input id="phone" type="tel" value="{{form.phone::input}}" invalid$="[[errors.phone]]">
              <div class="error">[[errors.phone]]</div>
            </div>
            <div>
              <label for="dateOfBirth">Date of birth *</label>
              <input id="dateOfBirth" type="date" value="{{form.dateOfBirth::input}}"
                  invalid$="[[errors.dateOfBirth]]">
              <div class="error">[[errors.dateOfBirth]]</div>
            </div>
            <div>
              <label for="course">Course *</label>
              <select id="course" value="{{form.course::change}}" invalid$="[[errors.course]]">
                <option value="">-- Select course --</option>
                <template is="dom-repeat" items="[[courses]]">
                  <option value="[[item]]">[[item]]</option>
                </template>
              </select>
              <div class="error">[[errors.course]]</div>
            </div>
            <div>
              <label for="year">Year of study *</label>
              <select id="year" value="{{form.year::change}}" invalid$="[[errors.year]]">
                <option value="">-- Select year --</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              <div class="error">[[errors.year]]</div>
            </div>
            <div>
              <label for="initialDeposit">Initial wallet deposit (₹)</label>
              <input id="initialDeposit" type="number" min="0" step="0.01"
                  value="{{form.initialDeposit::input}}" invalid$="[[errors.initialDeposit]]">
              <div class="error">[[errors.initialDeposit]]</div>
            </div>
          </div>

          <div class="actions">
            <button type="submit" id="submit">Register</button>
            <button type="button" class="secondary" on-click="_reset">Clear</button>
          </div>
        </form>
      </div>
    `;
  }

  static get properties() {
    return {
      form: {type: Object, value: emptyForm},
      errors: {type: Object, value: () => ({})},
      registered: {type: Object, value: null},
      courses: {
        type: Array,
        value: () => [
          'Computer Science', 'Information Technology', 'Electronics',
          'Mechanical', 'Civil', 'Commerce', 'Arts', 'Business Administration',
        ],
      },
    };
  }

  _validate(f) {
    const errors = {};
    if (!f.firstName.trim()) errors.firstName = 'First name is required';
    if (!f.lastName.trim()) errors.lastName = 'Last name is required';
    if (!f.email.trim()) {
      errors.email = 'Email is required';
    } else if (!EMAIL_RE.test(f.email.trim())) {
      errors.email = 'Enter a valid email address';
    } else if (StudentStore.emailExists(f.email)) {
      errors.email = 'A student with this email is already registered';
    }
    if (!f.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!PHONE_RE.test(f.phone.trim())) {
      errors.phone = 'Enter a valid phone number';
    }
    if (!f.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else if (new Date(f.dateOfBirth) >= new Date()) {
      errors.dateOfBirth = 'Date of birth must be in the past';
    }
    if (!f.course) errors.course = 'Select a course';
    if (!f.year) errors.year = 'Select year of study';
    if (f.initialDeposit !== '' && !(Number(f.initialDeposit) >= 0)) {
      errors.initialDeposit = 'Deposit must be zero or a positive amount';
    }
    return errors;
  }

  _submit(e) {
    e.preventDefault();
    const errors = this._validate(this.form);
    this.errors = errors;
    if (Object.keys(errors).length) {
      this.registered = null;
      return;
    }
    this.registered = StudentStore.add(this.form);
    this.form = emptyForm();
    this.dispatchEvent(new CustomEvent('student-registered',
        {detail: {student: this.registered}, bubbles: true, composed: true}));
  }

  _reset() {
    this.form = emptyForm();
    this.errors = {};
    this.registered = null;
  }
}

customElements.define('student-registration', StudentRegistration);
