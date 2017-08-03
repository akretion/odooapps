# -*- coding: utf-8 -*-
# Copyright 2014 2017 Akretion (http://www.akretion.com).
# @author Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

{'name': 'pickadoo',
 'version': '0.0.1',
 'author': 'Akretion',
 'website': 'www.akretion.com',
 'license': 'AGPL-3',
 'category': 'Generic Modules',
 'description': """
    Pickadoo application for managing your delivery
 """,
 'depends': [
     'stock',
     'delivery',
     'proxy_action',
     'stock_split_menu',
 ],
 'data': [
     'views/stock_view.xml',
     'wizard/stock_transfer_details.xml',
 ],
 'installable': True,
 'application': True,
}
