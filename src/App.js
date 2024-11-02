import './App.css';
import Timer from './components/timer';

function App() {
  return (
    <>
    <Timer title={"My Timer"} endTime={15} elapsedTime={10}></Timer>
    </>
  );
}

export default App;
