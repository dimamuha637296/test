$(document).ready(function () {
    // Табы
    $(".tabs button").on('click', function () {

        $(this).addClass('active').siblings().removeClass('active');

        let data_tab_but = $(this).attr('data-tab');

        $('.tabsContentItem').each(function () {

            if (data_tab_but === "all") {
                $(this).fadeIn();
                return;
            }

            if (data_tab_but === $(this).attr('data-tab')) {
                $(this).fadeIn();
            } else {
                $(this).fadeOut();
            }
        });
    });
});