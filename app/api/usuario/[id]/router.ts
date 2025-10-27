import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';

// GET - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const usuario = await models.Usuario.findByPk(params.id, {
      attributes: ['idUsuario', 'usuario', 'email', 'createdAt', 'updatedAt'], // Sin password
      include: [{
        model: models.Venta,
        as: 'ventas',
        include: [{
          model: models.Cliente,
          as: 'cliente'
        }]
      }]
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Error in GET /api/usuario/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usuario' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const { usuario, email, password } = await request.json();

    const usuarioExistente = await models.Usuario.findByPk(params.id);

    if (!usuarioExistente) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
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
    if (usuario !== undefined) updateData.usuario = usuario;
    if (email !== undefined) updateData.email = email;
    if (password !== undefined) updateData.password = password;

    await usuarioExistente.update(updateData);

    // Retornar sin password
    const { password: _, ...usuarioActualizado } = usuarioExistente.toJSON();
    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    console.error('Error in PUT /api/usuario/[id]:', error);
    
    // Manejar error de duplicado
    const err: any = error;
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors[0]?.path;
      if (field === 'email') {
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 409 }
        );
      } else if (field === 'usuario') {
        return NextResponse.json(
          { error: 'El nombre de usuario ya existe' },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to update usuario' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initializeDatabase();
    const usuario = await models.Usuario.findByPk(params.id);

    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el usuario tiene ventas asociadas
    const ventas = await models.Venta.findOne({
      where: { idUsuario: params.id }
    });

    if (ventas) {
      return NextResponse.json(
        { error: 'No se puede eliminar el usuario porque tiene ventas asociadas' },
        { status: 400 }
      );
    }

    await usuario.destroy();

    return NextResponse.json(
      { message: 'Usuario eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/usuario/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete usuario' },
      { status: 500 }
    );
  }
}