const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Ec2PopupSubMenuConnectItem = Me.imports.src.ec2PopupSubMenuConnectItem;
const Ec2PopupSubMenuTerminateItem = Me.imports.src.ec2PopupSubMenuTerminateItem;
const AwsUtil = Me.imports.src.awsUtil;

let settingsJsonm, instanceId, host;
const Ec2PopupSubMenu = new Lang.Class({
    Name: 'Ec2PopupSubMenu',
    Extends: PopupMenu.PopupSubMenuMenuItem,

    _init: function (publicIp, privateIp, environment, instanceId, settings, params) {
        this.parent(environment, "", params);
        this.settingsJson =settings;
        this.instanceId = instanceId;
        this.publicIp = publicIp;
        this.privateIp = privateIp;
        this.menu.addMenuItem(new Ec2PopupSubMenuConnectItem.Ec2PopupSubMenuConnectItem(this.settingsJson, this.publicIp, this.privateIp, environment,{}))
        this.menu.addMenuItem(new Ec2PopupSubMenuTerminateItem.Ec2PopupSubMenuTerminateItem(this.settingsJson, this.instanceId, {}))
    }

});
