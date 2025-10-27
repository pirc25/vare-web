import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    await initializeDatabase();
    const usuarios = await models.Usuario.findAll({
      attributes: ['idUsuario', 'usuario', 'email', 'created_at', 'updated_at'], // Sin password
      order: [['created_at', 'DESC']]
    });
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Error in GET /api/usuario:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usuarios' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { usuario, email, password } = await request.json();
    
    // Validar campos requeridos
    if (!usuario || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos: usuario, email, password' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    const nuevoUsuario = await models.Usuario.create({
      usuario,
      email,
      password
    });
    
    // Retornar sin password
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();
    return NextResponse.json(usuarioSinPassword, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/usuario:', error);
    
    // Manejar error de email/usuario duplicado
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
      { error: 'Failed to create usuario' },
      { status: 500 }
    );
  }
}