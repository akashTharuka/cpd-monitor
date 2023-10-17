import { Register, Login, HomePage, AdminDashboard, OrgDashboard } from './components';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';

function App() {
	return (
		<main className="App">
			<Routes>
				{/* public routes */}
				<Route path='/' element={<Register />}></Route>
				<Route path='/login' element={<Login />}></Route>

				{/* protected routes */}
				<Route element={<RequireAuth />}>
					<Route path='/home' element={<HomePage />}></Route>
					<Route path='/admindash' element={<AdminDashboard />}></Route>
					<Route path='/orgdash' element={<OrgDashboard />}></Route>
				</Route>
			</Routes>
		</main>
	);
}

export default App;
