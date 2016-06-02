# -*- coding: utf-8 -*-
# © 2016 Akretion (http://www.akretion.com)
# Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp.osv import fields, orm
from datetime import datetime
from openerp.tools import DEFAULT_SERVER_DATETIME_FORMAT


class ResPartner(orm.Model):
    _inherit = 'res.partner'

    def _get_num_pick(self, cr, uid, ids, period, context=None):
        now = datetime.now()
        to_date = now.replace(hour=23, minute=59, second=59, microsecond=59)
        from_kwargs = {'hour': 0, 'minute': 0, 'microsecond': 0}
        if period == 'month':
            from_kwargs['day'] = 1
        from_date = now.replace(**from_kwargs)
        picking_obj = self.pool['stock.picking']
        return picking_obj.search(cr, uid, [
            ('picker_id', 'in', ids),
            ('date_picked', '>',
                from_date.strftime(DEFAULT_SERVER_DATETIME_FORMAT)),
            ('date_picked', '<',
                to_date.strftime(DEFAULT_SERVER_DATETIME_FORMAT)),
            ], context=context, count=True)

    def _compute_num_pick(self, cr, uid, ids, field_name, args, context=None):
        result = {}
        for partner in self.browse(cr, uid, ids, context=context):
            result[partner.id] = {
                'num_pick_today': self._get_num_pick(
                    cr, uid, [partner.id], 'day', context=context),
                'num_pick_month': self._get_num_pick(
                    cr, uid, [partner.id], 'month', context=context)
            }
        return result

    _columns = {
        'is_picker': fields.boolean('Is Picker'),
        'num_pick_today': fields.function(
            _compute_num_pick,
            string='Num Pick Today',
            multi='numpick',
            type='float'),
        'num_pick_month': fields.function(
            _compute_num_pick,
            string='Num Pick Today',
            multi='numpick',
            type='float'),
    }

    def create(self, cr, uid, vals, context=None):
        if context and context.get('default_is_picker'):
            vals['ref'] = self.pool['ir.sequence'].get(
                cr, uid, 'res.partner.picker', context=context)
        return super(ResPartner, self).create(cr, uid, vals, context=context)

    def get_top_five(self, cr, uid, context=None):
        picker_ids = self.search(cr, uid, [('is_picker', '=', True)])
        top_five_today = []
        top_five_month = []
        for picker in self.browse(cr, uid, picker_ids, context=context):
            top_five_today.append([picker.num_pick_today, picker.name])
            top_five_month.append([picker.num_pick_month, picker.name])
        top_five_today.sort(reverse=True)
        top_five_month.sort(reverse=True)
        return {
            'today': top_five_today[:5],
            'month': top_five_month[:5],
            }
