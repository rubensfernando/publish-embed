require(['dw/chart/publish'], function() {

    $(function() {

        var action = $('.chart-actions .action-publish-embed'),
            modal;

        $('a', action).click(function(e) {
            e.preventDefault();
            showModal();
        });

        var showModal = function() {
            var chart = dw.backend.currentChart,
                chart_id = chart.get('id'),
                chart_url = 'http://' + dw.backend.__chartCacheDomain + '/' + chart_id + '/',
                w = chart.get('metadata.publish.embed-width'),
                h = chart.get('metadata.publish.embed-height'),
                titleChart = chart.get('title');



            $.get('/plugins/publish-embed/publish-embed.twig', function(data) {

                console.log(typeof(data));

                modal = $('<div class="publish-chart-action-modal modal hide">' + data + '</div>').modal();

                publish_chart(function(err) {
                    if (err) throw err;

                    var htmlCode = '<iframe src="{urlChart}" frameborder="0"  allowtransparency="true"  allowfullscreen="allowfullscreen" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen" oallowfullscreen="oallowfullscreen" msallowfullscreen="msallowfullscreen" width="{w}" height="{h}"></iframe> ';

                    htmlCode = htmlCode.replace('{urlChart}', chart_url)
                        .replace('{w}', w)
                        .replace('{h}', h);

                    //console.log(textileCode, htmlCode);

                    $('.codes').fadeIn('fast');
                    $('.loading').fadeOut('fast');

                    //$('textarea#textileArea').html(textileCode);
                    $('textarea#htmlArea').html(htmlCode);
                });

            });



            console.log(chart_url);

            function publish_chart(callback) {
                var pending = true;

                if (chart.get('publishedAt') && chart.get('publishedAt') > chart.get('lastModifiedAt')) {
                    // no change since last publish
                    return callback(null);
                }

                $.ajax({
                    url: '/api/charts/' + chart_id + '/publish?local=1',
                    type: 'post'
                }).done(function() {
                    callback(null);
                }).fail(function() {
                    console.error('failed');
                    callback('publish failed');
                    pending = false;
                });
                // in the meantime, check status periodically
                checkStatus();

                function checkStatus() {
                    $.getJSON('/api/charts/' + chart_id + '/publish/status', function(res) {
                        if (pending) setTimeout(checkStatus, 300);
                    });
                }
            };
        };

    });

});
