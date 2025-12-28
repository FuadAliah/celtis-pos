import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='max-w-7xl m-auto p-8 text-center'>
      <div className='flex justify-center items-center gap-4'>
        <a href='https://vite.dev' target='_blank'>
          <img
            src={viteLogo}
            className='h-24 p-6 will-change-[filter] transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]'
            alt='Vite logo'
          />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img
            src={reactLogo}
            className='h-24 p-6 will-change-[filter] transition-[filter] duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] animate-[spin_20s_linear_infinite]'
            alt='React logo'
          />
        </a>
      </div>
      <h1 className='text-2xl font-bold text-red-600'>Vite + React</h1>
      <div className='p-8'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='text-gray-500'>Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
