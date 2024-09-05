import { DeckRepositoryDB } from "./deck.repository.db";
import { Deck } from "./deck.model";
import {Flashcard} from "../flashcard/flashcard.model";

export class DeckService {
    private deckRepository: DeckRepositoryDB = new DeckRepositoryDB();

    public async createDeck(deck: Deck): Promise<Deck | null> {
        if (!this.isValidDeck(deck)) {
            console.error('Invalid deck data', deck);
            return null;
        }
        try {
            return await this.deckRepository.create(deck);
        } catch (error) {
            console.error('Error creating deck', error);
            return null;
        }
    }

    public async updateDeck(deck: Deck): Promise<Deck | null> {
        if (!deck.id || !this.isValidDeck(deck)) {
            console.error('Invalid deck data or missing ID', deck);
            return null;
        }
        try {
            return await this.deckRepository.update(deck);
        } catch (error) {
            console.error('Error updating deck', error);
            return null;
        }
    }

    public async deleteDeck(id: number): Promise<boolean> {
        try {
            return await this.deckRepository.delete(id);
        } catch (error) {
            console.error('Error deleting deck', error);
            return false;
        }
    }

    public async getDeckById(id: number): Promise<Deck | null> {
        try {
            return await this.deckRepository.getById(id);
        } catch (error) {
            console.error('Error fetching deck', error);
            return null;
        }
    }

    public async getAllDecks(): Promise<Deck[]> {
        try {
            return await this.deckRepository.getAll();
        } catch (error) {
            console.error('Error fetching decks', error);
            return [];
        }
    }

    public async getDecksByUserId(id: number): Promise<Deck[]> {
        try {
            return await this.deckRepository.getDecksbyUserId(id);
        } catch (error) {
            console.error('Error fetching decks by user Id', error);
            return []
        }
    }

    public async getCardsByDeckId(id: number): Promise<Flashcard[]> {
        try {
            return await this.deckRepository.getCardsByDeckId(id);
        } catch (error) {
            console.error('Error fetching cards from deck', error);
            return [];
        }
    }

    private isValidDeck(deck: Deck): boolean {
        return deck.description.trim() !== '' && deck.language.trim() !== '';
    }
}
