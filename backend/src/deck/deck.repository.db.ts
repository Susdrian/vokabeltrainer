import {DeckRepository} from "./deck.repository";
import {Deck} from "./deck.model";
import {PgPool} from "../pg.pool";
import {Flashcard} from "../flashcard/flashcard.model";

export class DeckRepositoryDB implements DeckRepository {
    async create(deck: Deck): Promise<Deck> {
        const query = {
            text: 'insert into wmc.deck (description, language, owner, editable) values ($1, $2, $3, $4) returning id',
            values: [deck.description, deck.language, deck.owner, deck.editable]
        }
        let res = await PgPool.getInstance().query(query);
        deck.id = res.rows[0].id;
        return Promise.resolve(deck);
    }

    async delete(id: number): Promise<boolean> {
        const query = {
            text: 'delete from wmc.deck where id = $1',
            values: [id]
        }
        await PgPool.getInstance().query(query);
        return Promise.resolve(true);
    }

    async getAll(): Promise<Deck[]> {
        const query = {
            text: 'select id, description, language, owner, editable from wmc.deck',
        }
        let queryResult = await PgPool.getInstance().query<Deck>(query);
        return queryResult.rows;
    }

    async getById(id: number): Promise<Deck | null> {
        const query = {
            text: 'select id, description, language, owner, editable from wmc.deck where id = $1',
            values: [id]
        }
        let queryResult = await PgPool.getInstance().query<Deck>(query);

        if (queryResult.rows.length != 1) {
            return null;
        }
        return queryResult.rows[0];
    }

    async update(deck: Deck): Promise<Deck> {
        const query = {
            text: 'update wmc.deck set description = $1, language = $2, owner = $3, editable = $4 where id = $5',
            values: [deck.description, deck.language, deck.owner, deck.editable, deck.id]
        }
        await PgPool.getInstance().query(query);
        return Promise.resolve(deck);
    }

    async getDecksbyUserId(id: number): Promise<Deck[]> {
        const query = {
            text: 'select d.* FROM wmc.Deck d JOIN wmc.Access a ON a.deckId = d.id WHERE a.userId = $1',
            values: [id]
        }
        let queryResult = await PgPool.getInstance().query<Deck>(query);
        return queryResult.rows;
    }

    async getCardsByDeckId(id: number): Promise<Flashcard[]> {
        const query = {
            text: 'SELECT * FROM wmc.Flashcard WHERE deckId = $1',
            values: [id]
        };
        const result = await PgPool.getInstance().query<Flashcard>(query);
        return result.rows;
    }
}