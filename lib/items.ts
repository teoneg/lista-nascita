import { redis } from './redis';

export type ItemStatus = 'available' | 'reserved' | 'purchased';

export interface RegistryItem {
  id: string;
  name: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  price?: number;
  source?: string;
  isPrenatal?: boolean;
}

export interface ItemState {
  status: ItemStatus;
  // We explicitly do NOT store user names to keep it completely anonymous
  // even from the admin as per user request. We only store a session ID or 
  // email temporarily to allow the user who reserved it to un-reserve or purchase it.
  reservedByEmail?: string; 
  updatedAt?: number;
}

export interface EnrichedItem extends RegistryItem {
  state: ItemState;
}

// Key for the sorted set of all item IDs
const ITEMS_SET_KEY = 'items:all';

export async function getAllItems(): Promise<EnrichedItem[]> {
  // Get all item IDs
  const itemIds = await redis.smembers(ITEMS_SET_KEY);
  
  if (!itemIds || itemIds.length === 0) {
    return [];
  }

  const items: EnrichedItem[] = [];
  
  for (const id of itemIds) {
    const itemDataStr = await redis.get<string>(`item_data:${id}`);
    const itemStateStr = await redis.get<string>(`item_state:${id}`);
    
    if (itemDataStr) {
      const itemData = typeof itemDataStr === 'string' ? JSON.parse(itemDataStr) : itemDataStr;
      
      let state: ItemState = { status: 'available' };
      if (itemStateStr) {
        state = typeof itemStateStr === 'string' ? JSON.parse(itemStateStr) : itemStateStr;
      }
      
      items.push({
        ...itemData,
        state
      });
    }
  }
  
  return items;
}

export async function createOrUpdateItem(item: RegistryItem): Promise<void> {
  await redis.sadd(ITEMS_SET_KEY, item.id);
  await redis.set(`item_data:${item.id}`, JSON.stringify(item));
}

export async function deleteItem(id: string): Promise<void> {
  await redis.srem(ITEMS_SET_KEY, id);
  await redis.del(`item_data:${id}`);
  await redis.del(`item_state:${id}`);
}

export async function updateItemState(id: string, state: ItemState): Promise<void> {
  await redis.set(`item_state:${id}`, JSON.stringify(state));
}
