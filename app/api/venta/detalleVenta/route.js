import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';



// POST - Crear nueva venta completa (con detalles)

export async function POST(request) {
  try {
    await initializeDatabase();
    const { 
      idCliente, 
      idUser,
      fechaVenta, 
      total, 
      estado,
      detalles // Array de productos de la venta
    } = await request.json();
    
    // Validar campos requeridos
    if (!idCliente || !idUser || !detalles || detalles.length === 0) {
      return NextResponse.json(
        { error: 'Campos requeridos: idCliente, idUser, detalles' },
        { status: 400 }
      );
    }

    // Crear la venta
    const venta = await models.Venta.create({ 
      idCliente, 
      idUser,
      fechaVenta: fechaVenta || new Date(),
      total: total || 0,
      estado: estado || 'pendiente'
    });

    // Crear los detalles de la venta
    let totalCalculado = 0;
    for (const detalle of detalles) {
      const detalleVenta = await models.DetalleVenta.create({
        idVenta: venta.idVenta,
        idProducto: detalle.idProducto,
        pedido: detalle.pedido,
        vareAnterior: detalle.vareAnterior,
        vareActual: detalle.vareActual,
        total: detalle.total
      });
      totalCalculado += parseFloat(detalle.total);
    }

    // Actualizar el total de la venta
    await venta.update({ total: totalCalculado });
    
    return NextResponse.json({ venta, totalCalculado }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/venta:', error);
    return NextResponse.json(
      { error: 'Failed to create venta' },
      { status: 500 }
    );
  }
}