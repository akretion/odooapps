# -*- coding: utf-8 -*-
###############################################################################
#
#   Module for OpenERP
#   Copyright (C) 2015 Akretion (http://www.akretion.com).
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

from openerp import models, fields, api

class StockPicking(models.Model):
    _inherit = 'stock.picking'

    supplier_ref = fields.Char()


class Receivoo(models.TransientModel):
    _name = 'receivoo'

    @api.model
    def _prepare_reception_operation(self, move, move_data):
        return {
            'picking_id': move.picking_id.id,
            'product_id': move.product_id.id,
            'product_qty': move_data['product_qty'],
            'location_id': move.location_id.id,
            'location_dest_id': move.location_dest_id.id,
            'product_uom_id': move.product_uom.id,
            'processed': 'false',
            'lot_id': move.restrict_lot_id.id,
        }

    @api.model
    def get_picking_type(self):
        domain = [('code', '=', 'incoming')]
        res = []
        for picking_type in self.env['stock.picking.type'].search(domain):
            res.append({
                'id': picking_type.id,
                'name': picking_type.warehouse_id.name,
                })
        return res

    @api.model
    def get_supplier(self, picking_type_id):
        domain = [
            ('picking_type_id', '=', picking_type_id),
            ('state', '=', 'assigned'),
            ]
        processed_supplier_ids = []
        res = []
        for picking in self.env['stock.picking'].search(domain):
            partner = picking.partner_id
            if not partner.id in processed_supplier_ids:
                res.append({'id': partner.id, 'name': partner.name})
                processed_supplier_ids.append(partner.id)
        return res

    @api.model
    def do_incoming_transfer(self, data, supplier_ref=None):
        move_ids = [m['id'] for m in data]
        move_obj = self.env['stock.move']
        moves = move_obj.browse(move_ids)
        picking_list = []
        id2move = {}
        for move in moves:
            id2move[move.id] = move
            if not move.picking_id in picking_list:
                picking_list.append(move.picking_id)
        for picking in picking_list:
            if picking.pack_operation_ids:
                picking.pack_operation_ids.unlink()
        for move_data in data:
            vals = self._prepare_reception_operation(
                id2move[move_data['id']], move_data)
            self.env['stock.pack.operation'].create(vals)
        for picking in picking_list:
            picking.write({'supplier_ref': supplier_ref})
            picking.do_transfer()
        return True

    @api.model
    def _prepare_move_data(self, move):
        return {
            'id': move.id,
            'notify_add_item': True,
            'name': move.product_id.name,
            'product_id': {
                'id': move.product_id.id,
                'name': move.product_id.name,
                },
            'lot_id': {
                'id': move.restrict_lot_id.id,
                'name': move.restrict_lot_id.name,
                },
            'product_qty': move.product_qty,
            }

    @api.model
    def get_incoming_move(self, supplier_id, picking_type_id):
        domain = [
            ('picking_id.partner_id', '=', supplier_id),
            ('picking_type_id', '=', picking_type_id),
            ('state', '=', 'assigned'),
            ]
        res = []
        for move in self.env['stock.move'].search(domain):
            res.append(self._prepare_move_data(move))
        return res

    @api.model
    def notify_add_item(self, move_data):
        return True
