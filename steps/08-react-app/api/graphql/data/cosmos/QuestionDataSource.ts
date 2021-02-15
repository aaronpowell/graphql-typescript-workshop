import { DataSource } from "apollo-datasource";
import { CosmosDataSource } from "apollo-datasource-cosmosdb";
import { arrayRandomiser } from "../../../utils";
import { ModelType, IQuestionDataSource, QuestionModel } from "../types";

export class QuestionDataSource
  extends CosmosDataSource<QuestionModel>
  implements IQuestionDataSource {
  async getQuestions(): Promise<QuestionModel[]> {
    const questions = await this.findManyByQuery({
      query: "SELECT * FROM c WHERE c.modelType = @type",
      parameters: [{ name: "@type", value: ModelType.Question }],
    });

    return arrayRandomiser(questions.resources);
  }
  async getQuestion(id: string) {
    const question = await this.findOneById(id);

    return question;
  }
}
