const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Convenience = Me.imports.lib.convenience;
const Ec2TrayItem = Me.imports.src.ec2TrayItem;
let statusIcon;
let settings;
let event_signals = [];

function init(extensionMeta) {
    let theme = imports.gi.Gtk.IconTheme.get_default();
    theme.append_search_path(extensionMeta.path + "/icons");
    settings = Convenience.getSettings();

}

function enable() {
    statusIcon = new Ec2TrayItem.Ec2TrayItem(settings);
    Main.panel.addToStatusArea("ec2", statusIcon);
    event_signals.push(settings.connect('changed::settings-json', function () {
        statusIcon.updateSettings(settings);
    }));
}

function disable() {
    statusIcon.destroy();
    // disconnect all signal listeners
    for (var i = 0; i < event_signals.length; ++i) {
        settings.disconnect(event_signals[i]);
    }
}