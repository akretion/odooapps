# -*- coding: utf-8 -*-
###############################################################################
#   Copyright (C) 2014 Akretion (http://www.akretion.com).
#   @author Sébastien BEAU <sebastien.beau@akretion.com>
#   AGPL
###############################################################################

from openerp.osv import orm
from openerp import netsvc


class StockPickingOut(orm.Model):
    _inherit = "stock.picking.out"

    def _prepare_todo_print_list(self, cr, uid, ids, context=None):
        todo = super(StockPickingOut, self)._prepare_todo_print_list(
            cr, uid, ids, context=context)
        picking = self.browse(cr, uid, ids, context=context)[0]
        proxy_obj = self.pool['proxy.action.helper']
        # old cn23
        if picking.colipostefr_send_douane_doc:
            # CN23 are printing in first
            todo.insert(0, proxy_obj.get_print_report_action(
                cr, uid, 'report.stock.picking.cn23',
                'stock.picking.out', ids,
                copies=3,
                context=context))
            print '   >>>> Send Douane CN23'

        # New WS CN23
        cn_obj = self.pool['ir.attachment']
        cn_ids = cn_obj.search(cr, uid, [
            ['res_id', 'in', ids],
            ['name', 'ilike', 'CN23%.pdf'],
        ], context=context)
        if cn_ids:
            cn = cn_obj.browse(cr, uid, cn_ids, context=context)[0]
            todo.insert(0, proxy_obj.get_print_data_action(
                cr, uid, cn.datas, raw=True, context=context))
            print '   >>>> CN23 in attachment'

        # Add invoice report
        if (cn_ids or picking.colipostefr_send_douane_doc) and picking.sale_id:
            invoice_ids = []
            for invoice in picking.sale_id.invoice_ids:
                invoice_ids.append(invoice.id)
                if invoice.state == 'draft':
                    wf_service = netsvc.LocalService("workflow")
                    wf_service.trg_validate(
                        uid, 'account.invoice',
                        invoice.id, 'invoice_open', cr)
            todo.insert(1, proxy_obj.get_print_report_action(
                cr, uid, 'report.account.invoice',
                'account.invoice', invoice_ids,
                context=context))
            print '   >>>> Facture'

        return todo
