const Lang = imports.lang;
const St = imports.gi.St;
const Mainloop = imports.mainloop;
const Glib = imports.gi.GLib;
const Soup = imports.gi.Soup;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Ec2PopupMenu = Me.imports.src.ec2PopupMenu;
const Settings = Me.imports.src.settings;

let popupMenu;

const Ec2TrayItem = new Lang.Class({
    Name: 'Ec2TrayItem',
    Extends: PanelMenu.Button,
    _init: function (settings) {
        this.parent(0.25, "EC2 Panel Button", false );
        this.settingsJson = Settings.getSettingsJSON(settings);
        this._iconActor = new St.Icon({
            style_class: 'ec2-icon'
        });
        this.actor.add_actor(this._iconActor);
        popupMenu = new Ec2PopupMenu.Ec2PopupMenu(this, this.actor, 0.25, St.Side.TOP,  this.settingsJson);
        this.setMenu(popupMenu);
    },

    destroy: function() {
        this.parent();
    },

    updateSettings: function(settings) {
        popupMenu.updateSettings(Settings.getSettingsJSON(settings));
    }
})

