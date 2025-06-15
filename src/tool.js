const backup = Deno.env.get("CL_SYS_BACKUP");
import { create } from "fpng-sign-serve";
const site = {}
site.page = Deno.readTextFileSync("assets/page.html");
site.css = Deno.readTextFileSync("assets/style.css");
site.posts = JSON.parse(Deno.readTextFileSync("past.json"))
Deno.writeTextFileSync("past.json",JSON.stringify(site.posts))
await create(site, backup)
