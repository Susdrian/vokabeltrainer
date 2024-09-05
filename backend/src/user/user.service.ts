import { UserRepositoryDb } from "./user.repository.db";
import { UserIn } from "./userIn.model";
import {UserOut} from "./userOut.model";

export class UserService {
    private userRepository: UserRepositoryDb = new UserRepositoryDb();

    public async createUser(username:string, password:string): Promise<UserOut | null> {
        try {
            const user:UserIn = {id:-1, username:username, password:password, registrationdate: new Date(), lastlogin: new Date()};
            return await this.userRepository.create(user);
        } catch (error) {
            console.error('Error creating user', error);
            return null;
        }
    }

    public async updateUser(user: UserOut): Promise<UserOut | null> {
        try {
            return await this.userRepository.update(user);
        } catch (error) {
            console.error('Error updating user', error);
            return null;
        }
    }

    public async deleteUser(id: number): Promise<boolean> {
        try {
            return await this.userRepository.delete(id);
        } catch (error) {
            console.error('Error deleting user', error);
            return false;
        }
    }

    public async getUserById(id: number): Promise<UserOut | null> {
        try {
            return await this.userRepository.getById(id);
        } catch (error) {
            console.error('Error retrieving user', error);
            return null;
        }
    }

    public async getAllUsers(): Promise<UserOut[]> {
        try {
            return await this.userRepository.getAll();
        } catch (error) {
            console.error('Error retrieving all users', error);
            return [];
        }
    }
    async getUserByUsername(username: string): Promise<UserOut | null> {
        try {
            return await this.userRepository.getByName(username);
        } catch (error) {
            console.log('Error retrieving user', error);
            return null;
        }
    }

    async getUserByUsernameWithPw(username: string): Promise<UserIn | null> {
        try {
            return await this.userRepository.getByNameWithPw(username);
        } catch (error) {
            console.log('Error retrieving user', error);
            return null;
        }
    }
}
