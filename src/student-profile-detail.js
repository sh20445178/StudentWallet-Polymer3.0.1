import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import {sharedStyles} from './shared-styles.js';
import {StudentStore, STUDENTS_CHANGED} from './student-store.js';
import {formatCurrency, formatDate, initials} from './format.js';

class StudentProfileDetail extends PolymerElement {
  static get template() {
    return html`
      ${sharedStyles}
      <style>
        .back { display: inline-block; margin-bottom: 14px; color: #3f51b5; text-decoration: none; }
        .head {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #3f51b5;
          color: #fff;
          font-size: 26px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .head h2 { margin: 0; }
        .head .id { color: #666; font-size: 13px; }
        .head .spacer { flex: 1; }
        .layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 700px) {
          .layout { grid-template-columns: 1fr; }
        }
        dl {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 10px;
          margin: 0;
        }
        dt { color: #666; font-size: 13px; }
        dd { margin: 0; font-weight: 600; word-break: break-word; }
        .wallet {
          background: linear-gradient(135deg, #3f51b5, #5c6bc0);
          color: #fff;
          border-radius: 10px;
          padding: 18px;
          margin-bottom: 14px;
        }
        .wallet .amount { font-size: 30px; font-weight: 700; }
        .row { display: flex; gap: 8px; margin-top: 8px; }
        .row > * { flex: 1; }
        h3 { margin: 24px 0 10px; color: #283593; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #eee; }
        td.credit { color: #2e7d32; font-weight: 600; }
        td.debit { color: #c62828; font-weight: 600; }
        .empty { color: #777; padding: 12px 0; }
      </style>

      <a class="back" href="#profiles">← Back to all profiles</a>

      <template is="dom-if" if="[[!student]]">
        <div class="card">
          <h2>Student not found</h2>
          <p>The requested profile does not exist. <a href="#profiles">View all students</a>.</p>
        </div>
      </template>

      <template is="dom-if" if="[[student]]">
        <div class="card">
          <div class="head">
            <div class="avatar">[[_initials(student)]]</div>
            <div>
              <h2>[[student.firstName]] [[student.lastName]]</h2>
              <div class="id">[[student.id]]</div>
            </div>
            <div class="spacer"></div>
            <button class="danger" on-click="_delete">Delete student</button>
          </div>

          <div class="layout">
            <div>
              <dl>
                <dt>Email</dt><dd>[[student.email]]</dd>
                <dt>Phone</dt><dd>[[student.phone]]</dd>
                <dt>Date of birth</dt><dd>[[_dob(student.dateOfBirth)]]</dd>
                <dt>Course</dt><dd>[[student.course]]</dd>
                <dt>Year of study</dt><dd>Year [[student.year]]</dd>
                <dt>Registered on</dt><dd>[[_date(student.registeredAt)]]</dd>
              </dl>
            </div>

            <div>
              <div class="wallet">
                <div>Wallet balance</div>
                <div class="amount">[[_currency(student.balance)]]</div>
              </div>
              <label for="amount">Amount (₹)</label>
              <input id="amount" type="number" min="0" step="0.01" value="{{amount::input}}">
              <label for="note" style="margin-top:8px">Note</label>
              <input id="note" placeholder="e.g. Canteen, Library fine" value="{{note::input}}">
              <div class="error">[[txError]]</div>
              <div class="row">
                <button on-click="_credit">Add money</button>
                <button class="secondary" on-click="_debit">Spend</button>
              </div>
            </div>
          </div>

          <h3>Transaction history</h3>
          <template is="dom-if" if="[[!student.transactions.length]]">
            <div class="empty">No transactions yet.</div>
          </template>
          <template is="dom-if" if="[[student.transactions.length]]">
            <table>
              <thead>
                <tr><th>Date</th><th>Type</th><th>Note</th><th>Amount</th></tr>
              </thead>
              <tbody>
                <template is="dom-repeat" items="[[student.transactions]]" as="tx">
                  <tr>
                    <td>[[_dateTime(tx.date)]]</td>
                    <td>[[tx.type]]</td>
                    <td>[[tx.note]]</td>
                    <td class$="[[tx.type]]">[[_signed(tx)]]</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
        </div>
      </template>
    `;
  }

  static get properties() {
    return {
      studentId: {type: String, observer: '_load'},
      student: {type: Object, value: null},
      amount: {type: String, value: ''},
      note: {type: String, value: ''},
      txError: {type: String, value: ''},
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this._refresh = () => this._load(this.studentId);
    window.addEventListener(STUDENTS_CHANGED, this._refresh);
    window.addEventListener('storage', this._refresh);
  }

  disconnectedCallback() {
    window.removeEventListener(STUDENTS_CHANGED, this._refresh);
    window.removeEventListener('storage', this._refresh);
    super.disconnectedCallback();
  }

  _load(id, oldId) {
    this.student = id ? StudentStore.get(id) : null;
    if (oldId !== undefined && id !== oldId) {
      this.amount = '';
      this.note = '';
      this.txError = '';
    }
  }

  _transact(type) {
    try {
      StudentStore.addTransaction(this.student.id, type, this.amount, this.note.trim());
      this.amount = '';
      this.note = '';
      this.txError = '';
    } catch (e) {
      this.txError = e.message;
    }
  }

  _credit() {
    this._transact('credit');
  }

  _debit() {
    this._transact('debit');
  }

  _delete() {
    const name = `${this.student.firstName} ${this.student.lastName}`;
    if (window.confirm(`Delete ${name}'s profile and wallet? This cannot be undone.`)) {
      StudentStore.remove(this.student.id);
      window.location.hash = '#profiles';
    }
  }

  _initials(student) {
    return initials(student);
  }

  _currency(value) {
    return formatCurrency(value);
  }

  _signed(tx) {
    return (tx.type === 'credit' ? '+ ' : '- ') + formatCurrency(tx.amount);
  }

  // dateOfBirth is a plain YYYY-MM-DD string; avoid timezone shifts from Date parsing.
  _dob(value) {
    if (!value) return '';
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString();
  }

  _date(iso) {
    return formatDate(iso);
  }

  _dateTime(iso) {
    return formatDate(iso, true);
  }
}

customElements.define('student-profile-detail', StudentProfileDetail);
