import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"

import Create from "./pages/Create"
import List from "./pages/List"
import Details from "./pages/Details"
import Archives from "./pages/Archives"

import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout() {
	localStorage.clear()
	return <Navigate to="/login" />
}

function RegisterAndLogout() {
	localStorage.clear()
	return <Register />
}

function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					} />
					<Route path="/login" element={<Login />} />
					<Route path="/logout" element={<Logout />} />
					<Route path="/register" element={<RegisterAndLogout />} />
					<Route path="/create" element={
						<ProtectedRoute>
							<Create />
						</ProtectedRoute>
					} />
					<Route path="/list" element={
						<ProtectedRoute>
							<List />
						</ProtectedRoute>
					} />
					<Route path="/details/:id/*" element={
						<ProtectedRoute>
							<Details />
						</ProtectedRoute>
					} />
					<Route path="/details/:id/archives" element={
						<ProtectedRoute>
							<Archives />
						</ProtectedRoute>
					} />
					<Route path="*" element={<NotFound />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App