import ChangeAvatarComponent, { type IUpdatedAvatar } from "@components/ui/change-avatar";
import GridComponent from "@components/ui/grid";
import PaperComponent from "@components/ui/paper";
import PhotoComponent from "@components/ui/photo";
import useProfile from "@hooks/useProfile";
import i18next from "@service/i18n";
import useProfileStore from "@store/profile";

import "./main-photo.scss";

// Компонент главной фотографии пользователя (его аватара)
export default function MainPhoto() {
	const loading = useProfileStore(state => state.isDeleteAvatarLoading);

	const profile = useProfile();

	// Клик по своей аватарке
	const clickHandler = () => {
		profile.onClickPhoto(
			[
				{
					id: profile.userService.id,
					userName: profile.userService.fullName,
					userAvatarUrl: profile.userService.avatarUrl,
					path: profile.userService.avatarUrl,
					createDate: profile.userService.avatarCreateDate,
				},
			],
			0,
		);
	};

	// Установка загрузки
	const setLoading = (isLoading: boolean) => {
		useProfileStore.getState().setDeleteAvatarLoading(isLoading);
	};

	// Установка/обновление своего аватара
	const changeHandler = (updateOptions: IUpdatedAvatar) => {
		profile.onSetAvatar(updateOptions);
	};

	// Удаление аватара
	const deleteHandler = () => {
		profile.onDeleteAvatar();
	};

	return <GridComponent className="main-photo__grid">
		<PaperComponent className="main-photo paper-block">
			<PhotoComponent
				src={profile.userService.avatarUrl}
				alt="user-avatar"
				clickHandler={clickHandler}
				deleteHandler={deleteHandler}
			/>

			<div className="main-photo__edit-button">
				<ChangeAvatarComponent
					labelText={i18next.t("profile-module.change")}
					loading={loading}
					mustAuth
					onChange={changeHandler}
					setLoading={setLoading}
				/>
			</div>
		</PaperComponent>
	</GridComponent>;
}
