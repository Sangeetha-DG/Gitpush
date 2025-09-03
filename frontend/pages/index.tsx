
import { useState } from "react";


export default function Home() {
 const [ticker, setTicker] = useState("");
 const [items, setItems] = useState<{ ticker: string; price: string }[]>([]);


 const fetchPrice = async () => {
  if (!ticker.trim()) return;

  try {
    const res = await fetch(`http://localhost:4000/price/${ticker}`);
    const data = await res.json();

    const priceString = typeof data.price === "string" ? data.price : JSON.stringify(data.price);
    const match = priceString.match(/[\d,]+\.\d+/);
    const priceValue = match ? match[0] + " USD" : "Not available";

    if (!items.find((i) => i.ticker === ticker)) {
      setItems([...items, { ticker, price: priceValue }]);
    } else {
      setItems(items.map(i => i.ticker === ticker ? { ...i, price: priceValue } : i));
    }

    setTicker("");
  } catch (err) {
    console.error("Error fetching price:", err);
  }
};




 const removeItem = (t: string) => {
   setItems(items.filter((item) => item.ticker !== t));
 };


 return (
   <div style={{ padding: "4rem", fontFamily: "Arial",maxWidth: "400px" }}>
     <h1 className="text-2xl font-bold mb-4">Crypto Price Stream</h1>


     {/* Input + Button */}
     <div className="flex gap-2 mb-6 w-full">
       <input
         type="text"
         value={ticker}
         onChange={(e) => setTicker(e.target.value)}
         placeholder="Enter ticker e.g., BTCUSD"
         className="flex-1 bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
       />
       <button
         onClick={fetchPrice}
         className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
>
         Add
       </button>
     </div>


     {/* List of tickers */}
     <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
      
    
       {items
       .sort((a, b) => a.ticker.localeCompare(b.ticker))
       .map((item) => (
         <li
           key={item.ticker}
           style={{
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center',
               border: '1px solid #ccc',
               padding: '0.5rem',
               marginBottom: '0.5rem',
               borderRadius: '5px',
              
             }}
             >
           {item.ticker} :    ${item.price}
           <button
             onClick={() => removeItem(item.ticker)}
             //className="ml-2 text-red-600 font-bold hover:text-red-800"
           >
             ×
           </button>
           </li>
        
       ))}
       </ul>
     </div>
  
 );
}



