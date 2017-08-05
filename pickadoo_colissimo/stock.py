# -*- coding: utf-8 -*-
# Copyright 2017 Akretion (http://www.akretion.com).
# @author Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import api, fields, models


class StockPicking(models.Model):
    _inherit = 'stock.picking'

    def _prepare_todo_print_list(self):
        todo = super(StockPicking, self)._prepare_todo_print_list()
        proxy_obj = self.pool['proxy.action.helper']
        helper = self.env['proxy.action.helper']
        cn23 = self.env['ir.attachment'].search([
            ['res_id', 'in', self.ids],
            ['name', 'ilike', 'CN23%.pdf']])
        if cn23:
            todo.insert(0, helper.get_print_data_action(
                cn23[0].datas, raw=False, printer_name='laser'))

            invoice_ids = []
            for invoice in self.sale_id.invoice_ids:
                if invoice.state == 'draft':
                    invoice.signal_workflow('invoice_open')
                todo.insert(1,
                    helper.get_print_report_action(
                        invoice, 'account.report_invoice',
                        copies=4, printer_name='laser'))
        return todo
