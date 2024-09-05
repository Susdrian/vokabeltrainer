import {UserRepository} from "./user.repository";
import {UserIn} from "./userIn.model";
import {PgPool} from "../pg.pool";
import {UserOut} from "./userOut.model";

export class UserRepositoryDb implements UserRepository {
    async create(user: UserIn): Promise<UserOut | null> {
        try {
            const query = {
                text: 'insert into wmc.fcUser (username, password, registrationDate,lastLogin, deleteTag) values ($1, $2, $3, $4, false) returning id',
                values: [user.username.trim().toLowerCase(), user.password, user.registrationdate, user.lastlogin]
            }
            let res = await PgPool.getInstance().query(query);
            user.id = res.rows[0].id;
        } catch (err: any) {
            return Promise.resolve(null);
        }
        return Promise.resolve(user);
    }

    async delete(id: number): Promise<boolean> {
        const query = {
            text: 'update wmc.fcUser set deleteTag = true where id = $1  and deleteTag = false',
            values: [id]
        }
        await PgPool.getInstance().query(query);
        return Promise.resolve(true);
    }

    async getAll(): Promise<UserOut[]> {
        const query = {
            text: 'select id, username, registrationDate, lastLogin from wmc.fcUser where deleteTag = false'
        }
        let queryResult = await PgPool.getInstance().query<UserOut>(query);
        return queryResult.rows;
    }

    async getById(id: number): Promise<UserOut | null> {
        const query = {
            text: 'select id, username, registrationDate, lastLogin from wmc.fcUser where id = $1 and deleteTag = false',
            values: [id]
        }
        let queryResult = await PgPool.getInstance().query<UserOut>(query);
        if (queryResult.rows.length != 1) {
            return null;
        }
        return queryResult.rows[0];
    }

    async update(user: UserOut): Promise<UserOut> {
        console.log(user.lastlogin)
        const query = {
            text: 'update wmc.fcUser set username = $1, registrationDate = $2, lastLogin = $3 where id = $4 and deleteTag = false',
            values: [user.username.trim().toLowerCase(), user.registrationdate, user.lastlogin, user.id]
        }
        await PgPool.getInstance().query(query);
        return Promise.resolve(user);
    }

    async getByName(name: string): Promise<UserOut | null> {
        const query = {
            text: 'select id, username, registrationDate, lastLogin from wmc.fcUser where username = $1 and deleteTag = false',
            values: [name.toLowerCase()]
        }
        let queryResult = await PgPool.getInstance().query<UserOut>(query);

        if (queryResult.rows.length != 1) {
            return null;
        }
        return queryResult.rows[0];
    }

    async getByNameWithPw(username: string) {
        const query = {
            text: 'select id, username, registrationDate, password, lastLogin from wmc.fcUser where username = $1 and deleteTag = false',
            values: [username.trim().toLowerCase()]
        }
        let queryResult = await PgPool.getInstance().query<UserIn>(query);

        if (queryResult.rows.length != 1) {
            return null;
        }
        return queryResult.rows[0];
    }
}