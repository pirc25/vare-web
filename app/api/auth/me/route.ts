import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const usuario = await models.Usuario.findByPk(decoded.idUser, {
      attributes: ['idUser', 'usuario', 'email'] // Sin password
    });
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      idUser: usuario.idUsuario,
      usuario: usuario.usuario,
      email: usuario.email
    });

  } catch (error) {
    console.error('Error in auth/me:', error);
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    );
  }
}