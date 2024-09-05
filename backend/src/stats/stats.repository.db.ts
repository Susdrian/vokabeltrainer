import {StatsRepository} from "./stats.repository";
import {Stats} from "./stats.model";
import {PgPool} from "../pg.pool";

export class StatsRepositoryDb implements StatsRepository {
    async create(stats: Stats): Promise<Stats> {
        const query = {
            text: 'insert into wmc.userflashcardstats (shown, correct, userId, cardId) values ($1, $2, $3, $4)',
            values: [stats.shown, stats.correct, stats.userid, stats.cardid]
        }
        await PgPool.getInstance().query(query);
        return Promise.resolve(stats);
    }

    async delete(userId: number, cardId: number): Promise<boolean> {
        const query = {
            text: 'delete from wmc.userflashcardstats where userId = $1 and cardId = $2',
            values: [userId, cardId]
        }
        await PgPool.getInstance().query(query);
        return Promise.resolve(true);
    }

    async getAll(): Promise<Stats[]> {
        const query = {
            text: 'select shown, correct, userid, cardid from wmc.userflashcardstats',
        }
        let queryResult = await PgPool.getInstance().query<Stats>(query);
        return queryResult.rows;
    }

    async getByIds(userId: number, cardId: number): Promise<Stats | null> {
        const query = {
            text: 'select shown, correct, userId, cardId from wmc.userflashcardstats where userId = $1 and cardId = $2',
            values: [userId, cardId]
        }
        let queryResult = await PgPool.getInstance().query<Stats>(query);

        if (queryResult.rows.length != 1) {
            return null;
        }
        return queryResult.rows[0];
    }

    async update(stats: Stats): Promise<Stats> {
        const query = {
            text: 'update wmc.userflashcardstats set shown = $1, correct = $2 where userID = $3 and cardId = $4',
            values: [stats.shown, stats.correct, stats.userid, stats.cardid]
        }
        await PgPool.getInstance().query(query);
        return Promise.resolve(stats);
    }

}