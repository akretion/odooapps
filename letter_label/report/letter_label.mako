<!DOCTYPE html SYSTEM "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta content="text/html; charset=UTF-8" http-equiv="content-type"/>
    
    <style type="text/css">
        p {
            margin-top:5px;
        }
        div {
            font-family: "Courier";
            font-size: 17px;
            text-align: center;
            margin: -1px;
        }

        #head {
            height: 29px;
        }

        body {
            padding-top: 10px;
            height: 125px;
            width: 435px;
        }

    </style>
    <body class="body" >
        %for o in objects:
            <div id="label">
                <div id="customer_name">
                    <p>${o.partner_id.name}</p>
                    <p>${o.get_display_address()}</p>
                </div>

            </div>
        %endfor
    </body>
</html>
