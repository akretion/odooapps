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
from openerp.tools.translate import _


class StockPicking(orm.Model):
    _inherit = 'stock.picking'

    _columns = {
        'process_in_pickadoo': fields.related(
            'carrier_id',
            'process_in_pickadoo',
            type='boolean',
            string='Process in pickadoo'),
        'prepared': fields.boolean('Prepared'),
    }

class StockPickingOut(orm.Model):
    _inherit = 'stock.picking.out'

    _columns = {
        'process_in_pickadoo': fields.related(
            'carrier_id',
            'process_in_pickadoo',
            type='boolean',
            string='Process in pickadoo'),
        'prepared': fields.boolean('Prepared'),
    }

    def _prepare_sync_data_pickadoo(self, cr, uid, picking, context=None):
        moves = {}
        for move in picking.move_lines:
            if not (picking.move_type == 'direct'
                    and move.state != 'assigned'):
                data = self._prepare_move_information(
                    cr, uid, move, context=context)
                moves[move.id] = data
        partner = picking.final_partner_id or picking.partner_id
        payment_code = picking.sale_id\
            and picking.sale_id.payment_method_id.code or ""
        if picking.pending_payment_location:
            payment_code += u' / BAC paiement en attente'
        return {
            'id': picking.id,
            'name': picking.name,
            'origin': picking.sale_id and picking.sale_id.client_order_ref \
                      or picking.origin or '',
            'partner': partner.name,
            'carrier_method': picking.carrier_id.name or '',
            'order_date': picking.sale_id.date_order or '',
            'moves': moves,
            'email': partner.email,
            'paid': picking.paid,
            'payment_method': payment_code,
            'note': picking.sale_id.note or "",
            'process_in_pickadoo': picking.process_in_pickadoo,
            'partial': 'Partiel' if picking.move_type == 'direct' else '',
        }

    def _prepare_move_information(self, cr, uid, move, context=None):
        product = move.product_id
        return {
            'id': move.id,
            'product': {
                'model': product.base_default_code,
                'name': product.name,
                'color': product.color_id.name,
                'size': product.size_id.name,
                'collection': product.categ_id.name,
                'brand': product.categ_brand_id.name,
                'ean': product.ean13 or '',
                },
            'qty': move.product_qty,
        }

    def process_picking(self, cr, uid, ids, data_moves, context=None):
        assert len(ids) == 1, 'You can only process one picking'
        partial_datas = {}
        for move_id, move_data in data_moves.items():
            partial_datas["move" + str(move_id)] = {
                'product_qty': float(move_data['qty']),
                'product_uom': 1, #TODO FIXME should be not hardcoded
                }
        self.do_partial(cr, uid, ids, partial_datas, context=context)
        return self.print_label(cr, uid, ids)

    def print_label(self, cr, uid, ids, context=None):
        assert len(ids) == 1, 'Process only one a single id at a time.'
        label_obj = self.pool['shipping.label']
        label_ids = label_obj.search(cr, uid, [
            ['res_id', 'in', ids],
            ], context=context)
        action_list = []
        for label in label_obj.browse(cr, uid, label_ids, context=context):
            action_list.append({
                'url': 'https://localhost/cups/printData',
                'params': {
                    'args': ['zebra', label.datas],
                    'kwargs': {'options': {'raw': True}},
                    }
                })

        picking = self.browse(cr, uid, ids, context=context)[0]
        if picking.colipostefr_send_douane_doc:
            self.pool['stock.picking.out'].cn23_trigger(
                cr, uid, ids, context=context)
            cn_obj = self.pool['ir.attachment']
            cn_ids = cn_obj.search(cr, uid, [
                    ['res_id', 'in', ids],
                    ['name', '=', 'CN23.pdf'],
                ], context=context)
            action_a4 = {}
            cn = cn_obj.browse(cr, uid, cn_ids, context=context)[0]
            action_cn23 = {
                'url' : 'https://localhost/cups/printData',
                'params': {
                    'args': ['laser', cn.datas],
                    'kwargs': {'options': {'raw': True, 'copies': 3}},
                }
            }
            action_list.insert(0, action_cn23)
        return {
            'type': 'ir.actions.act_proxy',
            'action_list': action_list,
            }

    def cn23_trigger(self, cr, uid, ids, context=None):
        service = netsvc.LocalService('report.stock.picking.cn23')
        (result, format) = service.create(
            cr, uid, ids, {'model': 'stock.picking.out'}, context)
        return True

    def start_processing(self, cr, uid, ids, context=None):
        return True

    def set_prepared(self, cr, uid, ids, context=None):
        return self.write(cr, uid, ids, {'prepared': True}, context=context)

    def _get_domain_for_print_from_number(self, cr, uid, number, context=None):
        return [['name', '=', number]]

    def print_from_number(self, cr, uid, number, context=None):
        domain = self._get_domain_for_print_from_number(
            cr, uid, number, context=context)
        picking_ids = self.search(cr, uid, domain, context=context)
        if picking_ids:
            return self.print_label(cr, uid, picking_ids, context=context)
        else:
            raise orm.except_orm(
                _('User Error'),
                _('There is no picking found for number %s') % number)
