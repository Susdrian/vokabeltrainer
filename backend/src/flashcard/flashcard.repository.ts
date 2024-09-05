import {Flashcard} from "./flashcard.model";

export interface FlashcardRepository {
    getAll():Promise<Flashcard[]>
    getById(id:number): Promise<Flashcard|null>;
    create(flashcard:Flashcard): Promise<Flashcard>;
    delete(id:number): Promise<boolean>;
    update(flashcard:Flashcard): Promise<Flashcard>
}