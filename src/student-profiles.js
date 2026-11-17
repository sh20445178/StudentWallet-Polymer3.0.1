import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import {sharedStyles} from './shared-styles.js';
import {StudentStore, STUDENTS_CHANGED} from './student-store.js';
import {formatCurrency, initials} from './format.js';

class StudentProfiles extends PolymerElement {
  static get template() {
    return html`
      ${sharedStyles}
      <style>
        .toolbar {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .toolbar input { flex: 1; min-width: 200px; }
        .toolbar select { width: auto; }
        .stats {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .stat {
          flex: 1;
          min-width: 160px;
          background: #e8eaf6;
          border-radius: 8px;
          padding: 12px 16px;
        }
        .stat .value { font-size: 22px; font-weight: 700; color: #283593; }
        .stat .label { font-size: 12px; color: #555; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .profile {
          border: 1px solid #e0e3ef;
          border-radius: 10px;
          padding: 16px;
          display: flex;
          gap: 14px;
          align-items: center;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.15s, transform 0.15s;
        }
        .profile:hover {
          box-shadow: 0 4px 12px rgba(63, 81, 181, 0.18);
          transform: translateY(-2px);
        }
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #3f51b5;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }
        .name { font-weight: 700; }
        .meta { font-size: 12px; color: #666; }
        .balance { font-weight: 700; color: #2e7d32; margin-top: 4px; }
        .empty {
          text-align: center;
          color: #777;
          padding: 40px 0;
        }
      </style>

      <div class="card">
        <h2>Registered Student Profiles</h2>

        <div class="stats">
          <div class="stat">
            <div class="value">[[students.length]]</div>
            <div class="label">Registered students</div>
          </div>
          <div class="stat">
            <div class="value">[[_totalBalance(students)]]</div>
            <div class="label">Total wallet balance</div>
          </div>
        </div>

        <div class="toolbar">
          <input id="search" placeholder="Search by name, email, ID or course..."
              value="{{query::input}}">
          <select value="{{courseFilter::change}}">
            <option value="">All courses</option>
            <template is="dom-repeat" items="[[_courses(students)]]">
              <option value="[[item]]">[[item]]</option>
            </template>
          </select>
        </div>

        <template is="dom-if" if="[[!students.length]]">
          <div class="empty">
            No students registered yet. <a href="#register">Register the first student</a>.
          </div>
        </template>

        <template is="dom-if" if="[[_noMatches(students, filtered)]]">
          <div class="empty">No students match your search.</div>
        </template>

        <div class="grid">
          <template is="dom-repeat" items="[[filtered]]" as="student">
            <a class="profile" href="#profile/[[student.id]]">
              <div class="avatar">[[_initials(student)]]</div>
              <div>
                <div class="name">[[student.firstName]] [[student.lastName]]</div>
                <div class="meta">[[student.id]]</div>
                <div class="meta">[[student.course]] · Year [[student.year]]</div>
                <div class="balance">[[_currency(student.balance)]]</div>
              </div>
            </a>
          </template>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      students: {type: Array, value: () => []},
      query: {type: String, value: ''},
      courseFilter: {type: String, value: ''},
      filtered: {type: Array, computed: '_filter(students, query, courseFilter)'},
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._refresh = () => { this.students = StudentStore.getAll(); };
    window.addEventListener(STUDENTS_CHANGED, this._refresh);
    window.addEventListener('storage', this._refresh);
    this._refresh();
  }

  disconnectedCallback() {
    window.removeEventListener(STUDENTS_CHANGED, this._refresh);
    window.removeEventListener('storage', this._refresh);
    super.disconnectedCallback();
  }

  _filter(students, query, courseFilter) {
    const q = (query || '').trim().toLowerCase();
    return students.filter((s) => {
      if (courseFilter && s.course !== courseFilter) return false;
      if (!q) return true;
      return [s.firstName, s.lastName, `${s.firstName} ${s.lastName}`, s.email, s.id, s.course]
          .some((v) => v.toLowerCase().includes(q));
    });
  }

  _courses(students) {
    return [...new Set(students.map((s) => s.course))].sort();
  }

  _noMatches(students, filtered) {
    return students.length > 0 && filtered.length === 0;
  }

  _totalBalance(students) {
    return formatCurrency(students.reduce((sum, s) => sum + s.balance, 0));
  }

  _initials(student) {
    return initials(student);
  }

  _currency(value) {
    return formatCurrency(value);
  }
}

customElements.define('student-profiles', StudentProfiles);
