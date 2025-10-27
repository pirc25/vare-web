import { NextRequest, NextResponse } from 'next/server';
import models from '@/models';
import { initializeDatabase } from '@/lib/init-db';

// GET - Obtener todos los clientes
export async function GET() {
  try {
    await initializeDatabase();
    const clientes = await models.Cliente.findAll({
      order: [['createdAt', 'DESC']]
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error in GET /api/cliente:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clientes' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo cliente
export async function POST(request: NextRequest) {
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
    
    // Validar campos requeridos
    if (!nombre || !identifacion || !celular || !fechaNacimiento || !direccion || !email) {
      return NextResponse.json(
        { error: 'Campos requeridos: nombre, identifacion, celular, fechaNacimiento, direccion, email' },
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

    const cliente = await models.Cliente.create({ 
      nombre, 
      identifacion, 
      celular, 
      fechaNacimiento, 
      direccion, 
      tipoDocumento, 
      email 
    });
    
    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/cliente:', error);
    
    // Manejar error de email duplicado
    const err: any = error;
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create cliente' },
      { status: 500 }
    );
  }
}