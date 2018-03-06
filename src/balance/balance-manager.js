const DEFAULT_MONEY_AMOUNT = 100;

export default class BalanceManager {
    constructor(main){
        this.main = main;
    }

    get FirebaseDb(){
        return this.main.Bot.FirebaseManager.Database.ref('balance');
    }

    getUserDbRef(user){
        return this.FirebaseDb.child(user.IdentityId);
    }

    async getBalance(user){
        var snapshot = await this.getUserDbRef(user).once('value');

        if (!snapshot.exists()){
            //초기금 설정
            await this.setBalance(user, DEFAULT_MONEY_AMOUNT);
            return DEFAULT_MONEY_AMOUNT;
        }

        return snapshot.val();
    }

    async setBalance(user, amount){
        await this.getUserDbRef(user).set(amount);
    }
}