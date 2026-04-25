import './src/db/index.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expensesRouter from './src/api/expenses.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());

app.use('/expenses', expensesRouter);
app.get('/', (_, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error('Unhandled:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
}