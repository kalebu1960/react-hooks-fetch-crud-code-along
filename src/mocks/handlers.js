import { rest } from 'msw';

const initialItems = [
  { id: 1, name: "Yogurt", category: "Dairy", isInCart: false },
  { id: 2, name: "Pomegranate", category: "Produce", isInCart: false }
];

let items = [...initialItems];
let nextId = 3;

export function resetData() {
  items = [...initialItems];
  nextId = 3;
}

export const handlers = [
  rest.get('http://localhost:4000/items', (req, res, ctx) => {
    return res(ctx.json(items));
  }),
  
  rest.post('http://localhost:4000/items', async (req, res, ctx) => {
    const newItem = await req.json();
    const createdItem = { id: nextId++, ...newItem };
    items.push(createdItem);
    return res(ctx.json(createdItem));
  }),
  
  rest.patch('http://localhost:4000/items/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const updates = await req.json();
    const index = items.findIndex(item => item.id === Number(id));
    
    if (index === -1) return res(ctx.status(404));
    
    items[index] = { ...items[index], ...updates };
    return res(ctx.json(items[index]));
  }),
  
  rest.delete('http://localhost:4000/items/:id', (req, res, ctx) => {
    const { id } = req.params;
    items = items.filter(item => item.id !== Number(id));
    return res(ctx.status(200));
  })
];