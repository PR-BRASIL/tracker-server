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
    hash: "d71160a8da8f4f35bc3a8fef935w7646",
    teamWorkScore: 5,
    kills: 5,
    deaths: 5,
    score: 5,
    ip: "111.111.11.111",
  },
];

describe("SaveUserDataRepository", () => {
  let userCollection: Collection<Document>;
  beforeAll(async () => {
    await mongoHelper.connect();
    userCollection = await mongoHelper.getCollection("user");
  });

  afterEach(async () => {
    await userCollection.deleteMany({});
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });

  test("should insert user if not exists", async () => {
    const { sut } = makeSut();

    await sut.save(fakeData);

    const existsUser = await userCollection.findOne({ hash: fakeData[0].hash });

    expect(existsUser).toStrictEqual(fakeData[0]);
  });

  test("should increment score, kills, deaths, and teamWorkScore when user exists", async () => {
    const { sut } = makeSut();
    await userCollection.insertOne({
      ...fakeData,
      kills: 0,
      deaths: 0,
      score: 0,
      teamWorkScore: 0,
    });
    await sut.save(fakeData);

    const user = await userCollection.findOne({ hash: fakeData[0].hash });
    expect(user).toBeTruthy();
    expect(user).toStrictEqual(
      expect.objectContaining({
        kills: 5,
        deaths: 5,
        score: 5,
        teamWorkScore: 5,
      })
    );
  });
});
