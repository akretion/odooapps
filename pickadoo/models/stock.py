# -*- coding: utf-8 -*-
# Copyright 2014-2017 Akretion (http://www.akretion.com).
# @author Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import api, fields, models


class StockPicking(models.Model):
    _inherit = 'stock.picking'

    @api.multi
    def process_picking(self):
        self.ensure_one()
        self.force_assign()
        return self.do_enter_transfer_details()

    def _prepare_todo_print_list(self):
        todo = []
        for label in self.env['shipping.label'].search([
                ('res_id', 'in', self.ids)]):
            if label.name == 'Address Label':
                printer_name = 'address_label'
                raw=False
            else:
                printer_name = 'label'
                raw=True
            todo.append(
                self.env['proxy.action.helper'].get_print_data_action(
                    label.datas,
                    printer_name=printer_name,
                    raw=False)
                )
        return todo

    @api.multi
    def print_label(self):
        todo = self._prepare_todo_print_list()
        return self.env['proxy.action.helper'].send_proxy(todo)
