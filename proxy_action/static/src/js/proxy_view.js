openerp.proxy_action = function (instance) {
    instance.web.ActionManager.include({
        ir_actions_act_proxy: function (action, options) {
            action.action_list.forEach(function (task) {
                if (task['block_ui']) {
                    openerp.web.blockUI()
                }
                $.ajax({
                    url: task['url'],
                    type: task['type'],
                    data: JSON.stringify(task['params']),
                    contentType: 'application/json',
                }).done(function (result) {
                    console.log("Proxy action have been done with sucess", result, task['return_method']);
                    if (task['return_method'] && task['return_model']) {
                        openerp.session.rpc('/web/dataset/call_kw/' + task['return_model'] + '/' + task['return_method'],
                            {model: task['return_model'],
                             method: task['return_method'],
                             args:[result],
                             kwargs:{}})
                    }
                    if (task['block_ui']) {
                        openerp.web.unblockUI()
                    }
                    openerp.web.unblockUI()
                    //TODO add an UI feedback
                }).fail(function (result) {
                    console.log('Proxy action have failed', result);
                    if (task['block_ui']) {
                        openerp.web.unblockUI()
                    }
                    // Call Odoo instead of using alert so we are more flexible
                    openerp.session.rpc('/web/dataset/call_kw/proxy.action.helper/display_failure_message',
                        {model: 'proxy.action.helper',
                         method: 'display_failure_message',
                         args:[result],
                         kwargs:{}})
                })
            })
            this.do_action({"type":"ir.actions.act_window_close"});
        }
    })
};
