const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const Settings = Me.imports.src.settings;

const PopupMenu = imports.ui.popupMenu;
const SshUtil = Me.imports.src.sshUtil;

let label;
let settingsJson;

const Ec2PopupSearchMenu = new Lang.Class({
    Name: 'Ec2PopupSubMenuConnectItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function (settings, params) {
        settingsJson = settings;
        this.parent(params);
        this.box = new St.BoxLayout({style_class: 'popup-combobox-item', style: 'margin:0px'});
        label = new St.Entry({text: settingsJson['aws_filter_tag_value'], style: 'width:200px'});
        this.box.add(label);
        this.actor.add_child(this.box);

       /* this.connect("activate", Lang.bind(this, function () {
        }));*/
    },
    updateSettings: function (settings) {
        settingsJson = settings;
        label.setText(settingsJson['aws_filter_tag_value']);

        global.log(settingsJson['aws_filter_tag_value']);
    }
});