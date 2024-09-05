import { Router } from 'express';
import { Deck } from './deck.model';
import { DeckService } from './deck.service';
import {AccessService} from "../access/access.service";
import {Access} from "../access/access.model";

export class DeckRouter {
    readonly router: Router;
    private deckService: DeckService;
    private accesService: AccessService;

    constructor() {
        this.router = Router();
        this.deckService = new DeckService();
        this.accesService = new AccessService();

        this.router.post('/', async (req, res) => {
            const deck: Deck = req.body;
            const newDeck = await this.deckService.createDeck(deck);
            if (newDeck) {
                let access:Access = {userid:newDeck.owner, deckid:newDeck.id};
                await this.accesService.create(access);
                res.status(201).json(newDeck);
            } else {
                res.status(400).json({ error: 'Invalid deck data provided' });
            }
        });

        this.router.get('/', async (req, res) => {
            const decks = await this.deckService.getAllDecks();
            res.status(200).json(decks);
        });


        this.router.get('/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const deck = await this.deckService.getDeckById(id);
            if (deck) {
                res.status(200).json(deck);
            } else {
                res.status(404).json({ error: 'Deck not found' });
            }
        });

        this.router.put('/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const deckUpdates: Deck = req.body;
            deckUpdates.id = id;
            const updatedDeck = await this.deckService.updateDeck(deckUpdates);
            if (updatedDeck) {
                res.status(200).json(updatedDeck);
            } else {
                res.status(400).json({ error: 'Invalid deck data provided or deck not found' });
            }
        });

        this.router.delete('/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const result = await this.deckService.deleteDeck(id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Deck not found' });
            }
        });


        this.router.get('/:deckId/cards', async (req, res) => {
            const id = parseInt(req.params.deckId);
            const result = await this.deckService.getCardsByDeckId(id);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ error: 'Deck not found' });
            }
        });
    }
}
