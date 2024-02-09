import { Collection, Document } from "mongodb";
import { SaveUserDataInput } from "../../../../src/domain/usecase/save-user-data";
import { mongoHelper } from "../../../../src/infra/db/mongodb/helpers/mongo-helper";
import { MongoSaveUserDataRepository } from "../../../../src/infra/db/mongodb/repositories/save-user-data-repository";

const makeSut = () => {
  const sut = new MongoSaveUserDataRepository();

  return {
    sut,
  };
};

const fakeData: Array<SaveUserDataInput> = [
  {
    name: "user_name",
    teamWorkScore: 25,
    hash: "d71160a8da8f4f35bc3a8fef935w7646",
    kills: 6,
    deaths: 1,
    score: 199,
    ip: "111.111.11.111",
  },
];

describe("SaveUserDataRepository", () => {
  let userCollection: Collection<Document>;
  beforeAll(async () => {
    await mongoHelper.connect();
    userCollection = await mongoHelper.getCollection("user");
  });

  afterAll(async () => {
    await userCollection.deleteMany({});
    await mongoHelper.disconnect();
  });

  test("should insert user if not exists", async () => {
    const { sut } = makeSut();

    await sut.save(fakeData);

    const existsUser = await userCollection.findOne({ hash: fakeData[0].hash });

    expect(existsUser).toStrictEqual(fakeData[0]);
  });
});
