import { CosmosDataSource } from "apollo-datasource-cosmosdb";
import { idGenerator } from "../../../utils";
import { ModelType, IUserDataSource, UserModel } from "../types";

export class UserDataSource
  extends CosmosDataSource<UserModel>
  implements IUserDataSource {
  async getUser(id: string) {
    return await this.findOneById(id);
  }

  async createUser(name: string) {
    // without doing a proper auth solution we'll pretend that names are unique
    const existingUser = await this.findManyByQuery({
      query:
        "SELECT TOP 1 * FROM c WHERE c.name = @name AND c.modelType = @type",
      parameters: [
        { name: "@name", value: name },
        { name: "@type", value: ModelType.User },
      ],
    });

    if (existingUser.resources[0]) {
      return existingUser.resources[0];
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

    const savedUser = await this.createOne(user);
    return savedUser.resource;
  }
}
