import './App.css';
import Timer from './components/timer';

function App() {
  return (
    <>
    <Timer title={"Timer"} endTime={10} elapsedTime={0}></Timer>
    </>
  );
}

export default App;
