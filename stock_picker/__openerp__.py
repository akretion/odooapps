# -*- coding: utf-8 -*-
# © 2016 Akretion (http://www.akretion.com)
# Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

{'name': 'Stock Picker',
 'version': '7.0.0.0.1',
 'author': 'Akretion',
 'website': 'www.akretion.com',
 'license': 'AGPL-3',
 'category': 'Generic Modules',
 'description': """
    Picker application for tracking who have picked you order
 """,
 'depends': [
     'stock',
 ],
 'data': [
     'views/stock_picking_view.xml',
     'views/partner_view.xml',
     'data/stock_data.xml',
     'data/ir.exports.line.csv',
     'data/partner_sequence.xml',
 ],
 'installable': True,
 'application': True,
 }
