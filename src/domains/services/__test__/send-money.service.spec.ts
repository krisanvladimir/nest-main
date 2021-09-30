import { anyString, anything, instance, mock, when } from 'ts-mockito';
import { LoadAccountPort } from '../../ports/out/load-account.port';
import { UpdateAccountStatePort } from '../../ports/out/update-account-state.port';
import { AccountEntity, AccountId } from '../../entities/account.entity';
import { SendMoneyCommand } from '../../ports/in/send-money.command';
import { MoneyEntity } from '../../entities/money.entity';
import { SendMoneyService } from '../send-money.service';

describe('SendMoneyService', () => {
  it('should transaction success', function () {
    const loadAccountPort = mock<LoadAccountPort>();
    const updateAccountStatePort = mock<UpdateAccountStatePort>();

    function givenAccountWithId(id: AccountId) {
      const mokedAccountEntity = mock(AccountEntity);
      when(mokedAccountEntity.id).thenReturn(id);
      when(mokedAccountEntity.withdraw(anything(), anyString())).thenReturn(
        true,
      );
      when(mokedAccountEntity.deposit(anything(), anyString())).thenReturn(
        true,
      );
      const account = instance(mokedAccountEntity);

      when(loadAccountPort.loadAccount(id)).thenReturn(account);
      return account;
    }

    const sourceAccount = givenAccountWithId('41');
    const targetAccount = givenAccountWithId('42');

    const command = new SendMoneyCommand(
      sourceAccount.id,
      targetAccount.id,
      MoneyEntity.of(300),
    );

    const sendMoneyService = new SendMoneyService(
      instance(loadAccountPort),
      instance(updateAccountStatePort),
    );

    const result = sendMoneyService.sendMoney(command);

    expect(result).toBeTruthy();
  });
});
