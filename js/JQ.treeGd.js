(function ($)
{
    $.fn.treeGrid = function (opts)
    {
        return $(this).each(function ()
        {
            var element = ($(this));
            var data = [];
            var opts = [];
            var elt = element;
            var nElt = 0;
            var lvl = 0;
            var lvlMax = 0;
            var sepLine = ":~:";
            var urlJson = "";

            $(this).isset = function (val)
            {
                return typeof val != "undefined";
            }
            $(this).makeTree = function (object) {
                $(this).lvl++;
                var rsp = '';
                for (var property in object) {
                    if (object.hasOwnProperty(property)) {
                        if (typeof object[property] == "object") {
                            $(this).nElt++;
                            rsp += "<ul class='$(this)-ul'><li class='$(this)-node $(this)-li' id='$(this)-li-" + $(this).nElt + "'  ><button onClick='$(\"#$(this)-li-" + $(this).nElt + "\").click();' class='$(this)-node-btn' id='$(this)-li-" + $(this).nElt + "-btn' >open</button>" + property + "</li>\n";
                            rsp += "<span id='$(this)-li-" + $(this).nElt + "-span' class='$(this)-li-span lvl" + $(this).lvl + "'>" + $(this).makeTree(object[property]) + "</span>";
                            rsp += "</ul>\n";

                        } else {
                            //found a property which is not an object, check for your conditions here
                            //rsp+="<ul>\n<li>"+property+" = "+object[property]+"</li>\n</ul>\n";
                            rsp += $(this).sepLine + object[property] + "";
                        }
                    }
                }

                if ($(this).lvl > $(this).lvlMax)
                {
                    $(this).lvlMax = $(this).lvl;
                }
                $(this).lvl--;
                return rsp;
            }


            $(this).loadTree = function () {
                var contentTree = $(this).makeTree($(this).data);
                //console.log(contentTree);
                $(this).lvlMax--;
                $("#" + $(this).elt).html(contentTree + "<ul class='$(this)-ul'><li class='$(this)-li'>" + $(this).nElt + " elts</ul></li>");
                $(".$(this)-node").click(function (e)
                {
                    //console.log(e.target.id);

                    $("#" + e.target.id + "-span").toggle();


                    var btn = $("#" + e.target.id + "-btn");

                    var icon = "ui-icon-triangle-1-e";
                    if ($("#" + e.target.id + "-span").is(":visible"))
                    {
                        icon = "ui-icon-triangle-1-se";
                    }


                    btn.button({
                        icons: {
                            primary: icon
                        },
                        text: false
                    });
                });


                $(".$(this)-node-btn").button({
                    icons: {
                        primary: "ui-icon-triangle-1-se"
                    },
                    text: false
                });
                $(".$(this)-node-btn").click();
                if (!$(this).opts["getHtml"] || $(this).opts["getHtml"] == '')
                {
                    $(".lvl" + $(this).lvlMax).each(function (key, value)
                    {
                        // console.log(key + "--" + value.innerHTML);
                        var html = "<table><tr><td>" + value.innerHTML + "</td></tr></table>";

                        var regex = new RegExp($(this).sepLine, 'g');
                        html = html.replace(regex, "</td><td>");

                        $("#" + value.id).html(html);

                    });
                }
            }

            $(this).loadJson = function () {
                var p = $("#" + opts["frm"]).serialize();
                var myself = $(this);

//console.log(p);
                $.ajax({
                    url: $(this).opts["url"],
                    data: p,
                    dataType: 'json',
                    success: function (response) {
                        // response should be automagically parsed into a JSON object
                        // now you can just access the properties using dot notation:
                        myself.data = response;
                        myself.loadTree();
                    }
                });
            };



            $(this).init = function (id, opts)
            {

                $("#" +elt).html("loading ...");
                //$(this).loadJson('./WS/treeGrid.php');
                $(this).loadJson();

            }

            $(this).search = function ()
            {

                $("#" + $(this).elt).html("loading ...");
                //$(this).loadJson('./WS/treeGrid.php');
                $(this).loadJson();

            }

            $(this).opts = opts;

            if (!$(this).isset(opts["url"]))
            {
                alert("Pas d'URL!");
            }
            if (opts["getHtml"])
            {
                sepLine = "";
            }
            //$(this).elt = id;

        });
    };
})(jQuery);
