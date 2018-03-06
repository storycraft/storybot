import { CommandListener } from "storybot-core";

export default class BalanceCommand extends CommandListener {
    constructor(main){
        super();
        this.main = main;
        
        this.main.CommandManager.on('money', this.onCommand.bind(this));
    }

    get BalanceManager(){
        return this.main.BalanceManager;
    }

    get Description(){
        return '돈 줘';
    }

    get Aliases(){
        return ['money'];
    }

    onCommand(args, user, bot, source){
        this.BalanceManager.getBalance(user).then((amount) => {
            source.send(`\`${user.Name}\`은 코인 ${amount} 개를 소유 중입니다`);
        });
    }
}