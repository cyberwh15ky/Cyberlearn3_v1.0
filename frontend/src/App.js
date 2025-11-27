import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
function App(){
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  useEffect(()=> {
    axios.get('/api/products').then(r=>setProducts(r.data)).catch(()=>{});
  },[]);
  return (
    <div style={{padding:20}}>
      <h1>{t('welcome')}</h1>
      <div>
        <label>Language:</label>
        <select onChange={e=>i18n.changeLanguage(e.target.value)} defaultValue="zh-TW">
          <option value="zh-TW">繁體</option>
          <option value="zh-CN">简体</option>
          <option value="en">English</option>
        </select>
      </div>
      <h2>{t('products')}</h2>
      <ul>
        {products.map(p=>(
          <li key={p.id}>
            {p.name} — Likes: {p.likes}
            <button onClick={()=>axios.post('/api/products/'+p.id+'/like').then(()=>window.location.reload())}>Like</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;