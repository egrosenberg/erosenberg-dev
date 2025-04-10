/*global $*/

function loadDescription(name) {
    $.post(`/content/${name}`, (html) => {
        $('#description').fadeOut(() => $('#description').html(html).delay("1000").slideDown());
    }).fail(() => $('#description').fadeOut());
}

function loadSidebar(name) {
    $.post(`/list/${name}`, (html) => {
        $('#list').fadeOut(() => $('#list').html(html).delay("1000").slideDown());
    }).fail(() => $('#list').fadeOut());
}


function loadSubdescription(page, name) {
    $.post(`/description/${page}/${name}`, (html) => {
        $('#description').fadeOut(() => $('#description').html(html).delay("1000").slideDown());
    }).fail(() => $('#description').fadeOut());
}

$(document).ready(() => {
    $(document).on("click", ".halftone-control", (ev) => {
        const halftone = $(ev.currentTarget).closest(".halftone-container").find(".halftone");
        if (halftone.hasClass("paused")) {
            halftone.removeClass("paused");
            ev.currentTarget.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
        else {
            halftone.addClass("paused");
            ev.currentTarget.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    });

    // hook navigation
    $(".navigation a").on("click", (ev) => {
        // check if nav is active
        if (!ev.currentTarget.classList.contains("active")) {
            // load content
            const name = ev.currentTarget.dataset.name;
            loadDescription(name);
            loadSidebar(name);
            // mark all other navs as inactive
            $(".navigation a").removeClass("active");
            ev.currentTarget.classList.add("active");
            // update url
            window.history.pushState({"html": document.innerHTML,"pageTitle": name},"", `/${name}`);
        }
        else {
            // unload content
            $("#description").fadeOut();
            $("#list").fadeOut();
            // mark as inactive
            ev.currentTarget.classList.remove("active");
            // update url
            window.history.pushState({"html": document.innerHTML,"pageTitle": name},"", `/`)
        }
    });

    // hook navigation
    $(document).on("click", ".description-link", (ev) => {
        console.log("test");
        // check if nav is active
        if (!ev.currentTarget.classList.contains("active")) {
            // load content
            const name = ev.currentTarget.dataset.name;
            const page = window.location.pathname.match(/^\/[^\/]*/)[0]?.slice(1);
            loadSubdescription(page, name);
            // mark all other navs as inactive
            $(".description-link").removeClass("active");
            ev.currentTarget.classList.add("active");
            window.history.pushState({"html": document.innerHTML,"pageTitle": name},"", `/${page}/${name}`);
        }
        else {
            // unload content
            $("#description").fadeOut();
            // mark as inactive
            ev.currentTarget.classList.remove("active");
            const page = window.location.pathname.match(/^\/[^\/]*/)[0]?.slice(1);
            window.history.pushState({"html": document.innerHTML,"pageTitle": page},"", `/${page}`);
        }
    });

    // gradient following cursor
    $(".content").on("mousemove", (ev) => {
        const offsetX = $(".halftone-container-outer").offset().left;
        const offsetY = $(".halftone-container-outer").offset().top;
        const x = ev.pageX - offsetX;
        const y = ev.pageY - offsetY;
        console.log(x, y);
        $(".halftone").css({"--cursor-x": x+"px", "--cursor-y": y+"px"});
    });
    $(".content").on("mouseleave", () => {
        $(".halftone").css({"--cursor-x": "10000px", "--cursor-y":  "10000px"});
    });
});