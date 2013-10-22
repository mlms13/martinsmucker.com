(function () {
    function addNavToggle() {
        if (Modernizr.mq('(max-width: 800px)')) {
            $('<i class="icon-reorder navbar-toggle"></i>').prependTo('.navbar').on('click', function () {
                $(this).toggleClass('clicked').next('.navbar-list').toggleClass('visible');
            })
        }
    }
    addNavToggle();
    $(window).on('resize', function () {
        console.log('resized');
        addNavToggle();
    });
}());
