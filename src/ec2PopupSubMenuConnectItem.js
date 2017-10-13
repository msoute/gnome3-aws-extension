const Lang = imports.lang;
const St = imports.gi.St;
const Gio = imports.gi.Gio;

const PopupMenu = imports.ui.popupMenu;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const SshUtil = Me.imports.src.sshUtil;

const Ec2PopupSubMenuConnectItem = new Lang.Class({
        Name: 'Ec2PopupSubMenuConnectItem',
        Extends: PopupMenu.PopupBaseMenuItem,

        _init: function (settings, publicIp, privateIp, instanceId, environment, params) {
            this.parent(params);
            this.box = new St.BoxLayout({style_class: 'popup-combobox-item', style:'margin-left: 20px'});
            this.label = new St.Label({text: "Connect (" + instanceId + ")"});
            this.box.add(this.label);
            this.actor.add_child(this.box);

            this.connect("activate", Lang.bind(this, function () {
                let properties = undefined;
                let ip = undefined;
                let command = undefined;

                if (settings["bastion_host"] !== undefined && settings["bastion_host"].length !== 0) {
                    properties = "-o 'ProxyCommand ssh "  + settings["username"] + "@" + settings["bastion_host"] + " nc %h %p ' ";
                    ip = privateIp;
                } else {
                    ip = publicIp;
                }
                if (settings["strict_host_key_checking"] !== undefined && settings["strict_host_key_checking"] === false) {
                    properties = properties + "-o 'StrictHostKeyChecking=no'";
                }

                let identity = (settings["ssh_key"] !== undefined) ? '-i' + " "+settings["ssh_key"] : "";

                if (properties) {
                    command = "ssh " +identity+" "+ properties +" "+ settings["username"] + "@" + ip;
                } else {
                    command = "ssh " +identity+" "+ settings["username"] + "@" + ip;
                }
                SshUtil.connect(command, environment)
            }));
        },
        updateSettings: function (settings) {
            this.settings = settings;
            this.label.text = this.settings.name;
        }
    });