import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import { IChat } from "@custom-types/models.types";

// Тип модели Chats, унаследованного от Sequelize
export type ChatsInstance = IChat & Model & {};

export default class Chats {
  private _chatModel!: ModelStatic<ChatsInstance>;

  constructor(private readonly _sequelize: Sequelize) {
    this._init();
  }

  get chats() {
    return this._chatModel;
  }

  private _init() {
    this._chatModel = this._sequelize.define<ChatsInstance, IChat>("Chats", {
      id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ""
      },
      avatarUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "avatar_url"
      }
    })
  }
}