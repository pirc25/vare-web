import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';

// GET - Obtener todos los detalles
export async function GET() {
  try {
    await initializeDatabase();
    const detalles = await models.DetalleVenta.findAll({
      include: [
        {
          model: models.Venta,
          as: 'venta'
        },
        {
          model: models.Producto,
          as: 'producto'
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return NextResponse.json(detalles);
  } catch (error) {
    console.error('Error in GET /api/detalle-venta:', error);
    return NextResponse.json(
      { error: 'Failed to fetch detalles' },
      { status: 500 }
    );
  }
}

// POST - Agregar detalle a una venta existente
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { idVenta, idProducto, pedido, vareAnterior, vareActual, total } = await request.json();
    
    // Validar campos requeridos
    if (!idVenta || !idProducto || pedido === undefined || vareAnterior === undefined || vareActual === undefined || total === undefined) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos: idVenta, idProducto, pedido, vareAnterior, vareActual, total' },
        { status: 400 }
      );
    }

    // Verificar que la venta existe
    const venta = await models.Venta.findByPk(idVenta);
    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el producto existe
    const producto = await models.Producto.findByPk(idProducto);
    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    const detalle = await models.DetalleVenta.create({ 
      idVenta,
      idProducto,
      pedido,
      vareAnterior,
      vareActual,
      total
    });
    
    return NextResponse.json(detalle, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/detalle-venta:', error);
    return NextResponse.json(
      { error: 'Failed to create detalle' },
      { status: 500 }
    );
  }
}