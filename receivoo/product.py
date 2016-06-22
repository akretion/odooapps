# -*- coding: utf-8 -*-
# Copyright 2016 <https://akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, api


class Product(models.Model):
    _inherit = 'product.product'

    @api.multi
    def get_receivoo_data(self):
        """Prepare data for receivoo module.

        Add or change values by overloading this function
        returns a dict
        """
        self.ensure_one()
        return {
            'id': self.id,
            'name': self.name,
        }
