import {NextFunction, Request, Response, Router} from 'express';
import {UserService} from './user.service';
import {DeckService} from "../deck/deck.service";
import {UserOut} from "./userOut.model";
import jwt from "jsonwebtoken";

export class UserRouter {
    public router: Router;
    private userService: UserService;
    private deckService: DeckService;

    constructor() {
        this.router = Router();
        this.userService = new UserService();
        this.deckService = new DeckService();
        const bcrypt = require('bcrypt');
        const jwt = require('jsonwebtoken');

        this.router.get('/getfromjwt', authenticateToken, async (req, res) => {

            if (!req.user) {
                return res.status(404).send('Keine Benutzerdaten gefunden');
            }

            const userRes = await this.userService.getUserById(parseInt(req.user.id))
            res.json(userRes);
        });

        this.router.post('/', async (req, res) => {
            const username = req.body.username;
            const password = req.body.password;
            if (!username || !password) {
                return res.status(400).json({error: 'Username and password are required'});
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const user = await this.userService.createUser(username,passwordHash);

            if (user) {
                let out:UserOut = {
                    username: user.username,
                    lastlogin:user.lastlogin,
                    registrationdate:user.registrationdate,
                    id:user.id
                }
                res.status(201).json(out);
            } else {
                res.status(409).json({error: 'User registration failed'});
            }
        });

        this.router.put('/:id', async (req, res) => {
            const user: UserOut = {...req.body, id: parseInt(req.params.id)};
            const updatedUser = await this.userService.updateUser(user);
            if (updatedUser) {
                res.status(200).json(updatedUser);
            } else {
                res.status(400).json({error: 'Failed to update user'});
            }
        });

        this.router.delete('/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const result = await this.userService.deleteUser(id);
            if (result) {
                res.status(204).send();
            } else {
                res.status(404).json({error: 'User not found'});
            }
        });

        this.router.get('/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const user = await this.userService.getUserById(id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({error: 'User not found'});
            }
        });

        this.router.get('/', async (req, res) => {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        });

        this.router.post('/login', async (req, res) => {
            const username = req.body.username.trim();
            const password = req.body.password.trim();
            if (!username) {
                return res.status(400).json({error: 'Username is required'});
            }
            const user = await this.userService.getUserByUsernameWithPw(username);
            if (user && await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ username: user.username, id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
                res.status(200).json({ token });
            } else {
                res.status(401).json({error: 'Invalid username or password'});
            }
        });

        this.router.get('/:userId/decks', async (req, res) => {
            const userId = parseInt(req.params.userId);
            if (isNaN(userId)) {
                return res.status(400).json({ error: "Invalid user ID" });
            }
            try {
                const decks = await this.deckService.getDecksByUserId(userId);
                res.status(200).json(decks);
            } catch (error) {
                res.status(500).json({ error: 'Failed to retrieve decks' });
            }
        });

        this.router.get('/byname/:username', async (req, res) => {
            const username = req.params.username;
            if (!username) {
                return res.status(400).json({error: 'Username and password are required'});
            }

            const user = await this.userService.getUserByUsername(username);
            if (user) {
                res.status(201).json(user);
            } else {
                res.status(404).json({error: 'User not found'});
            }
        });


    }
}

declare global {
    namespace Express {
        export interface Request {
            user?: { id: string, username: string }
        }
    }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string | undefined;
    if (!authHeader) return res.status(401).send();
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Token is missing.');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
        if (err) return res.status(403).send();

        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'username' in decoded) {
            req.user = { id: decoded.id, username: decoded.username };
            next();
        } else {
            return res.status(403).send('Invalid token structure');
        }
    });
};