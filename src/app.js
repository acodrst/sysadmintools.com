import { marked } from "marked"
document.body.insertAdjacentHTML("beforeend", site.page);
let posts=document.getElementById("dposts")
const style = document.createElement("style");
style.textContent = site.css;
document.head.appendChild(style);
for (let i of site.posts){
  const out=marked.parse(
    i.post.replaceAll(/^\[\d+?\].+?$/gsm,"$&  ")
    .replace(/\s#(\w+)/gsm,"\n[#$1](https://mastodon.social/tags/$1)")
    .replace(/^#(\w+)/gsm,"\n[#$1](https://mastodon.social/tags/$1)")
    .replaceAll(/npub\w+/gsm,"[njumppub](https://njump.me/$&)")
    .replaceAll(/nevent\w+/gsm,"[njumpevent](https://njump.me/$&)")
  )
  posts.insertAdjacentHTML("beforeend",`<hr><b>${i.ts.slice(0,4)}-${i.ts.slice(4,6)}-${i.ts.slice(6,8)}</b>${out}\n`)
}
function dposts() {
  document.getElementById("terms").style.display = "none";
  posts.style.display = "block";
}
function export_site(){
  document.getElementById("terms").style.display = "none";
  posts.style.display = "block";
  const blob = new Blob([JSON.stringify(site,null,2)], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = "export_site.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
function terms() {
  document.getElementById("terms").style.display = "block";
  posts.style.display = "none";
}
globalThis.location="#log"
refresh();
function refresh() {
  const hash = globalThis.location.hash.substring(1) || "log";
  hash == "terms"
    ? terms()
    : hash=="export-site"? export_site()
    : dposts();
}
globalThis.addEventListener("hashchange", () => {
  refresh();
});
refresh();