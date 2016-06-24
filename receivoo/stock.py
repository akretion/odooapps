# -*- coding: utf-8 -*-
# Copyright 2016 <https://akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, fields


class StockPicking(models.Model):
    _inherit = 'stock.picking'

    supplier_ref = fields.Char(
        "Supplier reference",
        help="Delivery slip reference")
