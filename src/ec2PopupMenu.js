const Lang = imports.lang;
const Shell = imports.gi.Shell;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const PopupMenu = imports.ui.popupMenu;
const Config = imports.misc.config;
const GLib = imports.gi.GLib;
const ModalDialog = imports.ui.modalDialog;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Ec2PopupMenuScrollSection = Me.imports.src.ec2PopupMenuScrollSection;
const Ec2PopupSubMenu = Me.imports.src.ec2PopupSubMenu;
const Ec2PopupSearchMenu= Me.imports.src.ec2PopupSearchMenu;
const AwsUtil = Me.imports.src.awsUtil;

let instances;
let settingsJson;
let dialog;
let searchMenu;

const Ec2PopupMenu = new Lang.Class({
    Name: 'Ec2PopupMenu',
    Extends: PopupMenu.PopupMenu,

    _init: function (indicator, sourceActor, arrowAlignment, arrowSide, settings) {
        settingsJson = settings;
        instances = new Ec2PopupMenuScrollSection.Ec2PopupMenuScrollSection();
        this._updateInstanceList();
        searchMenu = new Ec2PopupSearchMenu.Ec2PopupSearchMenu(instances, settingsJson);
        this.parent(sourceActor, arrowAlignment, arrowSide);
        this.addMenuItem(searchMenu);
        this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.addMenuItem(instances);
        this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.addMenuItem(this._createIconBarMenuItem());

    },
    _createActionButton: function (iconName, accessibleName) {
        let icon = new St.Button({
            reactive: true,
            can_focus: true,
            track_hover: true,
            accessible_name: accessibleName,
            style_class: 'system-menu-action'
        });
        icon.child = new St.Icon({icon_name: iconName});
        return icon;
    },
    _createIconBarMenuItem: function () {
        this.item = new PopupMenu.PopupBaseMenuItem({reactive: false, can_focus: false});
        this._refreshAction = this._createActionButton('view-refresh-symbolic', 'refresh');
        this._refreshAction.connect('clicked', Lang.bind(this, this._updateInstanceList));
        this.item.actor.add(this._refreshAction, {expand: true, x_fill: false, x_align: St.Align.START});
        this._settingsAction = this._createActionButton('preferences-system-symbolic', _("Settings"));
        this._settingsAction.connect('clicked', Lang.bind(this, this._onSettingsClicked));
        this.item.actor.add(this._settingsAction, {expand: true, x_fill: false, x_align: St.Align.END});
        return this.item;
    },
    _onSettingsClicked: function () {
        let app = Shell.AppSystem.get_default().lookup_app("gnome-shell-extension-prefs.desktop");
        if (app != null) {
            let info = app.get_app_info();
            let timestamp = global.display.get_current_time_roundtrip();
            info.launch_uris([Me.uuid], global.create_app_launch_context(timestamp, -1));

        }
        this.itemActivated();
    },
    _updateInstanceList: function () {
            AwsUtil.updateInstanceList(instances, settingsJson);
    },
    updateSettings: function(settings) {
        settingsJson = settings;
        //searchMenu.updateSettings(settings)
    }
});
