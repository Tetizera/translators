{
	"translatorID": "1e24635a-c1fd-4c15-8e61-67e220f8b617",
	"label": "Folha de São Paulo",
	"creator": "Philipp Zumstein, Bao Trinh",
	"target": "^https?://www\\.https://www.folha.uol.com.br/\\.com/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2021-09-05 03:55:56"
}

{
	"translatorID": "1e24635a-c1fd-4c15-8e61-67e220f8b617",
	"label": "Folha de São Paulo",
	"creator": "Tet",
	"target": "^https?://www\\.https://www.folha.uol.com.br/\\.com/",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "gcsibv",
	"lastUpdated": "2021-08-17 15:23:53"
}


/*
	***** BEGIN LICENSE BLOCK *****

	Copyright © 2021 Tet
	
	This file is part of Zotero.

	Zotero is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	Zotero is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with Zotero. If not, see <http://www.gnu.org/licenses/>.

	***** END LICENSE BLOCK *****
*/

function detectWeb(doc, url) {
	if (doc.querySelector('article.article')) {
		return "newspaperArticle";
	}
	else if (url.includes('/search/') && getSearchResults(doc, true)) {
		return "multiple";
	}
	return false;
}


function getSearchResults(doc, checkOnly) {
	var items = {};
	var found = false;
	var rows = doc.querySelectorAll('h2>a.title[href*="/article/"]');
	for (let row of rows) {
		let href = row.href;
		let title = ZU.trimInternal(row.textContent);
		if (!href || !title) continue;
		if (checkOnly) return true;
		found = true;
		items[href] = title;
	}
	return found ? items : false;
}

function doWeb(doc, url) {
	if (detectWeb(doc, url) == "multiple") {
		Zotero.selectItems(getSearchResults(doc, false), function (items) {
			if (items) ZU.processDocuments(Object.keys(items), scrape);
		});
	}
	else {
		scrape(doc, url);
	}
}

function scrape(doc, url) {
	var data = var data = ZU.xpathText(doc, '//script[@type="application/ld+json"]');
	var json = JSON.parse(data)[0];
	var translator = Zotero.loadTranslator('web');
	// Embedded Metadata

	translator.setTranslator('1e24635a-c1fd-4c15-8e61-67e220f8b617');
	translator.setHandler('itemDone', function (obj, item) {
		if (item.creators.length <= 1 && json.author) {
			item.creators = []; // since json.autor can be an array or an object containing an array
			if (Array.isArray(json.author)) {
				for (let author of json.author) {
					item.creators.push(ZU.cleanAuthor(author.name, "author"));
				}
			}
			else if (json.author.name) {
				for (let name of json.author.name) {
					item.creators.push(ZU.cleanAuthor(name, "author"));
		}
		item.publicationTitle = 'Folha de São Paulo';
		item.section = json.articleSection;
		item.ISSN = "1414-5723";
		item.complete();
	    }
    }
}
/** BEGIN TEST CASES **/
var testCases = [
	{
		"type": "web",
		"url": "https://www1.folha.uol.com.br/equilibrioesaude/2021/09/familiares-brigam-e-se-isolam-de-parentes-que-recusam-a-vacina-contra-covid.shtml",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "Familiares brigam e se isolam de parentes que recusam a vacina contra Covid ",
				"creators": [
					{
						"firstName": "Isabella",
						"lastName": "Menon",
						"creatorType": "author"
					}
				]
			}
		]
	},
	{
		"type": "web",
		"url": "https://www1.folha.uol.com.br/poder/2021/09/cpi-da-covid-deve-terminar-com-pontas-soltas-e-documentos-sem-analise.shtml",
		"items": [
			{
				"itemType": "newspaperArticle",
				"title": "CPI da Covid deve terminar com pontas soltas e documentos sem análise",
				"creators": [
					{
						"firstName": "Constança",
						"lastName": "Rezende",
						"creatorType": "author"
					}
				],
				"date": "2021-09-04",
				"ISSN": "1414-5723",
				"language": "pt-br",
				"publicationTitle": "Folha de São Paulo",
				"url": "https://www1.folha.uol.com.br/poder/2021/09/cpi-da-covid-deve-terminar-com-pontas-soltas-e-documentos-sem-analise.shtml",
			}
		]
	}
	
/** END TEST CASES **/
