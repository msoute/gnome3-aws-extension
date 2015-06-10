const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();

const Ec2PopupSubMenuConnectItem = new Lang.Class({
        Name: 'Ec2PopupSubMenuConnectItem',
        Extends: PopupMenu.PopupBaseMenuItem,

        _init: function (settings, host, params) {
            this.parent(params);
            this.settings = settings;
            this.host = host;

            this.box = new St.BoxLayout({style_class: 'popup-combobox-item', style:'margin-left: 20px'});
            this.label = new St.Label({text: 'Connect'});

            //this.box.add(this.icon);
            this.box.add(this.label);
            this.actor.add_child(this.box);

            this.connect("activate", Lang.bind(this, function () {
                let command = "ssh " + this.settings["username"] + "@" + this.host;
                Util.spawn(['/usr/bin/guake']);
                Util.spawn(['/usr/bin/guake', '-n', 'instance', '-e', command]);
            }));
        },
        updateSettings: function (settings) {
            this.settings = settings;
            this.label.text = this.settings.name;
        }
    })
    ;