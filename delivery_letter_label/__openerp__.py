# -*- coding: utf-8 -*-
# Copyright 2017 Akretion (http://www.akretion.com).
# @author Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

{
    "name": "Delivery Partner Label",
    "summary": "Print delivery partner label",
    "version": "8.1.0.0",
    "category": "Delivery",
    "website": "www.akretion.com",
    "author": " Akretion",
    "license": "AGPL-3",
    "application": False,
    "installable": True,
    "external_dependencies": {
        "python": [],
        "bin": [],
    },
    "depends": [
        "pickadoo",
    ],
    "data": [
        "report/address_label.xml",
    ],
    "demo": [
    ],
    "qweb": [
    ]
}
