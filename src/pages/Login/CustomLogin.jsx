// Импорты
import React from 'react';
import style from './CustomLogin.module.css';
import Login from './Login';
/////////////////////////////////////////////////////

const CustomLogin = () => {
	// Отрисовка компонентов
	return (
		<div className={style.login}>
			<video src="https://i.imgur.com/50L3hwC.mp4" className={style.video} autoPlay muted loop></video> {/* Видеофон */}
			<div className={style.glass}></div> {/* Затемнение заднего фона */}
			<h1 className={style.h1}>MEOWFIA</h1> {/* Заголовок с названием игры */}
			<div className={style.infoAuth}>
				<h2 className={style.h2}>Originally developed by Liunamme</h2> {/* Заголовок с автором приложения */}
			</div>
			<Login /> {/* Компонент авторизации (поле пароль и кнопка войти) */}
		</div>
	);
	// /////////////////////////////////////
}

export default CustomLogin;
