import { Model } from './../lib/model.helper';
import { Timer } from './timer';
import { ItemStatus } from './../item/item';
import ItemService from './../item/item.service';

export default class {
    constructor(private timerModel: Model<Timer[]>, private itemService: ItemService) {}

    init(): void {
        this.clean();
        let now: number = new Date().getTime();
        this.timerModel.get().map((timer: Timer) => {
            this.setTimeout(timer.itemStatus, timer.time - now);
        });
    }
    
    add(itemStatus: ItemStatus, seconds: number): NodeJS.Timer {
        let ms: number = seconds * 1000;
        let timer = new Timer;
        timer.itemStatus = itemStatus;
        timer.time = (new Date().getTime()) + ms;
        this.timerModel.get().push(timer);
        this.timerModel.save();
        return this.setTimeout(itemStatus, ms);
    }
    
    setTimeout(itemStatus: ItemStatus, ms: number): NodeJS.Timer {
        console.log('Set timer for ' + itemStatus.id + ' to status ' + itemStatus.status + ' in ' + ms + 'ms');
        return setTimeout(() => this.call(itemStatus), ms);
    }
    
    call(itemStatus: ItemStatus): void {
        this.clean();
        this.itemService.setStatus(itemStatus.id, itemStatus.status.toString());
    }
    
    clean(): void {
        let now: number = new Date().getTime();
        let timers: Timer[] = this.timerModel.get().filter((timer: Timer) => { return timer.time > now; } );
        this.timerModel.set(timers).save();
    }
}