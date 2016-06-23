# -*- coding: utf-8 -*-
# Copyright 2016 <https://akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).

from openerp import models, api


class Receivoo(models.TransientModel):
    """API for goods receiption from external system."""

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
        }
#            'lot_id': move.restrict_lot_id.id,

    @api.model
    def get_picking_type(self):
        """List of places where you will do the receiption.

        In simple cases, there is one picking type per warehouse.
        """
        res = []
        for warehouse in self.env['stock.warehouse'].search([]):
            res.append({
                'id': warehouse.in_type_id.id,
                'name': warehouse.name,
            })
        return res

    @api.model
    def get_supplier(self, picking_type_id):
        """List of suppliers for a given picking_type."""
        processed_supplier_ids = []
        res = []
        domain = [
            ('picking_type_id', '=', picking_type_id),
            ('state', '=', 'assigned'),
        ]
        for picking in self.env['stock.picking'].search(domain):
            partner = picking.partner_id
            if not partner.id in processed_supplier_ids:
                res.append({'id': partner.id, 'name': partner.name})
                processed_supplier_ids.append(partner.id)
        return res

    @api.model
    def do_incoming_transfer(self, data, supplier_ref=None):
        """Mark a given move as done.

        data: a list of move (given in a precedent call
            by get_incoming_move)
        supplier_ref: (opt) name of the delivery slip 
        """
        picking_list = []
        id2move = {}
        move_ids = [m['id'] for m in data]
        moves = self.env['stock.move'].browse(move_ids)
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

#            'lot_id': {
#               'id': move.restrict_lot_id.id,
#              'name': move.restrict_lot_id.name,
#             },

    @api.model
    def get_incoming_move(self, supplier_id, picking_type_id):
        """Return a list of move for a given supplier / picking_type."""
        domain = [
            ('picking_id.partner_id', '=', supplier_id),
            ('picking_type_id', '=', picking_type_id),
            ('state', '=', 'assigned'),
        ]
        res = []
        for move in self.env['stock.move'].search(domain):
            res.append(move.get_receivoo_data())
        return res

#    @api.model
#    def notify_add_item(self, move_data):
#        return True