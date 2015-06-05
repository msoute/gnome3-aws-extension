const Lang = imports.lang;
const Shell = imports.gi.Shell;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const PopupMenu = imports.ui.popupMenu;
const Config = imports.misc.config;
const GLib = imports.gi.GLib;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Ec2PopupMenuScrollSection = Me.imports.src.ec2PopupMenuScrollSection;
const Ec2PopupMenuItem = Me.imports.src.ec2PopupMenuItem;
const AwsUtil = Me.imports.src.awsUtil;

let settings;

const Ec2PopupMenu = new Lang.Class({
    Name: 'Ec2PopupMenu',
    Extends: PopupMenu.PopupMenu,

    _init: function (indicator, sourceActor, arrowAlignment, arrowSide, settings) {
        this.parent(sourceActor, arrowAlignment, arrowSide);
        // add seperator to popup menu
        this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        let awsJsonResponse = AwsUtil.listInstances(settings);
        this.instances = new Ec2PopupMenuScrollSection.Ec2PopupMenuScrollSection();

        awsJsonResponse.forEach((ec2Instance) => {
            if (ec2Instance[0]['State'] === "running") {
                let environment = AwsUtil.findTag(ec2Instance, "Name");
                this.instances.addMenuItem(new Ec2PopupMenuItem.Ec2PopupMenuItem(ec2Instance[0]['Ip'], environment, ec2Instance[0]['InstanceId'], settings));
            }
        });

        this.addMenuItem(this.instances);

        // add seperator to popup menu
        this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        // add link to settings dialog
        this._menu_settings = new PopupMenu.PopupMenuItem(_("Settings"));
        this._menu_settings.connect("activate", function () {
            // call gnome settings tool for this extension
            let app = Shell.AppSystem.get_default().lookup_app("gnome-shell-extension-prefs.desktop");
            if (app != null) {
                let info = app.get_app_info();
                let timestamp = global.display.get_current_time_roundtrip();
                info.launch_uris([Me.uuid], global.create_app_launch_context(timestamp, -1));
            }
        });
        this.addMenuItem(this._menu_settings);
    }
});