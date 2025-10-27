import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';

// GET - Obtener todos los productos
export async function GET() {
  try {
    await initializeDatabase();
    const productos = await models.Producto.findAll({
      order: [['createdAt', 'DESC']]
    });
    return NextResponse.json(productos);
  } catch (error) {
    console.error('Error in GET /api/producto:', error);
    return NextResponse.json(
      { error: 'Failed to fetch productos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { nombre, codigo, precioCompra, precioVenta, stock } = await request.json();
    
    // Validar campos requeridos
    if (!nombre || !codigo || precioCompra === undefined || precioVenta === undefined) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos: nombre, codigo, precioCompra, precioVenta' },
        { status: 400 }
      );
    }

    const producto = await models.Producto.create({ 
      nombre, 
      codigo, 
      precioCompra, 
      precioVenta, 
      stock: stock || 0 
    });
    
    return NextResponse.json(producto, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/producto:', error);
    
    // Manejar error de código duplicado
    const err: any = error;
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'El código del producto ya existe' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create producto' },
      { status: 500 }
    );
  }
}