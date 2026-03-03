"use strict";

parserFactory.register("mtlreader.com", () => new MtlreaderParser());

class MtlreaderParser extends Parser {
    constructor() {
        super();
    }

    async getChapterUrls(dom) {
        return this.getChapterUrlsFromMultipleTocPages(dom,
            this.extractPartialChapterList,
            this.getUrlsOfTocPages,
            chapterUrlsUI
        );
    }
    extractPartialChapterList(dom) {
        let links = [...dom.querySelectorAll("a.chapter-link")];
        if (links.length === 0) {
            return [];
        }
        return links.map(a => util.hyperLinkToChapter(a));
    }

    getUrlsOfTocPages(dom) {
        let urls = [];
        let seen = new Set();
        dom.querySelectorAll("a.page-link").forEach(a => {
            let href = a.href;
            if (href && href.includes("?page=")) {
                if (!seen.has(href)) {
                    seen.add(href);
                    urls.push(href);
                }
            }
        });
        // sort by page number
        urls.sort((a, b) => {
            let pa = parseInt(a.split("?page=")[1] || "1");
            let pb = parseInt(b.split("?page=")[1] || "1");
            return pa - pb;
        });
        return urls;
    }
    
    findContent(dom) {
         return dom.querySelector("div[class~='8e9ce57f1a']"); //fix
    }

    extractTitleImpl(dom) {
        return dom.querySelector("div.agent-title");
    }

    findChapterTitle(dom) {
        return dom.querySelector("div[class='col-md-12 text-center']").textContent.trim(); //fix
    }

    findCoverImageUrl(dom) {
        return dom.querySelector("img.img-fluid.img-thumbnail.mx-auto.d-block").src;//fix
    }

    getInformationEpubItemChildNodes(dom) {
        return [...dom.querySelectorAll("div.mb-2[style*='line-height:1.6']")]; //fix
    }

    extractAuthor(dom) {
        return dom.querySelectorAll('i.fa.fa-user')[0].nextSibling.data.replace("Author:","").trim(); //fix
    }
}
