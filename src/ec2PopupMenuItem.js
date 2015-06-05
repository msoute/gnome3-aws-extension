
const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.src.settings;

let settingsJson;
const Ec2PopupMenuItem= new Lang.Class({
    Name: 'Ec2PopupMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(host, environement, settings, params) {

        this.parent(params);
        let command;
        settingsJSON = Settings.getSettingsJSON(settings);

        this.box = new St.BoxLayout({ style_class: 'popup-combobox-item' });
        this.label = new St.Label({ text: environement});

        this.box.add(this.label);
        this.actor.add_child(this.box);

        command = "ssh " +settingsJSON["username"]+"@"+host;
        this.connect("activate", function() {
            Util.spawn(['/usr/bin/guake']);
            Util.spawn(['/usr/bin/guake', '-n', 'instance', '-e', command]);
        });
    }
});
