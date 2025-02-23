// app/api/currency/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetCurrency = searchParams.get('to') || 'USD';
  
  try {
    // Replace with your actual API key and endpoint
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
    const data = await res.json();
    
    if (!data.rates[targetCurrency]) {
      return NextResponse.json({ error: 'Currency not supported' }, { status: 400 });
    }
    
    const conversionRate = data.rates[targetCurrency];
    return NextResponse.json({ conversionRate });
  } catch (error) {
    console.error('Error fetching conversion rate:', error);
    return NextResponse.json({ error: 'Failed to fetch conversion rate' }, { status: 500 });
  }
}
