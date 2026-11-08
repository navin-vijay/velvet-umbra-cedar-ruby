import assert from "node:assert/strict";
import test from "node:test";
import { buildDetailCsv, buildDetailJson } from "./export-files.ts";
import { parseIngredientHtml, type IngredientLink } from "./tgsc.ts";

const item: IngredientLink = {
  name: "linalool",
  prefix: "",
  path: "/data/rw1000001.html",
  url: "https://www.thegoodscentscompany.com/data/rw1000001.html",
  cas: "78-70-6",
  uses: "fragrance",
  kind: "rw",
  letter: "l",
};

test("parses ingredient identity and every section table row", () => {
  const html = `
    <h1><span itemprop="name">Linalool</span><br><span class="headsynonym">linalool, natural</span></h1>
    <div class="qinfr2">Category:<span>Fragrance Ingredient</span></div>
    <div class="sectionclass">Physical Properties:</div>
    <table class="cheminfo">
      <tr><td class="radw4">Molecular formula:</td><td class="radw11">C10H18O &amp; test</td></tr>
      <tr><td class="radw4">Reference:</td><td><a href="/misc/ref.html">Source page</a></td></tr>
    </table>
    <div class="sectionclass">Organoleptic Properties:</div>
    <table class="cheminfo"><tr><td>Odor description.</td></tr></table>
    </section>
  `;

  const detail = parseIngredientHtml(html, item);
  assert.equal(detail.title, "Linalool");
  assert.equal(detail.synonym, "linalool, natural");
  assert.equal(detail.category, "Fragrance Ingredient");
  assert.equal(detail.sections.length, 2);
  assert.equal(detail.sections[0]?.rows[0]?.label, "Molecular formula:");
  assert.equal(detail.sections[0]?.rows[0]?.value, "C10H18O & test");
  assert.equal(
    detail.sections[0]?.rows[1]?.cells[1]?.links[0]?.url,
    "https://www.thegoodscentscompany.com/misc/ref.html",
  );
  assert.equal(detail.sections[1]?.rows[0]?.cells[0]?.text, "Odor description.");

  const csv = buildDetailCsv([detail]);
  assert.match(csv, /sections_json/);
  assert.match(csv, /Physical Properties/);
  const json = JSON.parse(buildDetailJson([detail], ["l"], [], []));
  assert.equal(json.schema, "tgsc-perfume-catalog/v1");
  assert.equal(json.ingredients[0].sections.length, 2);
});
