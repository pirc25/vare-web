import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase();
    const { usuario, password } = await request.json();

    if (!usuario || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Buscar usuario (sin encriptación por simplicidad)
    const user = await models.Usuario.findOne({
      where: { usuario, password }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Crear token JWT simple
    const token = jwt.sign(
      { 
        idUser: user.idUsuario, 
        usuario: user.usuario,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      token,
      user: {
        idUser: user.idUsuario,
        usuario: user.usuario,
        email: user.email
      },
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}