# -*- coding: utf-8 -*-
###############################################################################
#
#   Module for OpenERP
#   Copyright (C) 2014 Akretion (http://www.akretion.com).
#   @author Sébastien BEAU <sebastien.beau@akretion.com>
#
#   This program is free software: you can redistribute it and/or modify
#   it under the terms of the GNU Affero General Public License as
#   published by the Free Software Foundation, either version 3 of the
#   License, or (at your option) any later version.
#
#   This program is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU Affero General Public License for more details.
#
#   You should have received a copy of the GNU Affero General Public License
#   along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
###############################################################################

from openerp.osv import fields, orm


class StockPickingOut(orm.Model):
    _inherit="stock.picking.out"

    def _prepare_todo_print_list(self, cr, uid, ids, context=None):
        todo = super(StockPickingOut, self)._prepare_todo_print_list(
            cr, uid, ids, context=context)
        picking = self.browse(cr, uid, ids, context=context)[0]
        if picking.colipostefr_send_douane_doc:
            proxy_obj = self.pool['proxy.action.helper']
            #CN23 are printing in first
            todo.insert(0,
                proxy_obj.get_print_report_action(
                    cr, uid, 'report.stock.picking.cn23',
                    'stock.picking.out', ids,
                    copies=3,
                    context=context)
                )
            #Add invoice report
            invoice_ids = []
            for invoice in picking.sale_id.invoice_ids:
                invoice_ids.append(invoice.id)
                if invoice.state == 'draft':
                    wf_service.trg_validate(
                        uid, 'account.invoice',
                        invoice.id, 'invoice_open', cr)
            todo.insert(1,
                proxy_obj.get_print_report_action(
                    cr, uid, 'report.account.invoice',
                    'account.invoice', invoice_ids,
                    context=context)
                )
        return todo
