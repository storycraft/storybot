'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class BalanceManager {
    constructor(main) {
        this.main = main;

        this.cachedDb = {};
    }

    async init() {
        await this.FirebaseDb.once('child_added', this.onBalanceAdded.bind(this));

        this.FirebaseDb.on('child_added', this.onBalanceAdded.bind(this));
        this.FirebaseDb.on('child_changed', this.onBalanceAdded.bind(this));
        this.FirebaseDb.on('child_removed', this.onBalanceRemoved.bind(this));
    }

    get FirebaseDb() {
        return this.main.Bot.FirebaseManager.Database.ref('balance');
    }

    getUserDbRef(user) {
        return this.FirebaseDb.child(user.IdentityId);;
    }

    getBalance(user) {
        return this.cachedDb[user.IdentityId] || 0;
    }

    async setBalance(user, amount) {
        await this.getUserDbRef(user).update(amount);
    }

    onBalanceAdded(dataSnapshot) {
        this.cachedDb[dataSnapshot.key] = dataSnapshot.val();
    }

    onBalanceRemoved(dataSnapshot) {
        this.cachedDb[dataSnapshot.key] = 0;
    }
}
exports.default = BalanceManager;