import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';
import db from '../src/db/index.js';
import fs from 'fs';
import path from 'path';

describe('Expenses API Robustness & Logic', () => {
  const testExpense = {
    amount: 1250.50,
    category: 'Housing',
    description: 'Monthly Rent',
    date: '2024-04-26'
  };

  it('POST /expenses should create an expense and handle money correctly (paise)', async () => {
    const res = await request(app)
      .post('/expenses')
      .send(testExpense);

    expect(res.status).toBe(201);
    expect(res.body.amount).toBe(1250.50);
    expect(res.body.category).toBe('Housing');
    
    // Verify in DB that it's stored as 125050
    const row = db.prepare('SELECT * FROM expenses WHERE id = ?').get(res.body.id);
    expect(row.amount).toBe(125050);
  });

  it('POST /expenses should be idempotent with Idempotency-Key', async () => {
    const idemKey = 'test-idem-key-' + Date.now();
    
    // First request
    const res1 = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', idemKey)
      .send(testExpense);
    
    expect(res1.status).toBe(201);
    const id1 = res1.body.id;

    // Second request (identical)
    const res2 = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', idemKey)
      .send(testExpense);
    
    expect(res2.status).toBe(200); // Should be 200, not 201
    expect(res2.body.id).toBe(id1);

    // Verify only one record exists for this key
    const count = db.prepare('SELECT COUNT(*) as count FROM expenses WHERE idem_key = ?').get(idemKey).count;
    expect(count).toBe(1);
  });

  it('POST /expenses should return 400 for invalid data', async () => {
    const invalidExpense = { ...testExpense, amount: -50 }; // Negative amount
    const res = await request(app)
      .post('/expenses')
      .send(invalidExpense);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('GET /expenses should support filtering and sorting', async () => {
    // Add multiple items
    await request(app).post('/expenses').send({ ...testExpense, category: 'Food', date: '2024-04-01' });
    await request(app).post('/expenses').send({ ...testExpense, category: 'Food', date: '2024-04-20' });

    const res = await request(app)
      .get('/expenses')
      .query({ category: 'Food', sort: 'date_desc' });

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0].category).toBe('Food');
    
    // Check sorting (newest first)
    const date1 = new Date(res.body[0].date);
    const date2 = new Date(res.body[1].date);
    expect(date1 >= date2).toBe(true);
  });
});
