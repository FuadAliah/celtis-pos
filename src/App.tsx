import { useRestaurant } from "./hooks/useRestaurant";
import { Header } from "./components/Layout/Header";
import { RestaurantView } from "./components/Restaurant/RestaurantView";
import { SalesHistory } from "./components/History/SalesHistory";

function App() {
  const { currentView } = useRestaurant();

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      {currentView === "pos" ? <RestaurantView /> : <SalesHistory />}
    </div>
  );
}

export default App;
