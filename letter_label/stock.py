# -*- coding: utf-8 -*-
###############################################################################
#
#   Module for Odoo
#   Copyright (C) 2015 Akretion (http://www.akretion.com).
#   @author Valentin CHEMIERE <valentin.chemiere@akretion.com>
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
from openerp.tools.translate import _


class StockPickingOut(orm.Model):
    _inherit = 'stock.picking.out'

    def _prepare_todo_print_list(self, cr, uid, ids, context=None):
        assert len(ids) == 1, 'Process only one a single id at a time.'
        proxy_obj = self.pool['proxy.action.helper']
        todo = super(StockPickingOut, self)._prepare_todo_print_list(cr, uid, ids, context)
        if context.get('letter_number', False):
            todo.append(
                proxy_obj.get_print_report_action(
                    cr, uid, 'report.letter.label',
                    'stock.picking.out', ids,
                    printer_name="small_label",
                    context=context)
                )
            self.pool.get('stock.picking.out').set_letter_number(cr, uid, ids, context.get('letter_number'))
        return todo

    def get_display_address(self, cr, uid, id, context=None):
        assert len(id) == 1, 'Process only one a single id at a time.'
        picking_obj = self.pool.get('stock.picking.out')
        partner_obj = self.pool.get('res.partner')
        picking = picking_obj.browse(cr, uid, id[0])
        address_display = partner_obj._display_address(cr, uid, picking.partner_id, context=context)
        return address_display.replace('\n', '<br/>')

    def get_picking_info(self, cr, uid, name, context=None):
        picking_obj = self.pool.get('stock.picking.out')
        picking_ids = picking_obj.search(cr, uid,(
            ['name', '=', name],
            ['state', 'in', ('assigned', 'started')]
        ))
        result = False
        for pick in picking_obj.browse(cr, uid, picking_ids):
            result = {}
            result['is_cn23'] = pick.colipostefr_send_douane_doc
            result['is_letter'] = True if pick.carrier_id.type == 'letter' else False
            result['picking_id'] = pick.id
        return result

    def validate_and_print_picking(self, cr, uid, id, letter_number=False, context=None):
        if letter_number:
            context.update({'letter_number': letter_number})
        pick_obj = self.pool.get('stock.picking.out')
        pick = pick_obj.browse(cr, uid, id)
        move_datas = {}
        for move in pick.move_lines:
            move_datas[move.id] = self._prepare_move_information(cr, uid, move)
        result = self.process_picking(cr, uid, [id], move_datas, context)
        return result

    def set_letter_number(self, cr, uid, ids, letter_number, context=None):
        assert len(ids) == 1, 'Process only one a single id at a time.'
        pick_obj = self.pool.get('stock.picking.out')
        pick = pick_obj.browse(cr, uid, ids[0])
        pick.write({'carrier_tracking_ref': letter_number})
