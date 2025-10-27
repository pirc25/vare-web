import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';

// GET - Obtener venta por ID con todos sus detalles
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const venta = await models.Venta.findByPk(params.id, {
      include: [
        {
          model: models.Cliente,
          as: 'cliente',
          attributes: ['idCliente', 'nombre', 'email', 'celular']
        },
        {
          model: models.Usuario,
          as: 'usuario',
          attributes: ['idUser', 'usuario', 'email']
        },
        {
          model: models.DetalleVenta,
          as: 'detalles',
          include: [{
            model: models.Producto,
            as: 'producto',
            attributes: ['idProducto', 'nombre', 'codigo', 'precioVenta']
          }]
        }
      ]
    });

    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(venta);
  } catch (error) {
    console.error('Error in GET /api/venta/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venta' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar venta y sus detalles
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { 
      idCliente, 
      idUser,
      fechaVenta, 
      estado,
      detalles // Nuevos detalles (reemplazarán los existentes)
    } = await request.json();

    const venta = await models.Venta.findByPk(params.id);

    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar datos de la venta
    const updateData: any = {};
    if (idCliente !== undefined) updateData.idCliente = idCliente;
    if (idUser !== undefined) updateData.idUser = idUser;
    if (fechaVenta !== undefined) updateData.fechaVenta = fechaVenta;
    if (estado !== undefined) updateData.estado = estado;

    await venta.update(updateData);

    // Si se proporcionan nuevos detalles, actualizar
    if (detalles && detalles.length > 0) {
      // Eliminar detalles existentes
      await models.DetalleVenta.destroy({
        where: { idVenta: params.id }
      });

      // Crear nuevos detalles
      let totalCalculado = 0;
      for (const detalle of detalles) {
        await models.DetalleVenta.create({
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
    }

    // Retornar venta actualizada con detalles
    const ventaActualizada = await models.Venta.findByPk(params.id, {
      include: [
        {
          model: models.Cliente,
          as: 'cliente'
        },
        {
          model: models.Usuario,
          as: 'usuario'
        },
        {
          model: models.DetalleVenta,
          as: 'detalles',
          include: [{
            model: models.Producto,
            as: 'producto'
          }]
        }
      ]
    });

    return NextResponse.json(ventaActualizada);
  } catch (error) {
    console.error('Error in PUT /api/venta/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update venta' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar venta y sus detalles
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const venta = await models.Venta.findByPk(params.id);

    if (!venta) {
      return NextResponse.json(
        { error: 'Venta no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar primero los detalles de venta
    await models.DetalleVenta.destroy({
      where: { idVenta: params.id }
    });

    // Luego eliminar la venta
    await venta.destroy();

    return NextResponse.json(
      { message: 'Venta y sus detalles eliminados exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/venta/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete venta' },
      { status: 500 }
    );
  }
}