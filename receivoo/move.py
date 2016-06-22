# -*- coding: utf-8 -*-
# Copyright 2016 <https://akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, api


class StockMove(models.Model):
    _inherit = 'stock.move'

    @api.multi
    def get_receivoo_data(self):
        """Prepare data for receivoo module.

        Add or change values by overloading this function
        returns a dict
        """
        self.ensure_one()
        return {
            'id': self.id,
            'notify_add_item': True,
            'name': self.product_id.name,
            'product_id': self.product_id.get_receivoo_data(),
            'product_qty': self.product_qty,
        }
