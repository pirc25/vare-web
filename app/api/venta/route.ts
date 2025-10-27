import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    await initializeDatabase();
    const ventas = await models.Venta.findAll();
    return NextResponse.json(ventas);
  } catch (error) {
    console.error('Error in GET /api/ventas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ventas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { idCliente, fechaVenta, total, estado } = await request.json();
    const venta = await models.Venta.create({ idCliente, fechaVenta, total, estado });
    return NextResponse.json(venta, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/ventas:', error);
    return NextResponse.json(
      { error: 'Failed to create venta' },
      { status: 500 }
    );
  }
}