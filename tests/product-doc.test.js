import test from 'node:test';
import assert from 'node:assert/strict';

import { buildProductDocument } from '../src/lib/productDoc.js';

test('buildProductDocument maps product payload to TechBasket_all_data fields', () => {
  const doc = buildProductDocument({
    title: 'TP-Link Archer',
    sku: 'TPL-ARCHER-C6-WH',
    brand: 'BRAND_TPLINK',
    category: 'CAT_ROUTER',
    color: 'White',
    warrantyPeriod: 365,
    warrantyUnit: 'DAYS',
    description: 'Router',
    status: 'active',
  });

  assert.equal(doc.productTitle, 'TP-Link Archer');
  assert.equal(doc.sku, 'TPL-ARCHER-C6-WH');
  assert.equal(doc.brandId, 'BRAND_TPLINK');
  assert.equal(doc.categoryId, 'CAT_ROUTER');
  assert.equal(doc.color, 'White');
  assert.equal(doc.warrantyPeriod, 365);
  assert.equal(doc.warrantyUnit, 'DAYS');
  assert.equal(doc.status, 'ACTIVE');
  assert.equal(doc.approvalStatus, 'PENDING');
  assert.equal(doc.createdBy, 'USER-001');
  assert.equal(doc.approvedBy, null);
  assert.equal(doc.approvedAt, null);
});
