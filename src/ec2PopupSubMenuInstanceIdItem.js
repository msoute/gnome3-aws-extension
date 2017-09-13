const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;

const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();

const Ec2PopupSubMenuInstanceIdItem = new Lang.Class({
        Name: 'Ec2PopupSubMenuInstanceIdItem',
        Extends: PopupMenu.PopupBaseMenuItem,
        _init: function (settings, instanceId,  params) {
            this.parent(params);
            this.box = new St.BoxLayout({style_class: 'popup-combobox-item', style:'margin-left: 20px'});
            this.label = new St.Label({text: instanceId});
            this.box.add(this.label);
            this.actor.add_child(this.label);
        },
        updateSettings: function (settings) {
            this.settings = settings;
            this.label.text = this.settings.name;
        }
    });