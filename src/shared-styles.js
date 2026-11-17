import {html} from '@polymer/polymer/polymer-element.js';

export const sharedStyles = html`
  <style>
    :host {
      display: block;
      box-sizing: border-box;
    }
    .card {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      padding: 24px;
    }
    h2 {
      margin: 0 0 16px;
      color: #283593;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #444;
    }
    input, select {
      width: 100%;
      box-sizing: border-box;
      padding: 9px 10px;
      border: 1px solid #ccd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #3f51b5;
      box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.15);
    }
    input[invalid], select[invalid] {
      border-color: #d32f2f;
    }
    .error {
      color: #d32f2f;
      font-size: 12px;
      min-height: 16px;
      margin-top: 2px;
    }
    button {
      cursor: pointer;
      border: none;
      border-radius: 6px;
      padding: 9px 18px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      background: #3f51b5;
      color: #fff;
    }
    button:hover { background: #303f9f; }
    button.secondary { background: #e8eaf6; color: #283593; }
    button.secondary:hover { background: #c5cae9; }
    button.danger { background: #d32f2f; }
    button.danger:hover { background: #b71c1c; }
    .success {
      background: #e8f5e9;
      color: #1b5e20;
      border: 1px solid #a5d6a7;
      padding: 10px 14px;
      border-radius: 6px;
      margin-bottom: 16px;
    }
  </style>
`;
