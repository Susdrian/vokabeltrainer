import {Router} from "express";
import {AccessService} from "./access.service";
import {Access} from "./access.model";

export class AccessRouter{
    readonly router: Router = Router();
    private readonly accessService: AccessService = new AccessService();

    constructor() {

        this.router.get("/",async (req, res) =>{
            const access: Access[] | null = await this.accessService.getAll();
            if(access){
            res
                .status(200)
                .send(access);
            }else {
                res.status(400).json({error: "No accesses found"});
            }
        })

        this.router.get("/fromUserID/:id",async (req, res) =>{
            let id:number = parseInt(req.params.id);
            const access:Access[] | null=await this.accessService.getAccessFromUserId(id)
            if(access){
            res
                .status(200)
                .send(access)
            }else {
                res.status(400).json({error: "No accesses found"});
            }
        })

        this.router.get("/fromDeckId/:id",async (req, res) =>{
            let id:number = parseInt(req.params.id);
            const access:Access[] | null=await this.accessService.getAccessFromDeckId(id)
            if(access) {
                res
                    .status(200)
                    .send(access)
            }else {
                res.status(400).json({error: "No access with this id"});
            }
        })

        this.router.delete("/delete",async (req,res) =>{
            const access: Access = req.body;
            let result = await this.accessService.delete(access);
            if (result) {
                res
                    .status(200)
                    .json({ message: "Item deleted" });
            } else {
                res
                    .status(404)
                    .json({ error: "Item not found" });
            }
        });

        this.router.post("/approve",async (req,res) => {
            const access: Access = req.body;
            let result = await this.accessService.approveAccess(access);
            res
                .status(200)
                .json(result)
        })

        this.router.post("/",async (req,res) => {
            const access: Access = req.body;
            let result = await this.accessService.create(access);
            res
                .status(200)
                .json(result);
        })
    }
}