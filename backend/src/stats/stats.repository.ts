import {Stats} from "./stats.model";

export interface StatsRepository {
    getAll():Promise<Stats[]>;
    getByIds(userId:number, cardId:number):Promise<Stats | null>;
    create(stats:Stats):Promise<Stats>;
    update(stats:Stats):Promise<Stats>;
    delete(userId:number, cardId:number):Promise<boolean>;
}