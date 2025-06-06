/* TABLE OF CONTENTS */
    
document.addEventListener("DOMContentLoaded", function(event) {
    
    if (document.getElementsByClassName("table-of-contents").length > 0) {

        const headings = Array.from(document.getElementById("main-content").getElementsByTagName('h2', 'h3'));
        const tocContainer = document.querySelector(".table-of-contents");
        const ul = document.createElement("ul");
        
        ul.classList.add("collapsible-sidebar-body");
        tocContainer.appendChild(ul);
        headings.map((heading, index) => {
            const id = heading.innerText.toLowerCase().replaceAll(" ", "_");
            var level = 1;
            if (heading.tagName == "H2") {
                level = 1; 
            } else if (heading.tagName == "H3") {
                level = 2;
            }
            heading.setAttribute("id", id);
            var anchorElement = `<a href="#${id}">${heading.textContent}</a>`;
            if (index === 0) {
                anchorElement = `<a href="#${id}" class="toc-level-${level} active current">${heading.textContent}</a>`;
            } else {
                anchorElement = `<a href="#${id}" class="toc-level-${level}">${heading.textContent}</a>`;
            }
            var keyPointer = `<li>${anchorElement}</li>`;
            ul.insertAdjacentHTML("beforeend", keyPointer);
        });

        const tocAnchors = tocContainer.querySelectorAll("a");

        const obFunc = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = headings.indexOf(entry.target);
                    tocAnchors.forEach((tab) => {
                        tab.classList.remove("active", "current");
                    });
                    tocAnchors[index].classList.add("active", "current");
                }
            })
        };
        const obOption = {
            rootMargin: "0px 0% -20%",
            threshold: 1
        };

        const observer = new IntersectionObserver(obFunc, obOption);
        headings.forEach((hTwo) => observer.observe(hTwo));

    }

});

