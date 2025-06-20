import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";

import NotificationBadge from "@components/services/badges/notification-badge";
import MenuItemComponent from "@components/ui/menu-item";
import MenuListComponent from "@components/ui/menu-list";
import useMainClient from "@hooks/useMainClient";
import i18n from "@service/i18n";
import useFriendsStore from "@store/friends";
import { Pages } from "@custom-types/enums";

import "./menu.scss";

// Компонент главного меню. Отрисовывается на каждой странице
export default function MenuComponent() {
	const friendsNotification = useFriendsStore(state => state.friendsNotification);

	const { mainApi } = useMainClient();
	const navigate = useNavigate();

	// Получаем уведомления для отрисовки в Badge
	useEffect(() => {
		// Уведомления для друзей
		mainApi.getFriendsNotification();

		// Уведомления для сообщений
		mainApi.getMessageNotification();
	}, []);

	// При изменении непрочитанных сообщений в чатах изменяем количество чатов, содержащих непрочитанные сообщения
	// useEffect(() => {
	//     const unReadChats = Object.keys(unRead);

	//     dispatch(setMessageNotification(unReadChats.length));
	// }, [unRead]);

	return <div className="menu" data-testid="menu">
		<nav className="menu__nav">
			<MenuListComponent>
				<MenuItemComponent className="menu__nav__item" onClick={() => navigate(Pages.profile)} data-testid="menu-profile">
					<AccountCircleOutlinedIcon color="primary" />

					<div className="menu__nav__item__title">
						{i18n.t("menu.profile")}
					</div>
				</MenuItemComponent>

				<MenuItemComponent className="menu__nav__item" onClick={() => navigate(Pages.messages)} data-testid="menu-friends">
					<MessageOutlinedIcon color="primary" />

					<div className="menu__nav__item__title">
						{i18n.t("menu.messanger")}
					</div>

					<NotificationBadge content={""} />
				</MenuItemComponent>

				<MenuItemComponent className="menu__nav__item" onClick={() => navigate(Pages.friends)} data-testid="menu-messenger">
					<PeopleOutlinedIcon color="primary" />
                    
					<div className="menu__nav__item__title">
						{i18n.t("menu.friends")}
					</div>

					<NotificationBadge content={friendsNotification ? friendsNotification.toString() : ""} />
				</MenuItemComponent>

				<MenuItemComponent className="menu__nav__item" onClick={() => navigate(Pages.photos)}>
					<CameraAltIcon color="primary" />
                    
					<div className="menu__nav__item__title">
						{i18n.t("menu.photos")}
					</div>
				</MenuItemComponent>
			</MenuListComponent>
		</nav>

		<div className="menu__down-info">
			{i18n.t("menu.to-developers")}
		</div>
	</div>;
};