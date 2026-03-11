import { db } from "./db";
import fs from "fs";
function render(view: string) {
    const layout = fs.readFileSync("./views/layout/main.html", "utf8");
    return layout.replace("{{content}}", view);
}
Bun.serve({
    port: 3000,
    async fetch(req) {
        const url = new URL(req.url);
        // DASHBOARD
        if (url.pathname == "/") {
            const [rows]: any = await db.query(
                "SELECT COUNT(*) as total FROM mahasiswa"
            );
            let view = fs.readFileSync(
                "./views/dashboard/index.html", "utf8"
            );
            view = view.replace(
                "{{total}}",
                rows[0].total
            );
            return new Response(render(view), {
                headers: { "Content-Type": "text/html" }
            });
        }
        // LIST MAHASISWA
        if (url.pathname == "/mahasiswa") {
            const [rows]: any = await db.query(
                "SELECT * FROM mahasiswa"
            );
            let table = "";
            rows.forEach((m: any) => {
                table += `
<tr>
<td class="p-2">${m.id}</td>
<td class="p-2">${m.nama}</td>
<td class="p-2">${m.jurusan}</td>
<td class="p-2">${m.angkatan}</td>
<td class="p-2">
<a href="/mahasiswa/edit/${m.id}"
class="text-blue-500">
Edit
</a>
<a href="/mahasiswa/delete/${m.id}"
class="text-red-500 ml-2">
Delete
</a>
</td>
</tr>
`
            });
            let view = fs.readFileSync(
                "./views/mahasiswa/index.html", "utf8"
            );
            view = view.replace("{{rows}}", table);
            return new Response(render(view), {
                headers: { "Content-Type": "text/html" }
            });
        }
        return new Response("Not Found");
    }
});