# -*- coding: utf-8 -*-
# Copyright 2017 Akretion (http://www.akretion.com).
# @author Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import api, fields, models

class StockTransferDetails(models.Model):
    _inherit = 'stock.transfer_details'

    carrier_id = fields.Many2one(
        'delivery.carrier',
        'Carrier',
        related="picking_id.carrier_id")
    manual_tracking_ref = fields.Char()
    mobile = fields.Char(related="picking_id.partner_id.mobile")
    phone = fields.Char(related="picking_id.partner_id.phone")

    @api.multi
    def _set_manual_tracking(self):
        if self.manual_tracking_ref:
            packages = self.picking_id._get_packages_from_picking()
            packages.write({'parcel_tracking': self.manual_tracking_ref})

    @api.multi
    def do_detailed_transfer_manual_tracking(self):
        self.ensure_one()
        if self.picking_id.state != 'done':
            self.put_residual_in_new_pack()
            self.do_detailed_transfer()
            self._set_manual_tracking()
        return True

    @api.multi
    def do_detailed_transfer_with_print(self):
        self.ensure_one()
        if self.picking_id.state != 'done':
            self.put_residual_in_new_pack()
            self.do_detailed_transfer()
            self._set_manual_tracking()
            self.picking_id.action_generate_carrier_label()
        return self.picking_id.print_label()
