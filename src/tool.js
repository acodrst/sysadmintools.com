const backup = Deno.env.get("CL_SYS_BACKUP");
const toot = Deno.env.get("CL_TOOT");
const bid = Deno.readTextFileSync(Deno.env.get("CL_BID")).trim();
const bpass = Deno.readTextFileSync(Deno.env.get("CL_BPASS")).trim();
const nsechex = Deno.readTextFileSync(Deno.env.get("CL_NSECHEX")).trim();
const relays = [
  "wss://nostr.mom",
  "wss://relay.damus.io",
  "wss://nos.lol"
]
const state = {}
import { create } from "fpng-sign-serve";
import { BskyAgent, RichText } from '@atproto/api'
const post = Deno.readTextFileSync('post.txt').trim()
const tags = []
post.matchAll(/#\w+/gsm).forEach(j => {
  tags.push(j[0].slice(1))
})

let cmd, rep, out
if (tags.length > 0) {
  cmd = new Deno.Command("nostril", {
    args: ['--envelope', '--sec', nsechex, '--tagn', tags.length, ...tags, '--content', `${post}`]
  })
}
else {
  cmd = new Deno.Command("nostril", {
    args: ['--envelope', '--sec', nsechex, '--content', `${post}`]
  })
}
rep = cmd.outputSync();
if (post.length < 4) {
  Deno.exit()
}
for (let i in relays) {
  state[i] = state[i] || {}
  state[i].envelope = new TextDecoder().decode(rep.stdout)
  state[i].websocket = new WebSocket(relays[i]);
  state[i].websocket.addEventListener("open", () => {
    state[i].websocket.send(state[i].envelope)
  });
  state[i].websocket.addEventListener("message", (e) => {
    state[i].data = e.data
    state[i].websocket.close()
  });
}
if (post.length < 501) {
  cmd = new Deno.Command(toot, {
    args: ['auth']
  })
  rep = cmd.outputSync();
  out = new TextDecoder().decode(rep.stdout)
  if (!out.includes('ACTIVE')) {
    Deno.exit()
  }
}
if (post.length < 301) {
  const agent = new BskyAgent({
    service: 'https://bsky.social'
  })
  await agent.login({
    identifier: bid,
    password: bpass
  })
  const rt = new RichText({
    text: post
  })
  await rt.detectFacets(agent)
  await agent.post({
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString()
  })
}
if (post.length < 501) {
  cmd = new Deno.Command(toot, {
    args: ['post', `${post}`]
  })
  rep = cmd.outputSync();
}
const past = JSON.parse(Deno.readTextFileSync('past.json'))
const dt = new Date();
const tss = dt.toISOString().replaceAll(":", "").replaceAll("-", "").replaceAll(".", "");
//past.unshift({ "ts": tss, "post": post, "nostr": state[0].envelope })
Deno.writeTextFileSync('past.json', JSON.stringify(past, null, 2))
Deno.remove('/home/divine/websites/site/sys/post.txt')
const site = {}
site.page = Deno.readTextFileSync("assets/page.html");
site.css = Deno.readTextFileSync("assets/style.css");
site.posts = JSON.parse(Deno.readTextFileSync("past.json"))
await create(site, backup)
