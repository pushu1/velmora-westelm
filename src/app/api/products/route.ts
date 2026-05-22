import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || undefined;
  const categorySlug = searchParams.get('categorySlug') || undefined;

  try {
    const products = await getProducts({ query, categorySlug });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
