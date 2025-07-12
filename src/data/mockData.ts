export interface SwapRequest {
  id: string;
  itemId: string;
  requesterId: string;
  ownerId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface ClothingItem {
  id: string;
  title: string;
  description: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'footwear';
  size: string;
  condition: 'new' | 'excellent' | 'good' | 'fair';
  points: number;
  images: string[];
  primaryImage: string;
  tags: string[];
  ownerId: string;
  ownerUsername: string;
  status: 'available' | 'swapped' | 'pending' | 'reserved';
  createdAt: string;
  isHot?: boolean;
  watchersCount?: number;
  swapRequests?: SwapRequest[];
}

let itemIdCounter = 7;

export const mockItems: ClothingItem[] = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket in excellent condition. Perfect for layering in spring and fall.',
    category: 'outerwear',
    size: 'M',
    condition: 'excellent',
    points: 45,
    images: [
      'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    primaryImage: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['vintage', 'casual', 'denim'],
    ownerId: '2',
    ownerUsername: 'Anisha',
    status: 'available',
    createdAt: '2024-01-15T10:30:00Z',
    isHot: true,
    watchersCount: 12
  },
  {
    id: '2',
    title: 'Nike Air Max Sneakers',
    description: 'Comfortable running shoes in great condition. Size 9.5, perfect for daily wear.',
    category: 'footwear',
    size: '9.5',
    condition: 'good',
    points: 60,
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    primaryImage: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['athletic', 'nike', 'sneakers'],
    ownerId: '1',
    ownerUsername: 'Rakshita',
    status: 'available',
    createdAt: '2024-01-14T15:20:00Z',
    watchersCount: 8
  },
  {
    id: '3',
    title: 'Elegant Black Dress',
    description: 'Perfect little black dress for formal occasions. Size S, worn only once.',
    category: 'tops',
    size: 'S',
    condition: 'excellent',
    points: 55,
    images: [
      'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    primaryImage: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['formal', 'elegant', 'black'],
    ownerId: '3',
    ownerUsername: 'TestUser',
    status: 'available',
    createdAt: '2024-01-13T09:15:00Z',
    isHot: true,
    watchersCount: 15
  },
  {
    id: '4',
    title: 'Cozy Wool Sweater',
    description: 'Warm and comfortable wool sweater in cream color. Perfect for winter.',
    category: 'tops',
    size: 'L',
    condition: 'good',
    points: 40,
    images: [
      'https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    primaryImage: 'https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['warm', 'wool', 'winter'],
    ownerId: '1',
    ownerUsername: 'Rakshita',
    status: 'available',
    createdAt: '2024-01-12T14:45:00Z',
    watchersCount: 6
  },
  {
    id: '5',
    title: 'Dark Wash Jeans',
    description: 'Slim fit dark wash jeans in excellent condition. Size 32/32.',
    category: 'bottoms',
    size: '32/32',
    condition: 'excellent',
    points: 35,
    images: [
      'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    primaryImage: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['jeans', 'slim-fit', 'dark-wash'],
    ownerId: '2',
    ownerUsername: 'Anisha',
    status: 'available',
    createdAt: '2024-01-11T16:30:00Z',
    watchersCount: 9
  },
  {
    id: '6',
    title: 'Summer Floral Top',
    description: 'Light and breezy floral top perfect for summer days. Size M.',
    category: 'tops',
    size: 'M',
    condition: 'good',
    points: 25,
    images: [
      'https://images.pexels.com/photos/1631178/pexels-photo-1631178.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    primaryImage: 'https://images.pexels.com/photos/1631178/pexels-photo-1631178.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['floral', 'summer', 'casual'],
    ownerId: '3',
    ownerUsername: 'TestUser',
    status: 'available',
    createdAt: '2024-01-10T11:20:00Z',
    watchersCount: 4
  }
];

export const addNewItem = (item: Omit<ClothingItem, 'id' | 'createdAt'>) => {
  const newItem: ClothingItem = {
    ...item,
    id: (itemIdCounter++).toString(),
    createdAt: new Date().toISOString()
  };
  mockItems.unshift(newItem);
  return newItem;
};

export const updateItemStatus = (itemId: string, status: ClothingItem['status']) => {
  const itemIndex = mockItems.findIndex(item => item.id === itemId);
  if (itemIndex !== -1) {
    mockItems[itemIndex] = { ...mockItems[itemIndex], status };
    return mockItems[itemIndex];
  }
  return null;
};

export const categories = [
  { id: 'tops', name: 'Tops', icon: '👕' },
  { id: 'bottoms', name: 'Bottoms', icon: '👖' },
  { id: 'outerwear', name: 'Outerwear', icon: '🧥' },
  { id: 'footwear', name: 'Footwear', icon: '👟' }
];

export const conditions = [
  { value: 'new', label: 'New with tags' },
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' }
];

export const sizes = [
  'XS', 'S', 'M', 'L', 'XL', 'XXL', 
  '6', '7', '8', '9', '9.5', '10', '10.5', '11', '11.5', '12',
  '28/30', '30/30', '30/32', '32/30', '32/32', '34/32', '36/32'
];