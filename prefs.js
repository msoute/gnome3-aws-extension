/*
 * @author Marcel Soute
 */

const Lang = imports.lang;
const Gtk = imports.gi.Gtk;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.lib.convenience;
const Settings = Me.imports.src.settings;


let settings, settingsJSON;

function init() {
    settings = Convenience.getSettings();
    settingsJSON = Settings.getSettingsJSON(settings);
}

function buildPrefsWidget() {
    let frame = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL, border_width: 10});

    addAwsCliProfile(frame);
    addSshUserName(frame);
    addSshPublicKey(frame);
    addTagToFilter(frame);
    addBastionHost(frame);
    frame.show_all();

    return frame;
}


function addTagToFilter(frame) {
    let hboxFilterTag = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
    let labelFilterTag = new Gtk.Label({label: "Aws Tag Filter Value", xalign: 0});
    let inputFilterTag = new Gtk.Entry({width_chars : 35, text: settingsJSON['aws_filter_tag_value'] === undefined ? "" : settingsJSON['aws_filter_tag_value']});
    inputFilterTag.connect("changed", Lang.bind(this, function(input){ updateServerSetting("aws_filter_tag_value", input.text); }));

    hboxFilterTag.pack_start(labelFilterTag, true, true, 0);
    hboxFilterTag.add(inputFilterTag);
    frame.add(hboxFilterTag);
}

function addAwsCliProfile(frame) {
    let hboxAwsCliProfile = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
    let labelAwsCliProfile = new Gtk.Label({label: "Aws Cli profile", xalign: 0});
    let inputAwsCliProfile = new Gtk.Entry({width_chars : 35, text: settingsJSON['aws_cli_profile'] === undefined ? "" : settingsJSON['aws_cli_profile']});
    inputAwsCliProfile.connect("changed", Lang.bind(this, function(input){ updateServerSetting("aws_cli_profile", input.text); }));

    hboxAwsCliProfile.pack_start(labelAwsCliProfile, true, true, 0);
    hboxAwsCliProfile.add(inputAwsCliProfile);
    frame.add(hboxAwsCliProfile);
}

function addSshUserName(frame) {
    let hboxUserName = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
    let labelUserName = new Gtk.Label({label: "SSH Username ", xalign: 0});
    let inputUserName = new Gtk.Entry({width_chars : 35, text: settingsJSON['username'] === undefined ? "" : settingsJSON['username']});
    inputUserName.connect("changed", Lang.bind(this, function(input){ updateServerSetting('username', input.text); }));

    hboxUserName.pack_start(labelUserName, true, true, 0);
    hboxUserName.add(inputUserName);

    frame.add(hboxUserName);
}
function addSshPublicKey(frame) {
    let hboxSshPublicKey = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
    let labelSshPublicKey = new Gtk.Label({label: "SSH Key ", xalign: 0});
    let inputSshPublicKey = new Gtk.Entry({width_chars : 35, text:  settingsJSON['ssh_key'] === undefined ? "" : settingsJSON['ssh_key']});
    inputSshPublicKey.connect("changed", Lang.bind(this, function(input){ updateServerSetting('ssh_key', input.text); }));

    hboxSshPublicKey.pack_start(labelSshPublicKey, true, true, 0);
    hboxSshPublicKey.add(inputSshPublicKey);

    frame.add(hboxSshPublicKey);
}

function addBastionHost(frame) {
    let hboxBastionHost = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
    let labelBastionHost = new Gtk.Label({label: "Bastion Host ", xalign: 0});
    let inputBastionHost = new Gtk.Entry({width_chars : 35, text: settingsJSON['bastion_host'] === undefined ? "" : settingsJSON['bastion_host']});
    inputBastionHost.connect("changed", Lang.bind(this, function(input){ updateServerSetting('bastion_host', input.text); }));

    hboxBastionHost.pack_start(labelBastionHost, true, true, 0);
    hboxBastionHost.add(inputBastionHost);

    frame.add(hboxBastionHost);
}

function updateServerSetting(setting, value) {
    settingsJSON = Settings.getSettingsJSON(settings);
    settingsJSON[setting] = value;
    settings.set_string("settings-json", JSON.stringify(settingsJSON));
}