/*global $*/

$(document).ready(() => {
    $(document).on("click", ".halftone-control", (ev) => {
        console.log("test");
        const halftone = $(ev.currentTarget).closest(".halftone-container").find(".halftone");
        if (halftone.hasClass("paused")) {
            halftone.removeClass("paused");
            ev.currentTarget.innerHTML = '<i class="fa-solid fa-pause"></i>';
        }
        else {
            halftone.addClass("paused");
            ev.currentTarget.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
    })
});