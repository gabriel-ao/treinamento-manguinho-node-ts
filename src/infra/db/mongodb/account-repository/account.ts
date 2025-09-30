import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    return MongoHelper.map({ _id: result.insertedId, ...accountData }); // TODO - pra lembrar: versoes atuais o mongo nao retorna o ops como no curso
  }
}
