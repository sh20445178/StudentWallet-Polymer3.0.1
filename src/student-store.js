const STORAGE_KEY = 'student-wallet.students';
export const STUDENTS_CHANGED = 'students-changed';

function read() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function write(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  window.dispatchEvent(new CustomEvent(STUDENTS_CHANGED, {detail: {students}}));
}

function generateId() {
  return 'STU-' + Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).slice(2, 6).toUpperCase();
}

export const StudentStore = {
  getAll() {
    return read();
  },

  get(id) {
    return read().find((s) => s.id === id) || null;
  },

  emailExists(email) {
    const normalized = email.trim().toLowerCase();
    return read().some((s) => s.email.toLowerCase() === normalized);
  },

  add(data) {
    const students = read();
    const balance = Number(data.initialDeposit) || 0;
    const student = {
      id: generateId(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      dateOfBirth: data.dateOfBirth,
      course: data.course,
      year: data.year,
      balance,
      transactions: balance > 0
        ? [{type: 'credit', amount: balance, note: 'Initial deposit', date: new Date().toISOString()}]
        : [],
      registeredAt: new Date().toISOString(),
    };
    students.push(student);
    write(students);
    return student;
  },

  addTransaction(id, type, amount, note) {
    const students = read();
    const student = students.find((s) => s.id === id);
    if (!student) throw new Error('Student not found');
    const value = Number(amount);
    if (!(value > 0)) throw new Error('Amount must be greater than zero');
    if (type === 'debit' && value > student.balance) throw new Error('Insufficient balance');
    student.balance = Math.round((student.balance + (type === 'credit' ? value : -value)) * 100) / 100;
    student.transactions.unshift({type, amount: value, note: note || '', date: new Date().toISOString()});
    write(students);
    return student;
  },

  remove(id) {
    write(read().filter((s) => s.id !== id));
  },
};
