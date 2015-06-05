const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.src.settings;
const AwsUtil = Me.imports.src.awsUtil;

let settingsJsonm, instanceId, host;
const Ec2PopupMenuItem = new Lang.Class({
    Name: 'Ec2PopupMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function (host, environment, instanceId, settings, params) {

        this.parent(params);
        this.settingsJson = Settings.getSettingsJSON(settings);
        this.instanceId = instanceId;
        this.host=host;
        this.box = new St.BoxLayout({style_class: 'popup-combobox-item'});
        this.label = new St.Label({text: environment});

        this.box.add(this.label);
        this.actor.add_child(this.box);
        this.actor.connect('button-press-event', Lang.bind(this, this._onButtonPress));

    },
    _onButtonPress: function (actor, event) {
        let button = event.get_button();
        if (button == 1) {
            let command = "ssh " + this.settingsJson["username"] + "@" + this.host;
            Util.spawn(['/usr/bin/guake']);
            Util.spawn(['/usr/bin/guake', '-n', 'instance', '-e', command]);
        } else if (button == 3) {
            AwsUtil.terminateInstance(this.instanceId, this.settingsJson);
            // update instances
        }
    }

});
