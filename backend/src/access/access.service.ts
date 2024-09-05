import {AccessRepository} from "./access.repository";
import {AccessRepositoryDb} from "./access.repository.db";
import {Access} from "./access.model";

export class AccessService{

    private accessRepository: AccessRepository = new AccessRepositoryDb();

    public async create(access: Access) {
        try {
            return await this.accessRepository.create(access);
        } catch (e) {
            console.log('error', 'create failed with', e);
            return Promise.resolve(null);
        }
    }

    public async delete(access: Access) {
        try {
            return await this.accessRepository.delete(access);
        } catch (e) {
            console.log('error', 'delete failed with', e);
            return Promise.resolve(false);
        }
    }

    public async getAll() {
        try {
            return await this.accessRepository.getAll();
        } catch (e) {
            console.log('error', 'find all failed with', e);
            return Promise.resolve(null);
        }
    }

    public async getAccessFromUserId(userId:number){
        try {
            return await this.accessRepository.getAccessFromUserId(userId);
        } catch (e) {
            console.log('error', 'find failed with', e)
            return Promise.resolve([]);
        }
    }

    public async getAccessFromDeckId(deckId:number){
        try {
            return await this.accessRepository.getAccessFromDeckId(deckId)
        }catch (e){
            console.log('error', 'find failed with', e)
            return Promise.resolve([]);
        }
    }

    public async approveAccess(access:Access): Promise<boolean> {
        try{
            return await this.accessRepository.approveAccess(access)
        }catch (e){
            console.log('error', 'find failed with', e)
            return Promise.resolve(false);
        }
    }

    }