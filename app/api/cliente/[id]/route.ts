import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';

// GET - Obtener cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const cliente = await models.Cliente.findByPk(params.id, {
      include: [{
        model: models.Venta,
        as: 'ventas'
      }]
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error('Error in GET /api/cliente/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cliente' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { 
      nombre, 
      identifacion, 
      celular, 
      fechaNacimiento, 
      direccion, 
      tipoDocumento, 
      email 
    } = await request.json();

    const cliente = await models.Cliente.findByPk(params.id);

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    // Validar email si se proporciona
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Formato de email inválido' },
          { status: 400 }
        );
      }
    }

    // Actualizar solo los campos proporcionados
    const updateData: any = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (identifacion !== undefined) updateData.identifacion = identifacion;
    if (celular !== undefined) updateData.celular = celular;
    if (fechaNacimiento !== undefined) updateData.fechaNacimiento = fechaNacimiento;
    if (direccion !== undefined) updateData.direccion = direccion;
    if (tipoDocumento !== undefined) updateData.tipoDocumento = tipoDocumento;
    if (email !== undefined) updateData.email = email;

    await cliente.update(updateData);

    return NextResponse.json(cliente);
  } catch (error) {
    console.error('Error in PUT /api/cliente/[id]:', error);
    
    // Manejar error de email duplicado
    const err: any = error;
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update cliente' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const cliente = await models.Cliente.findByPk(params.id);

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el cliente tiene ventas asociadas
    const ventas = await models.Venta.findOne({
      where: { idCliente: params.id }
    });

    if (ventas) {
      return NextResponse.json(
        { error: 'No se puede eliminar el cliente porque tiene ventas asociadas' },
        { status: 400 }
      );
    }

    await cliente.destroy();

    return NextResponse.json(
      { message: 'Cliente eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/cliente/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete cliente' },
      { status: 500 }
    );
  }
}