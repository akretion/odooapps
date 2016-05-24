# -*- coding: utf-8 -*-
# © 2016 Akretion (http://www.akretion.com)
# Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp.osv import fields, orm


class StockPicking(orm.Model):
    _inherit = 'stock.picking'

    _columns = {
        'picker_id': fields.many2one(
            'res.partner',
            string='Order Picker',
            domain=[('is_picker', '=', True)]),
        'date_picked': fields.datetime('Picked Date')
    }


class StockPickingOut(orm.Model):
    _inherit = 'stock.picking.out'

    def __init__(self, pool, cr):
        for field in ['picker_id', 'date_picked']:
            self._columns[field] = StockPicking._columns[field]
        super(StockPickingOut, self).__init__(pool, cr)
