# -*- coding: utf-8 -*-
# Copyright 2017 Akretion (http://www.akretion.com).
# @author Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import api, fields, models


class StockPicking(models.Model):
    _inherit = 'stock.picking'

    @api.multi
    def generate_shipping_labels(self, package_ids=None):
        if self.carrier_id.type == 'letter':
            data = self.env['report'].get_pdf(
                self.ids, 'delivery_letter_label.report_address_label')
            return [{
                'name': 'Address Label',
                'file': data,
                'file_type': 'pdf',
                }]
        else:
            return super(StockPicking, self).generate_shipping_labels(
                package_ids=package_ids)
