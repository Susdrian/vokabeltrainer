import {UserIn} from "./userIn.model";
import {UserOut} from "./userOut.model";

export interface UserRepository {
    getAll():Promise<UserOut[]>;

    getById(id:number):Promise<UserOut|null>;
    create(user:UserIn):Promise<UserOut|null>;
    delete(id:number):Promise<boolean>;
    update(user:UserIn):Promise<UserOut>;
    getByName(name:string):Promise<UserOut|null>;
    getByNameWithPw(name:string):Promise<UserIn|null>;
}