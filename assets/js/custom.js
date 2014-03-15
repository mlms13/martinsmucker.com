(function () {
    function addNavToggle() {
        if (Modernizr.mq('(max-width: 800px)') && !$('.navbar-toggle').length) {
            $('<i class="icon-reorder navbar-toggle"></i>').prependTo('.navbar').on('click', function () {
                $(this).toggleClass('clicked').next('.navbar-list').toggleClass('visible');
            });
        }
    }
    addNavToggle();
    $(window).on('resize', function () {
        addNavToggle();
    });

    // enable fast clicking
    FastClick.attach(document.body);
}());
