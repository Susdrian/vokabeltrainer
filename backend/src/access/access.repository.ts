import {Access} from "./access.model";

export interface AccessRepository{
    create(access:Access): Promise<Access>;
    delete(access:Access): Promise<boolean>;
    getAll(): Promise<Access[]>;
    getAccessFromUserId(userId:number): Promise<Access[]>;
    getAccessFromDeckId(deckId:number): Promise<Access[]>;
    approveAccess(access:Access): Promise<boolean>;
}