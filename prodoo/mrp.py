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

from openerp import models, api


class Prodoo(models.AbstractModel):
    _name = 'prodoo'

    @api.model
    def get_warehouse(self):
        return self.env['stock.warehouse'].search_read([], ['name'])


class MrpProduction(models.Model):
    _inherit='mrp.production'

    @api.multi
    def prodoo_force_production(self):
        return self.pool['mrp.production'].force_production(
            self._cr, self._uid, self.id, self._context)

    @api.multi
    def prodoo_produce(self):
        wizard_obj = self.env['mrp.product.produce']
        for mo in self:
            mo.force_production()
            wiz = wizard_obj.with_context({'active_id': mo.id}).create({})
            vals = wiz.on_change_qty(wiz.product_qty, [])
            wiz.write({'consume_lines': vals['value']['consume_lines']})
            mo.action_produce(mo.id, wiz.product_qty, wiz.mode, wiz=wiz)
        return True

    @api.model
    def _prepare_sync_data_prodoo(self, record):
        sale = record.lot_id.sale_id
        status = {
            'confirmed': 'En attente de matière première',
            'ready': 'Prêt à traiter',
            }
        return {
            'id': record.id,
            'name': record.name,
            'product': record.product_id.name,
            'date_requested': sale.requested_date or '',
            'customer': sale.partner_id.name,
            'move_lines': record.move_lines._prepare_prodoo_move_line(),
            'workcenter_lines': record.workcenter_lines.mapped('name'),
            'state': status[record.state],
            'warehouse_id': sale.warehouse_id.id,
            }


class StockMove(models.Model):
    _inherit = "stock.move"

    @api.one
    def _prepare_prodoo_move_line(self):
        if self.product_id.default_code:
            name = "[%s] " % self.product_id.default_code
        else:
            name = ""
        name += self.product_id.name
        return {
            'product_qty': self.product_qty,
            'product_name': name,
            }
