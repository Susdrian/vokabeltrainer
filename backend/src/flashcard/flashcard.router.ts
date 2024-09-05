import {Router} from "express";
import {FlashcardService} from "./flashcard.service";
import {Flashcard} from "./flashcard.model";

export class FlashcardRouter {
    readonly router: Router = Router();
    private readonly flashcardService: FlashcardService = new FlashcardService();

    constructor() {

        this.router.post("/", async (req, res) => {
            const flashcard: Flashcard = req.body;
            let result = await this.flashcardService.create(flashcard);
            if(result){
            res
                .status(200)
                .json(result)
            }else {
                res.status(404).json({error: "flashcard could not be created"});
            }
        })

        this.router.post("/bulk", async (req, res) => {
            const flashcard: Flashcard[] = req.body;
            let result = await this.flashcardService.bulkCreate(flashcard);
            if (result){
            res
                .status(200)
                .json(result)
            }else {
                res.status(404).json({error: "Flashcards could not added"});
            }
        })

        this.router.get("/", async (req, res) => {
            let result = await this.flashcardService.getAllFlashcards();
            if(result) {
                res
                    .status(200)
                    .json(result)
            }else {
                res.status(404).json({error: "Flashcards could not be found"});
            }
        })

        this.router.get("/:id", async (req, res) => {
            let id: number = parseInt(req.params.id);
            let result = await this.flashcardService.getById(id)
            if (result) {
                res
                    .status(200)
                    .json(result)
            }else {
                res.status(404).json({error: "Flashcard could not be found"});
            }
        })

        this.router.delete("/:id", async (req, res) => {
            let id: number = parseInt(req.params.id);
            let result = await this.flashcardService.delete(id)
            if (result) {
                res
                    .status(200)
                    .json({message: "Item deleted"});
            } else {
                res
                    .status(404)
                    .json({error: "Item not found"});
            }
        })

        this.router.put("/", async (req, res) => {
            let flashcard:Flashcard = req.body
            let result = await this.flashcardService.update(flashcard);
            if (result) {
                res
                    .status(200)
                    .json(result)
            }else {
                res.status(400).json({error: "Flashcard could not be updated"});
            }
        })

    }
}