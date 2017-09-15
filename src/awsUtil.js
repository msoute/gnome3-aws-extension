const Me = imports.misc.extensionUtils.getCurrentExtension();
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;

const Ec2PopupSubMenu = Me.imports.src.ec2PopupSubMenu;

function updateInstanceList(instances, settingsJson) {
    try {
        this.listInstances(settingsJson, function (awsJsonResponse) {
                if (awsJsonResponse === undefined) {
                    return;
                }
                instances.removeAll();
                awsJsonResponse.forEach((ec2Instance) => {
                    if (ec2Instance[0]['State'] === "running") {
                        let environment = findTag(ec2Instance, "Name");
                        instances.addMenuItem(new Ec2PopupSubMenu.Ec2PopupSubMenu(ec2Instance[0]['PublicIp'], ec2Instance[0]['PrivateIp'], environment, ec2Instance[0]['InstanceId'], settingsJson));
                    }
                });
            }
        );
    } catch (e) {
        global.log(e);
        instances.addMenuItem(new PopupMenu.PopupMenuItem(_("Error") + ": " + e.toLocaleString(), {style_class: 'error'}));
    }
}


function listInstances(settings, callback) {
    if (settings['aws_filter_tag_value'].length === 0) {
        return undefined;
    }
    let filterValue = settings['aws_filter_tag_value'];

    let array = ['/usr/bin/aws', '--profile', settings['aws_cli_profile'], 'ec2', 'describe-instances', '--output', 'json', '--filters', "Name=tag:Name,Values=" + filterValue, '--query', 'Reservations[*].Instances[*].{PublicIp:PublicIpAddress, PrivateIp:PrivateIpAddress, Tag:Tags, InstanceId:InstanceId,State:State.Name}'];

    let [res_async, pid, in_fd, out_fd, err_fd] = GLib.spawn_async_with_pipes(null, array, null, 0, null);
    let out_reader = new Gio.DataInputStream({
        base_stream: new Gio.UnixInputStream({fd: out_fd})
    });

    let [resultJson, length] = (out_reader.read_upto("", GLib.PRIORITY_DEFAULT, null));

    if (resultJson === null || resultJson.length === 0) {
        return undefined;
    }
    let jsonResponse = JSON.parse(resultJson);
    callback(jsonResponse.sort(function (a, b) {
        return findTag(a, "Name").localeCompare(findTag(b, "Name"))
    }));
}

function terminateInstance(instanceId, settingsJSON) {
    if (instanceId) {
        global.log("Terminating instance " + instanceId);
        let [res, out, err, status] = GLib.spawn_command_line_sync("aws --profile " + settingsJSON['aws_cli_profile'] + " ec2 terminate-instances --output json --instance-ids " + instanceId);
        return res;
    } else {
        global.log("Unable to terminate instanceId, no instanceId value");
        return false;
    }
}

function findTag(ec2Instance, key) {
    for (let i = 0; i < ec2Instance[0]['Tag'].length; i++) {
        if (ec2Instance[0]['Tag'][i]['Key'] === key) {
            return ec2Instance[0]['Tag'][i]['Value'];
        }
    }
    return null;
}