import {Router} from 'express';
import {StatsService} from './stats.service';
import {Stats} from './stats.model';

export class StatsRouter {
    readonly router: Router;
    private statsService: StatsService;

    constructor() {
        this.router = Router();
        this.statsService = new StatsService();

        this.router.post('/', async (req, res) => {
            const stats: Stats = req.body;
            const newStats = await this.statsService.createStats(stats);
            if (newStats) {
                res.status(201).json(newStats);
            }
        });

        this.router.put('/:userId/:cardId', async (req, res) => {
            const userId = parseInt(req.params.userId);
            const cardId = parseInt(req.params.cardId);
            const statsUpdates: Stats = req.body;
            statsUpdates.cardid = cardId;
            statsUpdates.userid = userId;
            const updatedStats = await this.statsService.updateStats(statsUpdates);
            if (updatedStats) {
                res.status(200).json(updatedStats);
            } else {
                res.status(400).json({error: 'Failed to update stats'});
            }
        });

        this.router.delete('/:userId/:cardId', async (req, res) => {
            const userId = parseInt(req.params.userId);
            const cardId = parseInt(req.params.cardId);
            const success = await this.statsService.deleteStats(userId, cardId);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).json({error: 'Stats not found'});
            }
        });

        this.router.get('/:userId/:cardId', async (req, res) => {
            const userId = parseInt(req.params.userId);
            const cardId = parseInt(req.params.cardId);
            const stats = await this.statsService.getStatsByIds(userId, cardId);
            if (stats) {
                res.status(200).json(stats);
            } else {
                res.status(404).json({error: 'Stats not found'});
            }

        });

        this.router.get('/', async (req, res) => {
            const allStats = await this.statsService.getAllStats();
            res.status(200).json(allStats);
        });
    }
}
