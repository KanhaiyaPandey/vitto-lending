import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../lib/db';
import { runDecisionEngine } from '../lib/engine';
import { validateApplication } from '../middleware/validate';

const router = Router();

// POST /api/applications — submit and decide
router.post('/', validateApplication, async (req, res) => {
  try {
    const { business, loan } = req.body;
    const id = uuidv4();

    const result = runDecisionEngine({
      monthlyRevenue: business.monthlyRevenue,
      requestedAmount: loan.requestedAmount,
      tenureMonths: loan.tenureMonths,
      pan: business.pan,
    });

    await query(
      `INSERT INTO applications
        (id, owner_name, pan, business_type, monthly_revenue,
         requested_amount, tenure_months, purpose,
         decision, credit_score, reason_codes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        id,
        business.ownerName,
        business.pan.toUpperCase(),
        business.businessType,
        business.monthlyRevenue,
        loan.requestedAmount,
        loan.tenureMonths,
        loan.purpose,
        result.decision,
        result.creditScore,
        result.reasonCodes,
      ]
    );

    res.status(201).json({
      applicationId: id,
      decision: result.decision,
      creditScore: result.creditScore,
      monthlyEmi: result.monthlyEmi,
      reasonCodes: result.reasonCodes,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/applications — audit trail
router.get('/', async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, owner_name, business_type, monthly_revenue,
              requested_amount, tenure_months, purpose,
              decision, credit_score, reason_codes, created_at
       FROM applications ORDER BY created_at DESC LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
