const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.lib.convenience;
const Main = imports.ui.main;

const Settings = Me.imports.src.settings;

const PopupMenu = imports.ui.popupMenu;
const AwsUtil = Me.imports.src.awsUtil;

let instanceList;
let settingsJson;
let label;
const Ec2PopupSearchMenu = new Lang.Class({
    Name: 'Ec2PopupSearchMenu',
    Extends: PopupMenu.PopupBaseMenuItem,
    _init: function (instances, settings, params) {
        instanceList = instances;
        settingsJson = settings;
        this.parent(params);
        this.box = new St.BoxLayout({style_class: 'popup-combobox-item', style: 'margin:0px'});
        label = new St.Entry({text: settingsJson['aws_filter_tag_value'], style: 'width:200px'});
        this.box.add(label);
        this.actor.add_child(this.box);

        this.connect("activate", Lang.bind(this, function (searchMenu) {
            searchMenu._getLog();
        }));
    },
    _getLog: function() {
        let settings = Convenience.getSettings();
        settingsJson['aws_filter_tag_value'] = label.text;
        settings.set_string("settings-json", JSON.stringify(settingsJson));
        AwsUtil.updateInstanceList(instanceList, settingsJson);
    }
});