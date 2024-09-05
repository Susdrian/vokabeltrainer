import {Access} from "./access.model";
import {AccessRepository} from "./access.repository";
import {PgPool} from "../pg.pool";

export class AccessRepositoryDb implements AccessRepository {
    async create(access: Access): Promise<Access> {
        const query = {
            text: 'insert into wmc.Access (deckId, userId) values ($1, $2)',
            values: [access.deckid, access.userid]
        }
        let queryResult = await PgPool.getInstance().query<Access>(query);
        return Promise.resolve(queryResult.rows[0]);
    }

    async delete(access: Access): Promise<boolean> {
        const query = {
            text: 'delete from wmc.Access where deckId=$1 and userId=$2',
            values: [access.deckid, access.userid]
        };
        await PgPool.getInstance().query(query);
        return Promise.resolve(true);
    }

    async getAll(): Promise<Access[]> {
        const query = {
            text: 'select userId, deckId from wmc.Access',
        }
        let queryResult = await PgPool.getInstance().query<Access>(query);
        return queryResult.rows;
    }

    async getAccessFromUserId(userId: number): Promise<Access[]> {
        const query = {
            text: 'select userId, deckId from wmc.Access where userId = $1',
            values: [userId]
        }
        let queryResult = await PgPool.getInstance().query<Access>(query);
        return queryResult.rows;
    }

    async getAccessFromDeckId(deckId: number): Promise<Access[]> {
        const query = {
            text: 'select userId, deckId from wmc.Access where deckId = $1',
            values: [deckId]
        }
        let queryResult = await PgPool.getInstance().query<Access>(query);
        return queryResult.rows;
    }

    async approveAccess(access: Access): Promise<boolean> {
        const query = {
            text: 'Select userId, deckId from wmc.Access where deckId = $1 and userId=$2',
            values: [access.deckid, access.userid]
        }
        let queryResult = await PgPool.getInstance().query<Access[]>(query);

        return queryResult.rows.length == 1;
    }

}