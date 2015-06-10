const Lang = imports.lang;
const St = imports.gi.St;
const Mainloop = imports.mainloop;
const Glib = imports.gi.GLib;
const Soup = imports.gi.Soup;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Ec2PopupMenu = Me.imports.src.ec2PopupMenu;
let settings;

const Ec2TrayItem = new Lang.Class({
    Name: 'Ec2TrayItem',
    Extends: PanelMenu.Button,
    _init: function (settings) {
        this.parent(0.25, "EC2 Panel Button", false );
        this.settings = settings;
        this._iconActor = new St.Icon({
            style_class: 'ec2-icon'
        });
        this.actor.add_actor(this._iconActor);
        this.setMenu(new Ec2PopupMenu.Ec2PopupMenu(this, this.actor, 0.25, St.Side.TOP, settings));
    },

    destroy: function() {
        this.parent();
    }
})

