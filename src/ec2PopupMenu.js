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
const Settings = Me.imports.src.settings;

let settings;

const Ec2PopupMenu = new Lang.Class({
    Name: 'Ec2PopupMenu',
    Extends: PopupMenu.PopupMenu,

    _init: function (indicator, sourceActor, arrowAlignment, arrowSide, settings) {
        this.parent(sourceActor, arrowAlignment, arrowSide);
        // add seperator to popup menu
        this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());

        let settingsJSON = Settings.getSettingsJSON(settings);
        let filterValue  = settingsJSON['aws_filter_tag_value'];

        let [res, out, err, status] = GLib.spawn_command_line_sync("aws --profile devops ec2 describe-instances --output json --filters Name=tag:Name,Values="+filterValue+" --query 'Reservations[*].Instances[*].{Ip:PublicIpAddress, Tag:Tags}'");
        let awsJsonResponse = JSON.parse(out.toString());
        this.instances = new Ec2PopupMenuScrollSection.Ec2PopupMenuScrollSection();

        awsJsonResponse.forEach((ec2Instance) => {
            let environment = this.findTag(ec2Instance, "Name");
            this.instances.addMenuItem(new Ec2PopupMenuItem.Ec2PopupMenuItem(ec2Instance[0]['Ip'],environment,  settings));
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
    },
    findTag: function (ec2Instance, key) {
        for (var i = 0; i < ec2Instance[0]['Tag'].length; i++) {
            if (ec2Instance[0]['Tag'][i]['Key'] == key) {
                return ec2Instance[0]['Tag'][i]['Value'];
            }
        }
    }
});