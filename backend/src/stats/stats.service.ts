import { StatsRepositoryDb } from "./stats.repository.db";
import { Stats } from "./stats.model";

export class StatsService {
    private statsRepository: StatsRepositoryDb = new StatsRepositoryDb();

    public async createStats(stats: Stats): Promise<Stats | null> {
        try {
            return await this.statsRepository.create(stats);
        } catch (error) {
            console.error('Error creating stats', error);
            return null;
        }
    }

    public async updateStats(stats: Stats): Promise<Stats | null> {
        try {
            return await this.statsRepository.update(stats);
        } catch (error) {
            console.error('Error updating stats', error);
            return null;
        }
    }

    public async deleteStats(userId: number, cardId: number): Promise<boolean> {
        try {
            return await this.statsRepository.delete(userId, cardId);
        } catch (error) {
            console.error('Error deleting stats', error);
            return false;
        }
    }

    public async getStatsByIds(userId: number, cardId: number): Promise<Stats | null> {
        try {
            return await this.statsRepository.getByIds(userId, cardId);
        } catch (error) {
            console.error('Error retrieving stats', error);
            return null;
        }
    }

    public async getAllStats(): Promise<Stats[]> {
        try {
            return await this.statsRepository.getAll();
        } catch (error) {
            console.error('Error retrieving all stats', error);
            return [];
        }
    }
}
