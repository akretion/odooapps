# -*- coding: utf-8 -*-
# Copyright 2017 Akretion (http://www.akretion.com).
# @author Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import api, fields, models

class StockTransferDetails(models.Model):
    _inherit = 'stock.transfer_details'

    @api.multi
    def do_detailed_transfer_with_print(self):
        self.ensure_one()
        if self.picking_id.state != 'done':
            self.put_residual_in_new_pack()
            self.do_detailed_transfer()
            self.picking_id.action_generate_carrier_label()
        return self.picking_id.print_label()
