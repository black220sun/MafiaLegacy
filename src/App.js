// Импорты
import React, { useState } from 'react';
import './styles/App.css'
import './styles/Themes.css'
import { StoreContext } from './context/context';
import Autorization from './components/Autorization';
import { Helmet } from 'react-helmet';
import IconSite from './media/img/ico/iconSite.png';
/////////////////////////////////////////////////////

const App = () => {
	// Глобальные состояния 
	const [pageNow, setPageNow] = useState('/start') // Состояние нынешней страницы (на другие попасть невозможно)
	const [isGameRolesChanged, setIsGameRolesChanged] = useState(false); // Состояние-блокировщик добавления дефолтных ролей/слотов в roleData/slotData (в RandomBlock), чтобы они не добавлялись при обновлении страницы, а только при изменении кол-ва игроков
	const [roles, setRoles] = useState(
		{
			civilian: { name: 'Мирный', smile: '🔴', value: null, description: 'Cамая многочисленная роль в игре. Их задача - вычислить игроков команды мафии и устранить их всех на дневном голосовании. Ночью не ходят. Побеждают, когда устранены все игроки команды мафия, а также устранен маньяк (при наличии).' },
			mafia: { name: 'Мафия', smile: '⚫️', value: null, description: 'Вторая по многочисленности роль в игре. Мафий в начале игры всегда меньше, чем игроков города, но они знают друг друга. Их задача - устранить игроков команды мирных. В ночном чате они договариваются, какого игрока убить, и обсуждают дневную тактику, чтобы отвести от себя подозрения мирных. Может убить ТОЛЬКО одного игрока за ночь. Команда побеждает, когда кол-во игроков Мафии равно кол-ву игроков мирных и устранен маньяк(при наличии).' },
			don: { name: 'Дон', smile: '🕵️', value: null, description: 'Играет в команде мафии. Просыпается ночью вместе мафией, они выбирают кого этой ночью убить, и его голос считается решающим. Далее мафия засыпает и Дон делает проверку одного игрока на комиссара.' },
			commissar: { name: 'Комиссар', smile: '⭐', value: null, description: 'Играет в команде мирных. Ночью может проверить одного игрока на мафию.' },
			doctor: { name: 'Доктор', smile: '💉', value: null, description: 'Играет в команде мирных. Ночью может спасти одного игрока от выстрела мафии. Доктор не может спасать одного и того-же игрока 2 раза подряд.' },
			// key (civilian, mafia итд) - Это ключ для получения роли в целом и управление её.
			// smile - Это смайлик роли
			// name (мирный, мафия итд) - Это название роли, которое будет отображаться в рандоме и других местах (Только тут можно менять смайлики ролей).
			// value (null) - Это кол-во данной роли в игре, меняется в Parametres.jsx setRoles в зависимости от кол-ва игроков.
			// description - Это описание роли, её цель в игре, и вся нужная информация. (Применяется в блоке ModalRoles в котором можно узнать информацию о всех ролях)
		}) // Все роли в игре. Сюда можно добавлять новые, и в Parametres.jsx setRoles указывать условия роли (кол-во игроков и кол-во ролей)
	const [gameParametres, setGameParametres] = useState({
		valuePlayers: null, // Кол-во игроков
		players: [], // Игроки в данной игре (шаблон игрока ниже в состоянии Player)
		roles: [], // Роли в данной игре (roles генерятся в parametres и после начала игры сохраняются сюда)
		fallsMax: null, // Кол-во фолов разрешенных в игре (по дефолту null - т.е запрещены, можно переключателем Switch3 переключить на 4 null 5)
		plus30: false, // Разрешены ли дополнительные +30 секунд на речи, переключаются Switch2. (plus 30 - это добавление +30 секунд во время речи. При использовании данной фукнции +30 секунд можно брать одному игроку 1 раз за всю игру)
		badWords: false, // Разрешена ли ненормативная лексика в игре. true - запрещена / false - разрешена. (Если ненормативная лексика в игре запрещена и игрок сказал мат - ему дается 1 фолл)
		voted: [], // Игроки, выставленные на голосование (используется во время голосования на кик)
		kicked: [], // Кикнутые игроки, для дальнейшей статистики (Хоронология киков) Result
		winner: null, // Победитель в Игре (Используется после завершения игры для подведения итогов)
		time: 0, // Длительность игры (Используется после завершения игры для подведения итогов)
		date: null, // Дата игры (Для истории игр)
		bot: false
	}) // Параметры игры. можно мере масштабирования приложения добавлять новые параметры. 
	const [player, setPlayer] = useState({
		id: 1, // ID игрока
		nickname: '',
		role: '', // Роль игрока
		vote: false, // Выставлен ли игрок на голосование (true - выставлен / false - не выставлен)
		kick: false, // Выбыл ли игрок из игры, будь то: 1) Кик на дневном голосовании / 2) Убийство ночью / 3) Поднятие по фоллам
		falls: null, // Кол-во фолов (от 0 до fallsMax), которое взял игрок. Если игрок взял максимальное кол-во фоллов (falls === fallsMax) - он автоматически кикается (kick: true)
		plus30: false, // Использовал/Не использовал plus30. (true - использовал / false - не использовал)
	}) // Параметры игрока. можно мере масштабирования приложения добавлять новые параметры. 
	const [defaultRoles, setDefaultRoles] = useState([]) // Состояние дефолтных ролей до рандома
	const [startGame, setStartGame] = useState(JSON.parse(localStorage.getItem('startGame')) || false) // Состояние начатой игры
	const [modalThemes, setModalThemes] = useState(false) // Модальное окно с Темами
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'default') // Состояние темы
	const [offEffects, setOffEffects] = useState(JSON.parse(localStorage.getItem('offEfects')) || false); // Состояние отключения эффектов
	const [bot, setBot] = useState(JSON.parse(localStorage.getItem('bot')) || false); // Состояние запрещена ли ненормативная лексика
	// /////////////////////////////////////////////////////////
	// Отрисовка компонентов
	return (
		<StoreContext.Provider // Передача состояний отсюда по всем компонентам
			value={{
				pageNow, setPageNow, // Текущая страница
				gameParametres, setGameParametres, // Игровые параметры
				player, setPlayer, // Игрок
				roles, setRoles, // Роли
				isGameRolesChanged, setIsGameRolesChanged, // Зарандомлены ли роли
				defaultRoles, setDefaultRoles, // Дефолтные роли до рандома
				startGame, setStartGame, // Начата игра
				modalThemes, setModalThemes, // Модальное окно с Темами
				theme, setTheme, // Тема
				offEffects, setOffEffects, // Откл эффектов
				bot, setBot, // Игра с ботом / без бота
			}} // в value нужно добавлять состояния, которые ме хотим передать другим компонентам (для чистаемости: 1 строчка - 1 состояние и функция для управления им)
		>
			<div className={`App ${theme}`}>
				<Helmet>
					<link rel="icon" type="image/png" href={IconSite} />
				</Helmet>
				<Autorization />
			</div>
		</StoreContext.Provider>
	);
	// /////////////////////////////////////
}

export default App;
