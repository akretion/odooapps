# -*- coding: utf-8 -*-
# © 2016 Akretion (http://www.akretion.com)
# Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp.osv import fields, orm
from openerp.tools.translate import _
from openerp.tools import DEFAULT_SERVER_DATETIME_FORMAT
from datetime import datetime


class StockPicking(orm.Model):
    _inherit = 'stock.picking'

    _columns = {
        'picker_id': fields.many2one(
            'res.partner',
            string='Order Picker',
            domain=[('is_picker', '=', True)]),
        'date_picked': fields.datetime('Picked Date'),
        'week_picked': fields.char('Picked Week'),
    }


class StockPickingOut(orm.Model):
    _inherit = 'stock.picking.out'

    def __init__(self, pool, cr):
        for field in ['picker_id', 'date_picked', 'week_picked']:
            self._columns[field] = StockPicking._columns[field]
        super(StockPickingOut, self).__init__(pool, cr)

    def assigned_picker(self, cr, uid, ids, picker_id, context=None):
        picked_ids = self.search(cr, uid, [
            ('picker_id', '!=', False),
            ('id', 'in', ids),
            ], context=context)
        if picked_ids:
            picked = self.browse(cr, uid, picked_ids, context=context)
            picked_name = ', '.join([pick.name for pick in picked])
            raise orm.except_orm(
                _("User Error"),
                _("The following Picking are already picked : %s")
                % picked_name,
                )
        else:
            today = datetime.now()
            self.write(cr, uid, ids, {
                'picker_id': picker_id,
                'date_picked': today.strftime(DEFAULT_SERVER_DATETIME_FORMAT),
                'week_picked': today.strftime("%Y-%W"),
                })
        return True
