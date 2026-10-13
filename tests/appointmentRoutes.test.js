const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
const Module = require('node:module');

// Replace the pool before loading routes: these tests never connect to MySQL.
const dbPath = require.resolve('../config/db');
const previousDb = require.cache[dbPath];
let calls = [];
let databaseError = false;
const fakeDb = new Module(dbPath);
fakeDb.exports = {
  query: async (sql, values) => {
    calls.push({ sql, values });
    if (databaseError) throw new Error('Simulated database failure');
    return [{ affectedRows: 1 }];
  }
};
require.cache[dbPath] = fakeDb;
let routes;
try {
  routes = require('../routes/appointmentRoutes');
} finally {
  if (previousDb) require.cache[dbPath] = previousDb;
  else delete require.cache[dbPath];
}

test('appointment PATCH routes with an isolated database mock', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/api/appointments', routes);
  const server = await new Promise((resolve) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
  });
  t.after(() => new Promise((resolve, reject) => {
    server.close((err) => err ? reject(err) : resolve());
  }));
  const base = `http://127.0.0.1:${server.address().port}/api/appointments`;

  await t.test('cancel uses a parameterized update and returns success', async () => {
    calls = [];
    const response = await fetch(`${base}/42/cancel`, { method: 'PATCH' });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { message: 'Appointment cancelled successfully' });
    assert.deepEqual(calls, [{
      sql: 'UPDATE appointments SET status = ? WHERE id = ?',
      values: ['cancelled', '42']
    }]);
  });

  await t.test('payment updates the requested status and returns success', async () => {
    calls = [];
    const response = await fetch(`${base}/42/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status: 'paid' })
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { message: 'Payment status updated' });
    assert.deepEqual(calls, [{
      sql: 'UPDATE appointments SET payment_status = ? WHERE id = ?',
      values: ['paid', '42']
    }]);
  });

  await t.test('cancel reports a database failure without exposing details', async () => {
    databaseError = true;
    try {
      const response = await fetch(`${base}/42/cancel`, { method: 'PATCH' });
      assert.equal(response.status, 500);
      assert.deepEqual(await response.json(), { error: 'Failed to cancel appointment' });
    } finally {
      databaseError = false;
    }
  });

  await t.test('payment reports a database failure without exposing details', async () => {
    databaseError = true;
    try {
      const response = await fetch(`${base}/42/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: 'paid' })
      });
      assert.equal(response.status, 500);
      assert.deepEqual(await response.json(), { error: 'Failed to update payment status' });
    } finally {
      databaseError = false;
    }
  });
});
