const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const PopupMenu = imports.ui.popupMenu;
const ModalDialog = imports.ui.modalDialog;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const AwsUtil = Me.imports.src.awsUtil;
let dialog, _settingsJson;
let instanceIdToTerminate;

const Ec2PopupSubMenuTerminateItem = new Lang.Class({
    Name: 'Ec2PopupSubMenuTerminateItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function (settingsJson, instanceId, params) {
        this.parent(params);
        _settingsJson = settingsJson;
        this.box = new St.BoxLayout({style_class: 'popup-combobox-item', style: 'margin-left: 20px;color:red'});
        this.label = new St.Label({text: 'Terminate instance'});

        this.box.add(this.label);
        this.actor.add_child(this.box);

        this.connect("activate", Lang.bind(this, function () {
            if (!dialog) {
                this._createWarningDialog(instanceId);
            }
        }));
    },
    _createWarningDialog: function (instanceId) {
        dialog = new TerminateInstanceDialog(instanceId);
        dialog.open();
    }
});

const TerminateInstanceDialog = new Lang.Class({
    Name: 'TerminateInstanceDialog',
    Extends: ModalDialog.ModalDialog,
    _init: function (instanceId) {
        this.parent({
            styleClass: 'end-session-dialog',
            shellReactive: false, destroyOnClose: true
        });
        this.label = new St.Label({text: 'Terminate instance : ' + instanceId});
        let mainContentLayout = new St.BoxLayout({vertical: false});
        mainContentLayout.add(this.label);
        instanceIdToTerminate = instanceId;

        this.contentLayout.add(mainContentLayout, {x_fill: true, y_fill: false});
        this.addButton({label: "Cancel", action: this.cancelTerminateInstance}, {});
        this.addButton({label: "Terminate", action: this.terminateInstance}, {});
    },
    terminateInstance: function () {
        if (dialog) {
            AwsUtil.terminateInstance(instanceIdToTerminate, _settingsJson);
            dialog.close();
            instanceIdToTerminate = null;
            dialog = null;
        }
    },
    cancelTerminateInstance: function () {
        if (dialog) {
            instanceIdToTerminate = null;
            dialog.close();
            dialog = null;
        }
    }
});

