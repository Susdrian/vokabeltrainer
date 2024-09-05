import {Pool} from "pg";

export class PgPool {

    private static instance:Pool|undefined;

    static getInstance():Pool {
        if(!this.instance) {
            console.log("created new db-pool")
            PgPool.instance = new Pool(); // configuration is done with .env file
        }
        return <Pool>this.instance;
    }
}
