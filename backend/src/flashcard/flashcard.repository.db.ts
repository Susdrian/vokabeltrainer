import { Flashcard } from "./flashcard.model";
import {FlashcardRepository} from "./flashcard.repository";
import {PgPool} from "../pg.pool";

export class FlashcardRepositoryDb implements FlashcardRepository {
    async getAll(): Promise<Flashcard[]> {
        const query = {
            text: 'select id, front, back, deckid from wmc.Flashcard',
        }
        let queryResult = await PgPool.getInstance().query<Flashcard>(query);
        return queryResult.rows;
    }

    async getById(id: number): Promise<Flashcard|null> {
        const query = {
            text: 'select id, front, back, deckId from wmc.Flashcard where id = $1',
            values: [id]
        }
        let queryResult = await PgPool.getInstance().query<Flashcard>(query);

        if (queryResult.rows.length != 1){
            return null;
        }
        return queryResult.rows[0];
    }

    async create(flashcard: Flashcard): Promise<Flashcard> {
        const query = {
            text: 'insert into wmc.Flashcard (front, back, deckid) values ($1, $2, $3) returning id' ,
            values: [flashcard.front, flashcard.back, flashcard.deckid]
        }
        let res = await PgPool.getInstance().query(query);
        flashcard.id = res.rows[0].id;
        return Promise.resolve(flashcard);
    }


    async delete(id: number): Promise<boolean> {
        const query = {
            text: 'delete from wmc.flashcard where id = $1',
            values: [id]
        }
        await PgPool.getInstance().query(query);
        return Promise.resolve(true);
    }

    async update(flashcard: Flashcard): Promise<Flashcard> {
        const query={
            text: 'update wmc.flashcard set front = $1, back = $2 where id = $3',
            values: [flashcard.front, flashcard.back, flashcard.id]
        }
        await PgPool.getInstance().query(query);
        return Promise.resolve(flashcard);
    }

}