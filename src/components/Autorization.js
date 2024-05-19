// Импорты
import React, { useState } from 'react';
import { AutorizationContext } from '../context/context';
import AppRouter from './AppRouter';
import { HashRouter as Router } from 'react-router-dom';

/////////////////////////////////////////////////////

const Autorization = () => {
	// Состояния
	const [isAuth, setIsAuth] = useState(JSON.parse(localStorage.getItem('Auth')) || false); // Состояние авторизации
	const dataUsers = [
		{ login: 'Demo', password: 'Demo', defaultTheme: 'dark5' },
	] // База пользователей
	// /////////////////////
	// Отрисовка компонентов
	return (
		<AutorizationContext.Provider // Передача состояний авторизации по всем компонентам
			value={{
				isAuth, setIsAuth,
				dataUsers,
			}} // в value нужно добавлять состояния, которые ме хотим передать другим компонентам (для чистаемости: 1 строчка - 1 состояние и функция для управления им)
		>
			<Router>
				<AppRouter />
			</Router>
		</AutorizationContext.Provider>
	);
	// /////////////////////
}

export default Autorization;
