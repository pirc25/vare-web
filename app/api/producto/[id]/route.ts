import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';

// GET - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const producto = await models.Producto.findByPk(params.id, {
      include: [{
        model: models.DetalleVenta,
        as: 'detallesVenta'
      }]
    });

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error('Error in GET /api/producto/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch producto' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar producto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { nombre, codigo, precioCompra, precioVenta, stock } = await request.json();

    const producto = await models.Producto.findByPk(params.id);

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar solo los campos proporcionados
    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (codigo !== undefined) updateData.codigo = codigo;
    if (precioCompra !== undefined) updateData.precioCompra = precioCompra;
    if (precioVenta !== undefined) updateData.precioVenta = precioVenta;
    if (stock !== undefined) updateData.stock = stock;

    await producto.update(updateData);

    return NextResponse.json(producto);
  } catch (error: any) {
    console.error('Error in PUT /api/producto/[id]:', error);
    
    // Manejar error de código duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'El código del producto ya existe' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update producto' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar producto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const producto = await models.Producto.findByPk(params.id);

    if (!producto) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el producto tiene ventas asociadas
    const detallesVenta = await models.DetalleVenta.findOne({
      where: { idProducto: params.id }
    });

    if (detallesVenta) {
      return NextResponse.json(
        { error: 'No se puede eliminar el producto porque tiene ventas asociadas' },
        { status: 400 }
      );
    }

    await producto.destroy();

    return NextResponse.json(
      { message: 'Producto eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/producto/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete producto' },
      { status: 500 }
    );
  }
}