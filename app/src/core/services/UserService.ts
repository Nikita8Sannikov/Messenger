import EventEmitter from "eventemitter3";

import Logger from "@service/Logger";
import Request from "@core/Request";
import UserDetailsService from "@core/services/UserDetailsService";
import { User } from "@core/models/User";
import { UserDetails } from "@core/models/UserDetails";
import { MY_ID } from "@utils/constants";
import { IUser, IUserDetails } from "@custom-types/models.types";
import { ApiRoutes } from "@custom-types/enums";
import { MainClientEvents, UserEvents } from "@custom-types/events";
import { AppDispatch } from "@custom-types/redux.types";
import { setLoading } from "@store/main/slice";

const logger = Logger.init("User");

// Класс, реализовывающий сущность "Пользователь" согласно контракту "Пользователь"
export default class UserService extends EventEmitter implements User {
    private readonly _userDetails: UserDetails;
    private _user!: IUser;

    constructor(private readonly _id: string, private readonly _request: Request, private readonly _dispatch: AppDispatch) {
        super();

        logger.debug(`init user [id=${this._id}]`);

        this._id === MY_ID
            ? this._getMe()
            : this._getUser();

        this._userDetails = new UserDetailsService(this._request);
    }

    get id() {
        return this._user.id;
    }

    get user() {
        return this._user;
    }

    get firstName() {
        return this._user.firstName;
    }

    get thirdName() {
        return this._user.thirdName;
    }

    get phone() {
        return this._user.phone;
    }

    get email() {
        return this._user.email;
    }

    get fullName() {
        return this._user.firstName + " " + this._user.thirdName;
    }

    get avatarUrl() {
        return this._user.avatarUrl ? this._user.avatarUrl : "";
    }

    get userDetails() {
        return this._userDetails;
    }

    // Получение данных о себе
    private _getMe() {
        this._request.get({
            route: ApiRoutes.getMe,
            setLoading: (isLoading: boolean) => {
                this._dispatch(setLoading(isLoading));
            },
            successCb: (data: { user: IUser }) => {
                this._user = data.user;
                logger.info(`get info about yourself: ${JSON.stringify(this._user)}`);
                this.emit(MainClientEvents.GET_ME);
            }
        });
    }

    // Получение данных другого пользователя
    private _getUser() {
        this._request.post({
            route: ApiRoutes.getUser,
            data: { id: this._id },
            successCb: (data: { user: IUser }) => {
                // this._user = data.user;
                logger.info(`get info about another user: ${JSON.stringify(data.user)}`);
            }
        });
    }

    // Обновление данных о себе (так как после входа уже существует в мапе мой профиль и сущность Пользователь)
    updateMe() {
        logger.debug("updateMe");

        this._getMe();
        this._userDetails.updateDetails();
    }

    // Замена поля пользователя и обновление в глобальном состоянии
    changeField(field: string, value: string) {
        logger.debug(`changeField [field: ${field}, value=${value}]`);
        
        this._user[field] = value;
        this.emit(UserEvents.CHANGE_FIELD, field, value);
    }

    // Обновление данных о пользователе при редактировании
    updateInfo({ user, userDetails }: { user: IUser, userDetails: IUserDetails }) {
        logger.debug("updateInfo");

        this._user = user;
        this._userDetails.editDetails(userDetails);
    }

    /**
     * Статичный метод фабрика
     * Возвращает сущность "Пользователь"
     */
    static create(...args: [string, Request, AppDispatch]) {
        return new UserService(...args);
    }
}