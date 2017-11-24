# coding: utf-8
# Copyright 2014 Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp import api, models, exceptions, _
import base64
import simplejson

TELIUM_PAYMENT_TYPE_MAPPING = {
    'debit': '0',
    'credit': '1',
    'cancel': 2,
    'pre_authorization': 4,
}


class ProxyActionHelper(models.AbstractModel):
    _name = "proxy.action.helper"
    _description = "Forward HTTP actions to front-end proxy"

    @api.model
    def get_print_data_action(
            self, data,
            printer_name=None,
            raw=False,
            to_encode64=False,
            copies=1,
            host='https://localhost'):
        """ Prepare a PyWebdriver.print action """
        if to_encode64:
            data = base64.b64encode(data)
        kwargs = {'options': {}}
        if copies > 1:
            kwargs['options']['copies'] = copies
        if raw:
            kwargs['options']['raw'] = True
        return {
            'url': '%s/cups/printData' % host,
            'params': {
                'args': [printer_name, data],
                'kwargs': kwargs,
                },
            'type': 'POST',
            }

    def get_print_report_action(self, records, report_name, **kwargs):
        data = self.env['report'].get_pdf(records.ids, report_name)
        data = base64.b64encode(data)
        return self.get_print_data_action(data, **kwargs)

    def send_proxy(self, todo):
        """ @param todo: list of requests
                         (printings, webservices)
        """
        return {
            'type': 'ir.actions.act_proxy',
            'action_list': todo,
            }

    @api.model
    def display_failure_message(self, result):
        raise exceptions.Warning(
            _('Proxy action have failed, check if pywebdriver is running or '
              'if the hardware is connected to the computer'))

    @api.model
    def get_telium_data_action(self, amount, payment_mode='card',
                               payment_type='debit', currency='EUR',
                               delay=False, delay_timeout=120,
                               auto=False, host='https://localhost',
                               return_method=False, return_model=False):
        """
            if delay is true, the terminal answer will be at the end of the
            transactions, else, it will be immediatly after the payment
            terminal received the request

            if delay is True, we must set a hight timeout to let time to
            the customer to make the transaction

            if auto is true, the authorization request will be forced.
        """
        payment_info = {
            'amount': amount,
            'payment_mode': payment_mode,
            'payment_type': TELIUM_PAYMENT_TYPE_MAPPING.get('payment_type'),
            'currency_iso': currency,
            'auto': auto and 'B011' or 'B010',
            'delay': delay and 'A010' or 'A011',
        }
        if delay:
            payment_info = delay_timeout
        url = ('%s/hw_proxy/payment_terminal_transaction_start_with_answer'
               % host)
        return {
            'url': url,
            'params': {
                'params': {
                    'payment_info': simplejson.dumps(payment_info)
                }
            },
            'type': 'POST',
            'block_ui': True,
            'return_method': return_method,
            'return_model': return_model,
        }
