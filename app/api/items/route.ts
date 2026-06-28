import { NextRequest, NextResponse } from 'next/server';
import { getAllItems, createOrUpdateItem, deleteItem } from '@/lib/items';
import { isAdmin, getSessionEmail } from '@/lib/session';

export async function GET() {
  try {
    const items = await getAllItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Get items error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    
    const item = await req.json();
    if (!item.id || !item.name) {
      return NextResponse.json({ error: 'Dati incompleti' }, { status: 400 });
    }

    await createOrUpdateItem(item);
    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Create item error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID mancante' }, { status: 400 });
    }

    await deleteItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete item error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
