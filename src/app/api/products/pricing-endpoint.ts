// API endpoint to get product pricing for different measures
// File: src/app/api/products/[id]/pricing/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { pricingService } from '@/lib/services/pricing.service';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = parseInt(params.id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Get available measures for this product
    const availableMeasures = await pricingService.getAvailableMeasuresForProduct(productId);

    // Build pricing matrix
    const pricingData = await Promise.all(
      availableMeasures.map(async (measure: any) => {
        const unitPrice = await pricingService.getPriceForUnit(productId, measure.id);

        return {
          measureId: measure.id,
          measureName: measure.name,
          measureShortName: measure.short_name,
          measureSymbol: measure.symbol,
          measureType: measure.type,
          unitPrice,
          priceType: unitPrice !== null ? 'specific' : 'unavailable',
          isAvailable: unitPrice !== null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        productId,
        availablePricing: pricingData.filter((p: any) => p.isAvailable),
        allMeasures: pricingData,
      },
    });
  } catch (error) {
    console.error('Error fetching product pricing:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
