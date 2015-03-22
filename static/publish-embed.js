require(['dw/chart/publish'], function() {

    console.log('Gerando código do spiffy');

    $(function() {

        var action = $('.chart-actions .action-export-embed'),
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



            $.get('/plugins/export-embed/export-embed.twig', function(data) {
                console.log(data, chart_url);


                console.log(typeof(data));

                modal = $('<div class="publish-chart-action-modal modal hide">' + data + '</div>').modal();

                //$('.btn-export-zip', modal).click(exportAsZIP);

                // var ua = navigator.userAgent.toLowerCase();
                // if (ua.indexOf('safari') > -1 && ua.indexOf('chrome') == -1) {
                //     $('.safari-warning', modal).removeClass('hidden');
                // }

                publish_chart(function(err) {
                    if (err) throw err;

                    var htmlCode = '<iframe src="{urlChart}" frameborder="0"  allowtransparency="true"  allowfullscreen="allowfullscreen" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen" oallowfullscreen="oallowfullscreen" msallowfullscreen="msallowfullscreen" width="{w}" height="{h}"></iframe> ';

                    htmlCode = htmlCode.replace('{urlChart}', chart_url)
                        .replace('{w}', w)
                        .replace('{h}', h);

                    console.log(textileCode, htmlCode);

                    $('.codes').fadeIn('fast');
                    $('.loading').fadeOut('fast');

                    $('textarea#textileArea').html(textileCode);
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
                    console.log('failed');
                    callback('publish failed');
                    pending = false;
                });
                // in the meantime, check status periodically
                checkStatus();

                function checkStatus() {
                    $.getJSON('/api/charts/' + chart_id + '/publish/status', function(res) {
                        //$bar.css('width', (res * 0.2) + '%');
                        if (pending) setTimeout(checkStatus, 300);
                    });
                }
            };
        };



        // function makeSpiffyCode() {
        //     // add print-specific css
        //     var frame = $('#iframe-vis').get(0),
        //         w = frame.clientWidth,
        //         h = frame.clientHeight,
        //         px2cm = 0.03,
        //         frame_doc = frame.contentDocument,
        //         frame_win = frame.contentWindow;

        //     // append print style
        //     $('style#print', frame_doc).remove();

        //     var style = document.createElement('style');
        //     style.id = 'print';
        //     frame_doc.head.appendChild(style);
        //     style.innerHTML = '\n@media print { body { padding: 20px; } } \n @page { size: ' + (w*px2cm)+'cm '+(h*px2cm)+'cm; '+
        //         'margin-left: 0px; margin-right: 0px; margin-top: 0px; margin-bottom: 0px; }\n';

        //     // print
        //     setTimeout(function() { frame_win.print(); }, 100);
        //     console.log('Opa');
        // }

        // var cssPagedMedia = (function () {
        //     var style = document.createElement('style');
        //     document.head.appendChild(style);
        //     return function (rule) {
        //         style.innerHTML = rule;
        //     };
        // }());

        // cssPagedMedia.size = function (size, margin) {
        //     cssPagedMedia('@page {size: ' + size + '; margin: '+margin+';}');
        // };

        // function showModal() {
        //     $.get('/plugins/export-image/export-modal.twig', function(data) {
        //         modal = $('<div class="modal hide">' + data + '</div>').modal();
        //         $('.btn-export-chart', modal).click(exportAsImage);
        //         $('.btn-test', modal).click(testServer);
        //     });
        // }

    });

});
