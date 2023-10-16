import { Register, Login } from './components';
import { Routes, Route } from 'react-router-dom';

function App() {
	return (
		<main className="App">
			<Routes>
				{/* public routes */}
				<Route path='/login' element={<Login />}></Route>
				<Route path='/register' element={<Register />}></Route>
			</Routes>
		</main>
	);
}

export default App;
