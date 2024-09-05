import {Deck} from "./deck.model";
import {Flashcard} from "../flashcard/flashcard.model";

export interface DeckRepository {
    getAll():Promise<Deck[]>;
    getById(id:number):Promise<Deck|null>;
    create(deck:Deck):Promise<Deck>;
    update(deck:Deck):Promise<Deck>;
    delete(id:number):Promise<boolean>;
    getDecksbyUserId(id:number):Promise<Deck[]>;
    getCardsByDeckId(id:number):Promise<Flashcard[]>;
}