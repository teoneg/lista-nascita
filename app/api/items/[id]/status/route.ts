import { NextRequest, NextResponse } from 'next/server';
import { updateItemState } from '@/lib/items';
import { isAdmin, getSessionEmail } from '@/lib/session';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await getSessionEmail();
    const admin = await isAdmin();
    
    if (!email && !admin) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }
    
    const { id } = await params;
    const { status } = await req.json();
    
    if (!['available', 'reserved', 'purchased'].includes(status)) {
      return NextResponse.json({ error: 'Stato non valido' }, { status: 400 });
    }

    const stateToSave = {
      status,
      // Se diventa available, puliamo il reservedByEmail. Altrimenti salviamo l'email per permettere a questa persona di cambiare idea.
      reservedByEmail: status === 'available' ? undefined : email || 'admin',
      updatedAt: Date.now()
    };

    await updateItemState(id, stateToSave);
    return NextResponse.json({ success: true, state: stateToSave });
  } catch (error) {
    console.error('Update item status error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
