import { DataSource } from "apollo-datasource";
import { idGenerator } from "../../../utils";
import { ModelType, UserDataStore, UserModel } from "../types";

export class UserDataSource extends DataSource implements UserDataStore {
  constructor(private users: UserModel[]) {
    super();
  }

  getUser(id: string): Promise<UserModel> {
    return Promise.resolve(this.users.find((u) => u.id === id));
  }
  createUser(name: string): Promise<UserModel> {
    const existingUser = this.users.find((u) => u.name === name);

    if (existingUser) {
      return Promise.resolve(existingUser);
    }

    const user: UserModel = {
      id: idGenerator(),
      modelType: ModelType.User,
      name,
      // fields used with Azure Static Web Apps auth
      identityProvider: "not defined",
      userDetails: "not defined",
      userRoles: ["anonymous", "authenticated"],
    };

    this.users.push(user);

    return Promise.resolve(user);
  }
}
