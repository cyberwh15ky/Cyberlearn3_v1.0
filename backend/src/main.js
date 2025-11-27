const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const Redis = require('ioredis');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB and Redis (will connect via k8s service names)
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://cyberlearn:cyberlearnpass@postgres:5432/cyberlearn' });
const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');

/* demo in-memory fallback */
const products = {
  "p1": { id: "p1", name: "Sample Product A", likes: 0 },
  "p2": { id: "p2", name: "Sample Product B", likes: 0 }
};

app.get('/api/health', (req,res)=>res.json({ok:true}));
app.get('/api/products', async (req,res)=>{
  // try to read likes from redis
  for (const id of Object.keys(products)) {
    const k = `product:${id}:likes`;
    const val = await redis.get(k);
    if (val !== null) products[id].likes = parseInt(val,10);
  }
  res.json(Object.values(products));
});

app.post('/api/products/:id/like', async (req,res)=>{
  const id = req.params.id;
  const k = `product:${id}:likes`;
  await redis.incr(k);
  const val = await redis.get(k);
  res.json({ok:true, likes: parseInt(val,10)});
});

app.post('/api/cart/add', async (req,res)=>{
  const user = req.header('x-user-id') || 'anonymous';
  const item = req.body;
  const orderKey = `cart:${user}`;
  await redis.rpush(orderKey, JSON.stringify(item));
  const items = await redis.lrange(orderKey,0,-1);
  res.json({ok:true, cart: items.map(i=>JSON.parse(i))});
});

app.post('/api/checkout/create', async (req,res)=>{
  const orderId = uuidv4();
  // In production: create order in Postgres and create payment session with PSP
  res.json({ok:true, orderId, payment_url: "https://example.payment/"+orderId});
});

app.post('/api/ai/query', async (req,res)=>{
  const q = req.body.q || '';
  const denied = ['bomb','illegal','hack'];
  for (const d of denied) if (q.toLowerCase().includes(d)) return res.status(400).json({error:'query not allowed'});
  res.json({ok:true, answer: `Demo AI suggestion for '${q}': try product p1`});
});

const port = process.env.PORT || 4000;
app.listen(port, ()=>console.log('Backend listening on', port));