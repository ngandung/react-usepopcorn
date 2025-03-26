import React, { useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import StarRating from './StarRating';

const root = ReactDOM.createRoot(document.getElementById('root'));


function Test() {
  const [rating, setRating] = useState(0);
 return <div>
  <StarRating maxStar={5} message={["Bad","Okay","Good","Great","Perfect"]} onSetRating={setRating} />
  <p>Rating saat ini adalah {rating}</p>
 </div>
}

root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Test />
    <StarRating maxStar={5} color="blue" />
  </React.StrictMode>
);

