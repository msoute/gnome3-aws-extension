const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;

const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const SshUtil = Me.imports.src.sshUtil;

const Ec2PopupSubMenuConnectItem = new Lang.Class({
        Name: 'Ec2PopupSubMenuConnectItem',
        Extends: PopupMenu.PopupBaseMenuItem,

        _init: function (settings, publicIp, privateIp, environment, params) {
            this.parent(params);
            this.box = new St.BoxLayout({style_class: 'popup-combobox-item', style:'margin-left: 20px'});
            this.label = new St.Label({text: 'Connect'});
            this.box.add(this.label);
            this.actor.add_child(this.box);

            this.connect("activate", Lang.bind(this, function () {
                let command = undefined;
                if (settings["bastion_host"] !== undefined && settings["bastion_host"].length !== 0) {
                    command = "ssh -o 'ProxyCommand ssh "  + settings["username"] + "@" + settings["bastion_host"] + " nc %h %p ' " + settings["username"] + "@"+ privateIp;
                } else {
                    command = "ssh " + settings["username"] + "@" + publicIp;
                }
                SshUtil.connect(command, environment)
            }));
        },
        updateSettings: function (settings) {
            this.settings = settings;
            this.label.text = this.settings.name;
        }
    })
    ;