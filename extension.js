const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Convenience = Me.imports.lib.convenience;
const Ec2TrayItem = Me.imports.src.ec2TrayItem;
let text, button;
let statusIcon;
let settings;

function init() {
    settings = Convenience.getSettings();
    statusIcon = new Ec2TrayItem.Ec2TrayItem(settings);
}

function enable() {
    Main.panel.addToStatusArea("ec2", statusIcon);
}

function disable() {
    statusIcon.destroy();
}