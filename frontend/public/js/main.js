(function() {
    'use strict';

    $(document).ready(function() {
        $('.signup-button').on('click', function(e) {
            var $target = $(e.target);
            var $form = $($target.closest('form'));
            var errors = $form.find('.errors');
            errors.removeClass('active');

            $.ajax({
                url: '/api/v1/users',
                method: 'POST',
                data: $form.serialize(),
                success: function(data) {
                    window.location = '/welcome?referal=signup';
                },
                error: function(res) {
                    errors.html($.parseJSON(res.responseText).message);

                    if (!errors.hasClass('active')) {
                        errors.addClass('active');
                    }
                }
            });

            // prevent sending of the form
            return false;
        });

        $('.signin-button').on('click', function(e) {
            var $target = $(e.target);
            var $form = $($target.closest('form'));
            var errors = $form.find('.errors');
            errors.removeClass('active');

            $.ajax({
                url: '/signin',
                method: 'POST',
                data: $form.serialize(),
                success: function(data) {
                    if (data._id) {
                        window.location = '/u/' + data._id;
                    } else {
                        errors.html('This shouldn\'t have happened. Sorry.');
                    }
                },
                error: function(res) {
                    console.log(res);
                    if (res.responseText == 'Unauthorized') {
                        errors.html('Please check your credentials.');
                    } else {
                        errors.html($.parseJSON(res.responseText).message);
                    }

                    if (!errors.hasClass('active')) {
                        errors.addClass('active');
                    }
                }
            });

            // prevent sending of the form
            return false;
        });

        $('.drop-img').on('click', function(e) {
            var $target = $(e.target);
            $target.toggleClass('upsized');
        });
    });
})();
