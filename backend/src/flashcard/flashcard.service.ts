import {FlashcardRepository} from "./flashcard.repository";
import {FlashcardRepositoryDb} from "./flashcard.repository.db";
import {Flashcard} from "./flashcard.model";

export class FlashcardService{

    private flashcardRepository: FlashcardRepository = new FlashcardRepositoryDb();

    public async getAllFlashcards(): Promise<Flashcard[]|null> {
        try{
            return await this.flashcardRepository.getAll()
        }catch (e){
            console.log('error', 'getAllFlashcards with', e);
            return Promise.resolve(null);

        }
    }

    public async getById(id:number): Promise<Flashcard|null> {
        try {
            return await this.flashcardRepository.getById(id)
        }catch (e){
            console.log('error', 'find flashcard with', e);
            return Promise.resolve(null);
        }
    }

    public async create(flashcard:Flashcard){
        try {
            return await this.flashcardRepository.create(flashcard)
        }catch (e){
            console.log('error', 'create flashcard with', e);
            return Promise.resolve(null)
        }
    }

    public async bulkCreate(flashcards:Flashcard[]){
        try {
            for (const flashcard of flashcards) {
                await this.create(flashcard);
            }
            return Promise.resolve(true);
        } catch (e) {
            console.log('error', 'bulk create flashcard with', e);
        }
    }

    public async delete(id:number){
        try {
            return await this.flashcardRepository.delete(id)
        }catch (e){
            console.log('error', 'find flashcard with', e);
            return Promise.resolve(null);
        }
    }

    public async update(flashcard:Flashcard){
        try {
            return await this.flashcardRepository.update(flashcard)
        }catch (e){
            console.log('error', 'update flashcard with', e);
            return Promise.resolve(null);
        }
    }

}