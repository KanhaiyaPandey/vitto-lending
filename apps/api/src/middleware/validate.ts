import { Request, Response, NextFunction } from 'express';

export function validateApplication(req: Request, res: Response, next: NextFunction) {
  const { business, loan } = req.body;

  if (!business || !loan) {
    res.status(400).json({ error: 'Missing business or loan fields' });
    return;
  }

  const { ownerName, pan, businessType, monthlyRevenue } = business;
  const { requestedAmount, tenureMonths, purpose } = loan;

  const missing: string[] = [];
  if (!ownerName?.trim()) missing.push('ownerName');
  if (!pan?.trim()) missing.push('pan');
  if (!businessType) missing.push('businessType');
  if (monthlyRevenue === undefined || monthlyRevenue === null) missing.push('monthlyRevenue');
  if (requestedAmount === undefined || requestedAmount === null) missing.push('requestedAmount');
  if (tenureMonths === undefined || tenureMonths === null) missing.push('tenureMonths');
  if (!purpose?.trim()) missing.push('purpose');

  if (missing.length > 0) {
    res.status(400).json({ error: 'Missing required fields', fields: missing });
    return;
  }

  if (typeof monthlyRevenue !== 'number' || monthlyRevenue <= 0) {
    res.status(400).json({ error: 'monthlyRevenue must be a positive number' });
    return;
  }
  if (typeof requestedAmount !== 'number' || requestedAmount <= 0) {
    res.status(400).json({ error: 'requestedAmount must be a positive number' });
    return;
  }
  if (typeof tenureMonths !== 'number' || !Number.isInteger(tenureMonths) || tenureMonths <= 0) {
    res.status(400).json({ error: 'tenureMonths must be a positive integer' });
    return;
  }

  const validTypes = ['retail', 'manufacturing', 'services', 'other'];
  if (!validTypes.includes(businessType)) {
    res.status(400).json({ error: 'Invalid businessType' });
    return;
  }

  next();
}
