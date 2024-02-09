import type {
  SaveUserData,
  SaveUserDataInput,
} from "../../domain/usecase/save-user-data";
import type { SaveUserDataRepository } from "../protocols/save-user-data-repository";

export class DbSaveUserData implements SaveUserData {
  public constructor(
    private readonly saveUserDataRepository: SaveUserDataRepository
  ) {}

  public async save(data: Array<SaveUserDataInput>): Promise<void> {
    await this.saveUserDataRepository.save(data);
  }
}
