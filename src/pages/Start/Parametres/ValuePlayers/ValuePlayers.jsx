// Импорты
import React, { useEffect, useContext } from 'react';
import style from './ValuePlayers.module.css';
import { StoreContext } from '../../../../context/context';
import InfoBlock from '../../../../components/UI/InfoBlock/InfoBlock';
/////////////////////////////////////////////////////

const ValuePlayers = ({ valuePlayers, setValuePlayers, useDoctor }) => {
	// Состояния
	const { roles, setRoles, setGameParametres, setIsGameRolesChanged, setDefaultRoles, theme } = useContext(StoreContext); // Получение состояний из глобального хранилища
	// /////////////////////////////////////////////////////////

	// Функционал

	const stateArr = {
		OFF: valuePlayers === '#',
	} // Передача состояния селекта, для стилей дисплея

	// Управление Кол-ва игроков и Ролей
	useEffect(() => {

		setGameParametres(prevParams => ({
			...prevParams,
			valuePlayers: Number(valuePlayers),
		})) // Установка/Обновление кол-ва игроков


		setRoles(prevRoles => ({
			...prevRoles,
			civilian: {
				...prevRoles.civilian,
				value: valuePlayers >= 12 ? 5
					: valuePlayers >= 9 ? 6
					: valuePlayers >= 6 ? valuePlayers - (useDoctor ? 4 : 3)
					: null
			}, // Условия кол-ва игроков для кол-ва роли Мирный
			mafia: {
				...prevRoles.mafia,
				value: valuePlayers >= 15 ? 4
					: valuePlayers >= 12 ? 3
					: valuePlayers >= 10 ? 2
					: valuePlayers >= 6 ? 1
					: null
			}, // Условия кол-ва игроков для кол-ва роли Мафия
			don: {
				...prevRoles.don,
				value: valuePlayers >= 6 ? 1 : null
			}, // Условия кол-ва игроков для кол-ва роли Дон
			commissar: {
				...prevRoles.commissar,
				value: valuePlayers >= 6 ? 1 : null
			}, // Условия кол-ва игроков для кол-ва роли Комиссар
			doctor: {
				...prevRoles.doctor,
				value: valuePlayers >= 11 || useDoctor ? 1 : null
			}, // Условия кол-ва игроков для кол-ва роли Доктор
		})); // Установка/Обновление кол-ва и тип ролей на игру
		localStorage.setItem('valuePlayers', String(valuePlayers)); // Сохранение кол-ва игроков в localStorage
	}, [valuePlayers, useDoctor]); // Установка/Обновление кол-ва игроков и тип ролей на игру (какие роли будут в игре)

	useEffect(() => {
		const rolesArray = []; // Локальный массив ролей

		// Добавление дефолтных ролей
		if (roles.civilian.value) {
			rolesArray.push(...Array(roles.civilian.value).fill([roles.civilian.name, roles.civilian.smile].join(' ')));
		} // Мирный
		if (roles.mafia.value) {
			rolesArray.push(...Array(roles.mafia.value).fill([roles.mafia.name, roles.mafia.smile].join(' ')));
		} // Мафия
		if (roles.don.value) {
			rolesArray.push(...Array(roles.don.value).fill([roles.don.name, roles.don.smile].join(' ')));
		} // Дон
		if (roles.commissar.value) {
			rolesArray.push(...Array(roles.commissar.value).fill([roles.commissar.name, roles.commissar.smile].join(' ')));
		} // Комиссар
		if (roles.doctor.value) {
			rolesArray.push(...Array(roles.doctor.value).fill([roles.doctor.name, roles.doctor.smile].join(' ')));
		} // Доктор
		// ///////////////////////////////

		setDefaultRoles(
			rolesArray.map((role, index) => ({
				id: `${index + 1}`,
				role: role,
			}))) // Установка/Обновление дефолтных ролей
		setGameParametres((prevParams) => ({
			...prevParams,
			roles: roles,
		})); // добавление roles в gameParametres.roles
	}, [valuePlayers, roles, useDoctor]); // Установка/Обновление дефолтных ролей (прямое добавление ролей в массив) / Добавление roles в gameParametres.roles


	const handleSelectChange = (event) => {
		const selectedValue = event.target.value;
		setValuePlayers(parseInt(selectedValue));
		setIsGameRolesChanged(true);
	}; // Установка/Изменение кол-ва игроков в gameParametres через select "players"

	// /////////////////////////////////

	// Отрисовка компонентов
	return (
		<div className='parametr'>
			<div>КОЛ-ВО ИГРОКОВ:</div>
			<div className={`${style.selectBlock} ${theme} selectBlock ${valuePlayers !== '#' ? 'selectBlockON' : ''}`}>
				<InfoBlock classes={stateArr}>
					<select
						name="players"
						value={valuePlayers}
						onChange={handleSelectChange}
					>
						<option value='#' disabled>#</option>
						<option value={6}>6</option>
						<option value={7}>7</option>
						<option value={8}>8</option>
						<option value={9}>9</option>
						<option value={10}>10</option>
					</select>
				</InfoBlock>
			</div>
		</div> // Кол-во игроков
	);
	// /////////////////////////////////////
}

export default ValuePlayers;
